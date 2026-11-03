# Oikyo Server (ঐক্য)

The backend REST API for Oikyo, a community-driven platform for coordinating grassroots social service and disaster relief initiatives across Bangladesh. The server handles event creation, future-date validation, volunteer capacity quota management, and JWT-authenticated route security.

Live API: https://oikyo-server.vercel.app

Client repository: https://github.com/Samiha-26/oikyo

Server repository: https://github.com/Samiha-26/oikyo-server

## Features

- REST endpoints for creating, browsing, updating, and deleting community service drives.
- Search and filtering by keyword, action sector (Cleanup, Plantation, Donation, Winter Clothing, Medical Relief, Education, Water Sanitation), and district.
- Sorting options for events by date (earliest, latest) or volunteer capacity (most spots available).
- Live quota tracking for volunteer drives, automatically incrementing participant counts on join and decrementing on cancellation.
- Duplicate prevention ensuring a user cannot join the same event roster more than once.
- JWT verification middleware using `jose` with remote JWKS to secure mutations and organizer-specific routes.
- Request payload and future-date validation preventing past dates from being submitted.
- MongoDB native driver connection with automated collection setup and seed endpoints.

## Tech stack

- Node.js (ESM)
- Express.js
- MongoDB Atlas with native `mongodb` driver
- Jose for JWT verification via remote JWKS
- CORS and Dotenv

## API endpoints

### Events

- `GET /events` - Fetch all upcoming drives with optional `search`, `category`, `district`, and `sort` query parameters.
- `GET /recent-events` - Fetch the six newest upcoming events for the landing page.
- `GET /event/:id` - Fetch details for a single event by ID.
- `POST /add-event` - Create a new event (protected, requires Bearer token).
- `PATCH /event/:id` - Update event details (protected, requires Bearer token).
- `DELETE /event/:id` - Delete an event (protected, requires Bearer token).
- `GET /my-events/:email` - Get events organized by a specific user (protected, requires Bearer token).

### Joined events

- `POST /join-event` - Register a user for an event, validating capacity and duplicate join.
- `GET /my-joined-events/:email` - Get all events a user has joined (protected, requires Bearer token).
- `DELETE /my-joined-events/:id` - Cancel a volunteer spot and release capacity (protected, requires Bearer token).

### System

- `GET /` - Root status endpoint.
- `GET /health` - Server health check.

## Project structure

```text
oikyo-server/
├── config/
│   └── db.js
├── middlewares/
│   ├── validateEvent.js
│   └── verifyToken.js
├── routes/
│   ├── events.js
│   └── joinedEvents.js
├── index.js
├── seedData.js
├── vercel.json
├── package.json
└── README.md
```

## Run it locally

Clone this repository and install packages:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=8000
CLIENT_URL=http://localhost:3000
MONGODB_URL=your-mongodb-connection-string
```

Start the development server:

```bash
npm run dev
```

The server runs on port 8000 by default.
