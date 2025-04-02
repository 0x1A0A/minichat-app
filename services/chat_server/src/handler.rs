use std::{
    pin::pin,
    time::{Duration, Instant},
};

use actix_ws::AggregatedMessage;
use futures_util::{
    StreamExt as _,
    future::{Either, select},
};
use tokio::{sync::mpsc, time::interval};

use crate::server::{ChatServerHandle, ConnId};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub async fn chat_ws(
    chat_server: ChatServerHandle,
    mut session: actix_ws::Session,
    msg_stream: actix_ws::MessageStream,
) {
    let mut name = None;
    let mut last_heartbeat = Instant::now();
    let mut interval = interval(HEARTBEAT_INTERVAL);

    let (conn_tx, mut conn_rx) = mpsc::unbounded_channel();

    let conn_id = chat_server.connect(conn_tx).await;

    let msg_stream = msg_stream
        .max_frame_size(128 * 1024)
        .aggregate_continuations()
        .max_continuation_size(2 * 1024 * 1024);

    let mut msg_stream = pin!(msg_stream);

    let close_reason = loop {
        let tick = pin!(interval.tick());
        let msg_rx = pin!(conn_rx.recv());

        let messages = pin!(select(msg_stream.next(), msg_rx));

        match select(messages, tick).await {
            Either::Left((Either::Left((Some(Ok(msg)), _)), _)) => match msg {
                AggregatedMessage::Ping(bytes) => {
                    last_heartbeat = Instant::now();
                    session.pong(&bytes).await.unwrap();
                }

                AggregatedMessage::Pong(_) => {
                    last_heartbeat = Instant::now();
                }

                AggregatedMessage::Text(text) => {
                    process_text_msg(&chat_server, &mut session, &text, conn_id, &mut name).await;
                }

                AggregatedMessage::Binary(_bin) => {}

                AggregatedMessage::Close(reason) => break reason,
            },

            Either::Left((Either::Left((Some(Err(_err)), _)), _)) => {
                break None;
            }

            Either::Left((Either::Left((None, _)), _)) => {
                break None;
            }

            Either::Left((Either::Right((Some(chat_msg), _)), _)) => {
                session.text(chat_msg).await.unwrap();
            }

            Either::Left((Either::Right((None, _)), _)) => {
                unreachable!(
                    "all connection message senders were dropped; chat server may have panicked"
                )
            }

            Either::Right((_inst, _)) => {
                if Instant::now().duration_since(last_heartbeat) > CLIENT_TIMEOUT {
                    break None;
                }

                let _ = session.ping(b"").await;
            }
        };
    };

    chat_server.disconnect(conn_id);

    let _ = session.close(close_reason).await;
}

async fn process_text_msg(
    chat_server: &ChatServerHandle,
    session: &mut actix_ws::Session,
    text: &str,
    conn: ConnId,
    name: &mut Option<String>,
) {
    let msg = text.trim();

    if msg.starts_with('/') {
        let mut cmd_args = msg.splitn(2, ' ');

        match cmd_args.next().unwrap() {
            "/join" => match cmd_args.next() {
                Some(room) => {
                    chat_server.join_room(conn, room).await;

                    session.text(format!("joined {room}")).await.unwrap();
                }

                None => {
                    session.text("!!! room name is required").await.unwrap();
                }
            },

            "/name" => match cmd_args.next() {
                Some(new_name) => {
                    name.replace(new_name.to_owned());
                }
                None => {
                    session.text("!!! name is required").await.unwrap();
                }
            },

            _ => {
                session
                    .text(format!("!!! unknown command: {msg}"))
                    .await
                    .unwrap();
            }
        }
    } else {
        let msg = match name {
            Some(name) => format!("{name}: {msg}"),
            None => msg.to_owned(),
        };

        chat_server.send_message(conn, msg).await
    }
}
