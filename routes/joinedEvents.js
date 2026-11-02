import express from 'express';
import { ObjectId } from 'mongodb';
import { eventsCol as eventsCollection, joinedEventsCol as joinedEventsCollection } from '../config/db.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/join-event', async (req, res) => {
  const data = req.body;
  try {
    if (!data.eventId || !data.userEmail) {
      return res.status(400).send({ error: "Event ID and user email are required." });
    }

    const alreadyJoined = await joinedEventsCollection.findOne({
      eventId: data.eventId,
      userEmail: data.userEmail,
    });
    if (alreadyJoined) {
      return res.status(400).send({ error: "You have already joined this event roster." });
    }

    let event = null;
    try {
      event = await eventsCollection.findOne({ _id: new ObjectId(data.eventId) });
    } catch {
      event = await eventsCollection.findOne({ id: data.eventId });
    }

    if (event && (event.volunteersJoined || 0) >= (event.volunteersNeeded || 1)) {
      return res.status(400).send({ error: "Volunteer quota is completely full for this drive." });
    }

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

router.get('/my-joined-events/:email', verifyToken, async (req, res) => {
  const { email } = req.params;
  try {
    const result = await joinedEventsCollection.find({ userEmail: email }).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch joined events" });
  }
});

router.delete('/my-joined-events/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const joinedRecord = await joinedEventsCollection.findOne({ _id: new ObjectId(id) });
    const result = await joinedEventsCollection.deleteOne({ _id: new ObjectId(id) });

    if (joinedRecord?.eventId) {
      try {
        await eventsCollection.updateOne(
          { _id: new ObjectId(joinedRecord.eventId) },
          { $inc: { volunteersJoined: -1 } }
        );
      } catch {
        await eventsCollection.updateOne(
          { id: joinedRecord.eventId },
          { $inc: { volunteersJoined: -1 } }
        );
      }
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete joined event" });
  }
});

export default router;
