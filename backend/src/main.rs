#[macro_use]
extern crate rocket;

// use rocket::response::stream::TextStream;
// use rocket::tokio::{
//     select,
//     time::{self, Duration},
// };
// use rocket::Shutdown;

use rocket::tokio::sync::broadcast::channel;

mod db;
mod models;
mod response;
mod routes;

use rocket::{http::Header,
{Request, Response},
fairing::{Fairing, Info, Kind}};

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
fn rocket() -> _ {

    rocket::build()
        .manage(channel::<models::message::MessagesPayload>(512).0)
        .attach(db::init())
		.attach(CORS)
        .mount(
            "/",
            routes![
                routes::messages::get_messages_by_room,
                routes::messages::post_message,
				routes::messages::message_event,
            ],
        )
}
