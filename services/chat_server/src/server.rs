use std::{
    collections::{HashMap, HashSet},
    io,
};

pub type ConnId = Uuid;
pub type RoomId = String;
pub type Msg = String;

use tokio::sync::{mpsc, oneshot};
use uuid::Uuid;

#[derive(Debug)]
enum Command {
    Connect {
        conn_tx: mpsc::UnboundedSender<Msg>,
        res_tx: oneshot::Sender<ConnId>,
    },

    Disconnect {
        conn: ConnId,
    },

    Join {
        conn: ConnId,
        room: RoomId,
        res_tx: oneshot::Sender<()>,
    },

    Message {
        msg: Msg,
        conn: ConnId,
        res_tx: oneshot::Sender<()>,
    },
}

#[derive(Debug)]
pub struct ChatServer {
    sessions: HashMap<ConnId, mpsc::UnboundedSender<Msg>>,
    rooms: HashMap<RoomId, HashSet<ConnId>>,
    cmd_rx: mpsc::UnboundedReceiver<Command>,
}

impl ChatServer {
    pub fn new() -> (Self, ChatServerHandle) {
        let mut rooms = HashMap::with_capacity(4);
        rooms.insert("main".to_owned(), HashSet::new());

        let (cmd_tx, cmd_rx) = mpsc::unbounded_channel();

        (
            Self {
                sessions: HashMap::new(),
                rooms,
                cmd_rx,
            },
            ChatServerHandle { cmd_tx },
        )
    }

    async fn send_system_message(&self, room: &str, source: ConnId, msg: impl Into<Msg>) {
        let Some(sessions) = self.rooms.get(room) else {
            return;
        };

        let msg = msg.into();

        for conn_id in sessions {
            if *conn_id == source {
                continue;
            }

            if let Some(tx) = self.sessions.get(conn_id) {
                let _ = tx.send(msg.clone());
            }
        }
    }

    async fn send_message(&self, conn: ConnId, msg: impl Into<Msg>) {
        if let Some(room) = self
            .rooms
            .iter()
            .find_map(|(room, participants)| participants.contains(&conn).then_some(room))
        {
            self.send_system_message(room, conn, msg).await;
        };
    }

    async fn connect(&mut self, tx: mpsc::UnboundedSender<Msg>) -> ConnId {
        let id = Uuid::new_v4();
        self.sessions.insert(id, tx);
        id
    }

    async fn disconnect(&mut self, conn_id: ConnId) {
        let mut rooms: Vec<RoomId> = Vec::new();

        if self.sessions.remove(&conn_id).is_some() {
            for (name, sessions) in &mut self.rooms {
                if sessions.remove(&conn_id) {
                    rooms.push(name.to_owned());
                }
            }
        }
    }

    async fn join_room(&mut self, conn_id: ConnId, room: RoomId) {
        let mut rooms = Vec::new();

        for (n, sessions) in &mut self.rooms {
            if sessions.remove(&conn_id) {
                rooms.push(n.to_owned());
            }
        }

        self.rooms.entry(room.clone()).or_default().insert(conn_id);
    }

    pub async fn run(mut self) -> io::Result<()> {
        while let Some(cmd) = self.cmd_rx.recv().await {
            match cmd {
                Command::Connect { conn_tx, res_tx } => {
                    let conn_id = self.connect(conn_tx).await;
                    let _ = res_tx.send(conn_id);
                }

                Command::Disconnect { conn } => {
                    self.disconnect(conn).await;
                }

                Command::Join { conn, room, res_tx } => {
                    self.join_room(conn, room).await;
                    let _ = res_tx.send(());
                }

                Command::Message { conn, msg, res_tx } => {
                    self.send_message(conn, msg).await;
                    let _ = res_tx.send(());
                }
            }
        }

        Ok(())
    }
}

#[derive(Debug, Clone)]
pub struct ChatServerHandle {
    cmd_tx: mpsc::UnboundedSender<Command>,
}

impl ChatServerHandle {
    pub async fn connect(&self, conn_tx: mpsc::UnboundedSender<Msg>) -> ConnId {
        let (res_tx, res_rx) = oneshot::channel();

        self.cmd_tx
            .send(Command::Connect { conn_tx, res_tx })
            .unwrap();

        res_rx.await.unwrap()
    }

    pub async fn join_room(&self, conn: ConnId, room: impl Into<RoomId>) {
        let (res_tx, res_rx) = oneshot::channel();

        self.cmd_tx
            .send(Command::Join {
                conn,
                room: room.into(),
                res_tx,
            })
            .unwrap();

        res_rx.await.unwrap();
    }

    pub async fn send_message(&self, conn: ConnId, msg: impl Into<Msg>) {
        let (res_tx, res_rx) = oneshot::channel();

        self.cmd_tx
            .send(Command::Message {
                msg: msg.into(),
                conn,
                res_tx,
            })
            .unwrap();

        res_rx.await.unwrap();
    }

    pub fn disconnect(&self, conn: ConnId) {
        self.cmd_tx.send(Command::Disconnect { conn }).unwrap();
    }
}
