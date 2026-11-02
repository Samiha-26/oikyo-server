import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
import cors from 'cors';
import { initialEvents } from './seedData.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("oikyo");
const eventsCollection = db.collection("events");
const joinedEventsCollection = db.collection("joined_events");

app.get('/seed-events', async (req, res) => {
  try {
    const count = await eventsCollection.countDocuments();
    if (count > 0) {
      return res.send({ message: "Events already seeded in MongoDB", count });
    }
    const result = await eventsCollection.insertMany(initialEvents);
    res.send({ message: "Events seeded successfully into MongoDB", insertedCount: result.insertedCount });
  } catch (err) {
    res.status(500).send({ error: "Failed to seed events" });
  }
});

app.post('/add-event', async (req, res) => {
  const data = req.body;
  const result = await eventsCollection.insertOne(data);
  res.send({ message: "Event created successfully", insertedId: result.insertedId });
});

app.get('/events', async (req, res) => {
  const result = await eventsCollection.find().toArray();
  res.send(result);
});

app.get('/recent-events', async (req, res) => {
  const result = await eventsCollection.find().limit(6).toArray();
  res.send(result);
});

app.get('/event/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await eventsCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    res.status(400).send({ error: "Invalid ID format" });
  }
});

app.patch('/event/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedData = { ...req.body };
    delete updatedData._id;
    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to update event" });
  }
});

app.delete('/event/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete event" });
  }
});

app.post('/join-event', async (req, res) => {
  const data = req.body;
  try {
    const result = await joinedEventsCollection.insertOne(data);
    if (data.eventId) {
      try {
        await eventsCollection.updateOne(
          { _id: new ObjectId(data.eventId) },
          { $inc: { volunteersJoined: 1 } }
        );
      } catch {
        await eventsCollection.updateOne(
          { id: data.eventId },
          { $inc: { volunteersJoined: 1 } }
        );
      }
    }
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to join event" });
  }
});

app.get('/my-events/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await eventsCollection.find({ creatorEmail: email }).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch user events" });
  }
});

app.get('/my-joined-events/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await joinedEventsCollection.find({ userEmail: email }).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch joined events" });
  }
});

app.delete('/my-joined-events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await joinedEventsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete joined event" });
  }
});

app.get('/', (req, res) => {
  res.send('Oikyo server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
