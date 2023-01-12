use crate::models;
use rocket::futures::TryStreamExt;

use mongodb::{
    bson::{self, doc, oid::ObjectId, DateTime, Document},
    error, Client,
};

pub async fn find_messages_in_room(
    db: &Client,
    room_name: String,
) -> error::Result<Vec<models::message::Messages>> {
    let mut res = Vec::new();

    let database = db.database("chatapp");

    let room_look_up = doc! { "$lookup": {
    "from": "rooms",
    "localField": "room",
    "foreignField": "_id",
    "as": "roomDoc" } };

    let user_look_up = doc! { "$lookup": {
    "from": "users",
    "localField": "user",
    "foreignField": "_id",
    "as": "userDoc" } };

    let project = doc! { "$project":{
    "_id": 1,
    "msg": 1,
    "user": "$userDoc.name",
    "room": "$roomDoc.name",
    "date": 1 } };

    let pipeline = vec![
        room_look_up,
        doc! { "$unwind": "$roomDoc" },
        user_look_up,
        doc! { "$unwind": "$userDoc" },
        doc! { "$match": { "roomDoc.name": room_name.clone() }},
        project,
    ];

    let mut cursor = database
        .collection::<Document>("messages")
        .aggregate(pipeline, None)
        .await?;

    while let Some(result) = cursor.try_next().await? {
        let result: models::message::MessagesView = bson::from_document(result)?;
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
