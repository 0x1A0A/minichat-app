use rocket::serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(crate = "rocket::serde")]

pub struct ErrorReason {
    pub reason: String,
}
