import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URL);

let db = null;
let eventsCollection = null;
let joinedEventsCollection = null;

export async function connectToMongoDB() {
  if (db) {
    return { client, db, eventsCollection, joinedEventsCollection };
  }
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    db = client.db("oikyo");
    eventsCollection = db.collection("events");
    joinedEventsCollection = db.collection("joined_events");
    return { client, db, eventsCollection, joinedEventsCollection };
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}

const connection = await connectToMongoDB();
export const mongoClient = connection.client;
export const mongoDb = connection.db;
export const eventsCol = connection.eventsCollection;
export const joinedEventsCol = connection.joinedEventsCollection;
