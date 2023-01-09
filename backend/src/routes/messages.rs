use std::str::FromStr;

use mongodb::{bson::oid::ObjectId, Client};
use rocket::{
    http::Status,
    response::{
        status,
        stream::{Event, EventStream},
    },
    serde::json::Json,
    tokio::{
        select,
        sync::broadcast::{error::RecvError, Sender},
    },
    Shutdown, State,
};

use crate::{db, models, response};

type ResError = status::Custom<Json<response::ErrorReason>>;

#[get("/messages/<name>")]
pub async fn get_messages_by_room(
    db: &State<Client>,
    name: String,
) -> Result<Json<Vec<models::message::Messages>>, ResError> {
    match db::message::find_messages_in_room(db, name.clone()).await {
        Ok(ok) => Ok(Json(ok)),
        Err(_) => Err(status::Custom(
            Status::BadRequest,
            Json(response::ErrorReason {
                reason: format!("Some Error 'room={}'", name),
            }),
        )),
    }
}

#[post("/message", data = "<payload>")]
pub async fn post_message(
    db: &State<Client>,
    payload: Json<models::message::MessagesPayload>,
    queue: &State<Sender<models::message::MessagesPayload>>,
) -> Result<String, ResError> {
    let _ = queue.send(payload.clone().into_inner());

    let user = match db::user::find_or_insert_user(db, payload.user.clone()).await {
        Ok(u) => ObjectId::from_str(&u),
        Err(err) => {
            return Err(status::Custom(
                Status::InternalServerError,
                Json(response::ErrorReason {
                    reason: format!("find user error {:?}", err),
                }),
            ));
        }
    };

    let user = match user {
        Ok(u) => u,
        Err(err) => {
            return Err(status::Custom(
                Status::InternalServerError,
                Json(response::ErrorReason {
                    reason: format!("create user error {:?}", err),
                }),
            ));
        }
    };

    let room = match db::room::find_or_insert_room(db, payload.room.clone()).await {
        Ok(r) => ObjectId::from_str(&r),
        Err(err) => {
            return Err(status::Custom(
                Status::InternalServerError,
                Json(response::ErrorReason {
                    reason: format!("find room error {:?}", err),
                }),
            ));
        }
    };

    let room = match room {
        Ok(r) => r,
        Err(err) => {
            return Err(status::Custom(
                Status::InternalServerError,
                Json(response::ErrorReason {
                    reason: format!("create room error {:?}", err),
                }),
            ));
        }
    };

    match db::message::insert_message(db, payload.msg.clone(), user, room).await {
        Ok(ok) => Ok(ok),
        Err(err) => Err(status::Custom(
            Status::InternalServerError,
            Json(response::ErrorReason {
                reason: format!("creat message error {:?}", err),
            }),
        )),
    }
}

#[get("/message-stream/<room>")]
pub async fn message_event(
    queue: &State<Sender<models::message::MessagesPayload>>,
    room: String,
    mut end: Shutdown,
) -> EventStream![] {
    let mut rx = queue.subscribe();
    EventStream! {
        loop {
            let msg = select! {
                msg = rx.recv() => match msg {
                    Ok(msg) => msg,
                    Err(RecvError::Closed) => break,
                    Err(RecvError::Lagged(_)) => continue,
                },
                _ = &mut end => break,
            };
            if room == msg.room {
        		yield Event::json(&msg);
            }
        }
    }
}
