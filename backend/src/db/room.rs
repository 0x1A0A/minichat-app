use crate::models::room;

use mongodb::{
    bson::{doc, Document},
    Client,
};

/// find one room by name
pub async fn find_room(db: &Client, name: String) -> mongodb::error::Result<Option<room::Rooms>> {
    let collection = db.database("chatapp").collection::<room::RoomsDoc>("rooms");
    let cursor = collection.find_one(doc! {"name": name}, None).await?;

    if let Some(result) = cursor {
        let customer_json = room::Rooms {
            _id: result._id.to_string(),
            name: result.name.to_string(),
        };
        return Ok(Some(customer_json));
    }

    Ok(None)
}

/// insert room into database by name
pub async fn insert_room(db: &Client, name: String) -> mongodb::error::Result<String> {
    let collection = db.database("chatapp").collection::<Document>("rooms");
    let res = collection
        .insert_one(doc! {"name":name.clone()}, None)
        .await?;

    Ok(res.inserted_id.as_object_id().unwrap().to_string())
}

pub async fn find_or_insert_room(db: &Client, name: String) -> mongodb::error::Result<String> {
    let find = match find_room(db, name.clone()).await {
        Ok(room) => room,
        Err(err) => {
            return Err(err);
        }
    };

    if let Some(u) = find {
        return Ok(u._id);
    }

    // create new room with this name
    match insert_room(db, name.clone()).await {
        Ok(room) => Ok(room),
        Err(err) => Err(err),
    }
}
