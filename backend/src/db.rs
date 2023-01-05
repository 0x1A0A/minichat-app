use mongodb::{self, options::ClientOptions, Client};
use rocket::fairing::AdHoc;

use dotenv::dotenv;
use std::env;

pub mod message;
pub mod room;
pub mod user;

pub fn init() -> AdHoc {
    AdHoc::on_ignite("Connecting to MongoDB", |rocket| async {
        match connect().await {
            Ok(client) => rocket.manage(client),
            Err(error) => {
                panic!("Cannot connect to instance:: {:?}", error)
            }
        }
    })
}

async fn connect() -> mongodb::error::Result<Client> {
    dotenv().ok();

    let mongo_server = env::var("SERVER").expect("SERVER is not found.");
    let name = env::var("NAME").expect("NAME is not found.");
    let passwd = env::var("PASSWD").expect("PASSWD not found.");
    let mongo_port = env::var("PORT").expect("PORT not found.");

    let uri = format!("mongodb://{name}:{passwd}@{mongo_server}:{mongo_port}");

    let client_options = ClientOptions::parse(uri).await?;
    let client = Client::with_options(client_options)?;

    println!("MongoDB Connected!");

    Ok(client)
}
