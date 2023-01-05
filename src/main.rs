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

// #[get("/infinite-hellos")]
// fn hello(mut shutdown: Shutdown) -> TextStream![&'static str] {
//     TextStream! {
//         let mut interval = time::interval(Duration::from_secs(1));
//         loop {
//             select! {
//                 _= interval.tick() =>
//                 	yield "hello",
//                 _= &mut shutdown => {
//                     yield "\ngoodbye\n";
//                     break;
//                 }
//             }
//         }
//     }
// }

#[launch]
fn rocket() -> _ {
    rocket::build()
        .manage(channel::<models::message::MessagesPayload>(512).0)
        .attach(db::init())
        .mount(
            "/",
            routes![
                routes::messages::get_messages_by_room,
                routes::messages::post_message,
				routes::messages::message_event,
            ],
        )
}
