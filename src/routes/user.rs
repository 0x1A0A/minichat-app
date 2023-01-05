use mongodb::Client;
use rocket::http::Status;
use rocket::response::status;
use rocket::{serde::json::Json, State};

use crate::{db, models, response};

type ResError = status::Custom<Json<response::ErrorReason>>;

// #[get("/user/<name>")]
// pub async fn get_user_with_name(db: &State<Client>, name: String)
// -> Result< Json<models::user::Users>, status::BadRequest<&str>> {
// 	let res = db::user::find_user_by_name(db, name).await;

// 	match res {
// 		Ok(ok) => if let Some(usr) = ok {
// 			Ok(Json(usr))
// 		} else { Err(status::BadRequest(Some("Not Found"))) },
// 		Err(_) => Err(status::BadRequest(Some("Error"))),
// 	}

// }

#[post("/user", data = "<payload>")]
pub async fn post_user(
    db: &State<Client>,
    payload: Json<models::user::UsersPayload>,
) -> Result<String, ResError> {
    match db::user::insert_user(db, payload.name.clone()).await {
        Ok(ok) => Ok(ok),
        Err(_) => Err(status::Custom(
            Status::BadRequest,
            Json(response::ErrorReason {
                reason: format!("This username already exits 'name={}'", payload.name),
            }),
        )),
    }
}
