use mongodb::bson::oid::ObjectId;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct UsersDoc {
    pub _id: ObjectId,
    pub name: String,
}

#[derive(Debug, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Users {
    pub _id: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct UserPayload {
    pub name: String,
}
