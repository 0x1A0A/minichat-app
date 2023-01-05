#[macro_use]
extern crate rocket;

mod db;
mod models;
mod response;
mod routes;

// #[rocket::main]
// async fn main() -> Result<(), Box<dyn std::error::Error>> {
// 	let _rocket = rocket::build()
// 		.attach(db::init())
// 		// .mount("/", routes! [db_get])
//         .launch()
//         .await?;

//     Ok(())
// }

// #[get("/users")]
// async fn get_users(db: &State<Client>) -> Json<Vec<models::user::Users>>{
// 	Json(db::user::find_users(db).await.unwrap())
// }

#[launch]
fn rocket() -> _ {
    rocket::build().attach(db::init()).mount(
        "/",
        routes![
            routes::user::post_user,
            routes::messages::get_messages_by_room,
			routes::messages::post_message
        ],
    )
}
