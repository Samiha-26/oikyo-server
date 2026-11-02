import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import eventsRouter from './routes/events.js';
import joinedEventsRouter from './routes/joinedEvents.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(eventsRouter);
app.use(joinedEventsRouter);

app.get('/', (req, res) => {
  res.send('Oikyo server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
