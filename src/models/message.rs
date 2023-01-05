use mongodb::bson::{oid::ObjectId, DateTime};
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct MessagesView {
    pub _id: ObjectId,
    pub msg: String,
    pub user: String,
    pub room: String,
    pub date: DateTime,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Messages {
    pub _id: String,
    pub msg: String,
    pub user: String,
    pub room: String,
    pub date: DateTime,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct MessagesPayload {
    pub msg: String,
    pub user: String,
    pub room: String,
}
