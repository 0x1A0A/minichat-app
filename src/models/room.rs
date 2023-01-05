use mongodb::bson::oid::ObjectId;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct RoomsDoc {
    pub _id: ObjectId,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Rooms {
    pub _id: String,
    pub name: String,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct RoomPayload {
    pub name: String,
}
