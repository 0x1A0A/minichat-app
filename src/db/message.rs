use crate::models;
use rocket::futures::TryStreamExt;

use mongodb::{
    bson::{doc, oid::ObjectId, DateTime, Document},
    error, Client,
};

pub async fn find_messages_in_room(
    db: &Client,
    room_name: String,
) -> error::Result<Vec<models::message::Messages>> {
    let mut res = Vec::new();

    let database = db.database("chatapp");
    let collection = database.collection::<models::message::MessagesView>("messageView");

    let mut cursor = collection.find(doc! {"room":room_name}, None).await?;

    while let Some(result) = cursor.try_next().await? {
        res.push(models::message::Messages {
            _id: result._id.to_string(),
            user: result.user,
            room: result.room,
            msg: result.msg,
            date: result.date,
        });
    }

    Ok(res)
}

pub async fn insert_message(
    db: &Client,
    msg: String,
    uid: ObjectId,
    rid: ObjectId,
) -> error::Result<String> {
    let collection = db.database("chatapp").collection::<Document>("messages");
    let res = collection
        .insert_one(
            doc! {
                "msg" : msg,
                "user": uid,
                "room": rid,
                "date": DateTime::now(),
            },
            None,
        )
        .await?;

    Ok(res.inserted_id.to_string())
}
