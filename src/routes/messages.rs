use std::str::FromStr;

use mongodb::bson::oid::ObjectId;
use mongodb::Client;
use rocket::http::Status;
use rocket::response::status;
use rocket::{serde::json::Json, State};

use crate::{db, models, response};

type ResError = status::Custom<Json<response::ErrorReason>>;

#[get("/messages", data = "<payload>")]
pub async fn get_messages_by_room(
    db: &State<Client>,
    payload: Json<models::message::MessagesRoomPayload>,
) -> Result<Json<Vec<models::message::Messages>>, ResError> {
    match db::message::find_messages_in_room(db, payload.room.clone()).await {
        Ok(ok) => Ok(Json(ok)),
        Err(_) => Err(status::Custom(
            Status::BadRequest,
            Json(response::ErrorReason {
                reason: format!("Some Error 'room={}'", payload.room),
            }),
        )),
    }
}

#[post("/message", data = "<payload>")]
pub async fn post_message(
    db: &State<Client>,
    payload: Json<models::message::MessagesPayload>,
) -> Result<String, ResError> {
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
		Ok(ok) => {
			Ok(ok)
		},
		Err(err) => {
			Err(status::Custom(
                Status::InternalServerError,
                Json(response::ErrorReason {
                    reason: format!("creat message error {:?}", err),
                }),
            ))
		}
	}

}
