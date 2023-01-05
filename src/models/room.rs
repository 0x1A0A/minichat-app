use mongodb::bson::oid::ObjectId;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct RoomsDoc {
    /// Document Id
    pub _id: ObjectId,
    /// customer name
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Rooms {
    /// Document Id
    pub _id: String,
    /// customer name
    pub name: String,
}