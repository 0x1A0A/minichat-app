use crate::models::user;

// use mongodb::bson::oid::ObjectId;
// use mongodb::options::FindOneAndUpdateOptions;
// use mongodb::options::FindOptions;
// use mongodb::options::ReturnDocument;
use mongodb::{
    bson::{doc, Document},
    Client,
};

//use rocket::futures::TryStreamExt;
// use rocket::serde::json::Json;

// pub async fn find_users(db: &Client) -> mongodb::error::Result<Vec<user::Users>> {
// 	let database = db.database("chatapp");
// 	let collection = database.collection::<user::UsersDoc>("users");

//     // let find_options = FindOptions::builder()
//     //     .limit(limit)
//     //     .skip(u64::try_from((page - 1) * limit).unwrap())
//     //     .build();

//     let mut cursor = collection.find(None, None).await?;

//     let mut customers: Vec<user::Users> = vec![];
//     while let Some(result) = cursor.try_next().await? {
//         let _id = result._id;
//         let name = result.name;
//         // transform ObjectId to String
//         let customer_json = user::Users {
//             _id: _id.to_string(),
//             name: name.to_string(),
//         };
//         customers.push(customer_json);
//     }

//     Ok(customers)
// }

pub async fn find_user(db: &Client, name: String) -> mongodb::error::Result<Option<user::Users>> {
    let database = db.database("chatapp");
    let collection = database.collection::<user::UsersDoc>("users");

    let cursor = collection.find_one(doc! {"name": name}, None).await?;

    if let Some(result) = cursor {
        let customer_json = user::Users {
            _id: result._id.to_string(),
            name: result.name.to_string(),
        };
        return Ok(Some(customer_json));
    }

    Ok(None)
}

pub async fn insert_user(db: &Client, name: String) -> mongodb::error::Result<String> {
    let collection = db.database("chatapp").collection::<Document>("users");
    let res = collection
        .insert_one(doc! {"name":name.clone()}, None)
        .await?;

    Ok(res.inserted_id.as_object_id().unwrap().to_string())
}

pub async fn find_or_insert_user(db: &Client, name: String) -> mongodb::error::Result<String> {
    let find = match find_user(db, name.clone()).await {
        Ok(user) => user,
        Err(err) => {
            return Err(err);
        }
    };

    if let Some(u) = find {
        return Ok(u._id);
    }

    // create new user with this name
    match insert_user(db, name.clone()).await {
        Ok(user) => Ok(user),
        Err(err) => Err(err),
    }
}
