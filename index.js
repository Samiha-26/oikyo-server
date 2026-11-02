import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import eventsRouter from './routes/events.js';
import joinedEventsRouter from './routes/joinedEvents.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Oikyo server is running!');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'oikyo-backend-api',
    uptime: `${Math.round(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

app.use(eventsRouter);
app.use(joinedEventsRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl} on Oikyo Server`,
  });
});

app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
