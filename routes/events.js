import express from 'express';
import { ObjectId } from 'mongodb';
import { eventsCol as eventsCollection } from '../config/db.js';
import { initialEvents } from '../seedData.js';
import { validateEvent } from '../middlewares/validateEvent.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/seed-events', async (req, res) => {
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

router.post('/add-event', verifyToken, validateEvent, async (req, res) => {
  const data = req.body;
  try {
    const result = await eventsCollection.insertOne(data);
    res.send({ message: "Event created successfully", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send({ error: "Failed to create event" });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { search, category, district, sort } = req.query;
    const query = {};

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ title: regex }, { description: regex }, { location: regex }];
    }

    if (category && category !== 'All' && category.trim()) {
      query.category = category.trim();
    }

    if (district && district !== 'All' && district.trim()) {
      query.district = district.trim();
    }

    let sortOptions = { date: 1 };
    if (sort === 'latest') {
      sortOptions = { date: -1 };
    } else if (sort === 'most_spots') {
      sortOptions = { volunteersNeeded: -1 };
    } else if (sort === 'earliest') {
      sortOptions = { date: 1 };
    }

    const result = await eventsCollection.find(query).sort(sortOptions).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch events" });
  }
});

router.get('/recent-events', async (req, res) => {
  try {
    const result = await eventsCollection.find().sort({ date: 1 }).limit(6).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch recent events" });
  }
});

router.get('/event/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).send({ error: "Event not found" });
    }
    res.send(result);
  } catch (err) {
    res.status(400).send({ error: "Invalid ID format" });
  }
});

router.patch('/event/:id', verifyToken, async (req, res) => {
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

router.delete('/event/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete event" });
  }
});

router.get('/my-events/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await eventsCollection.find({ creatorEmail: email }).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch user events" });
  }
});

export default router;
