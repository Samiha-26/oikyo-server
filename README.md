# Oikyo Server (ঐক্য) — Backend REST API

> **Decentralized Civic Action & Grassroots Social Service API**  
> **Backend Framework**: Express.js (Node.js ESM)  
> **Database Engine**: MongoDB Atlas Native Driver  
> **Security & Tokens**: `jose` (JWT verification with remote JWKS)  
> **Client Application**: [Oikyo Frontend](https://github.com/Samiha-26/oikyo)

---

## 🌟 Overview

**Oikyo Server** provides high-reliability REST endpoints to coordinate community-driven relief initiatives across Bangladesh. The backend handles verified event authoring, strictly future-date validation, volunteer capacity quota management, real-time participant roster tracking, and JWT-authenticated security policies.

---

## 🛠️ Architecture & Tech Stack

* **Express.js (ESM Modules)**: Modular MVC architecture with dedicated routers (`routes/events.js`, `routes/joinedEvents.js`).
* **MongoDB Atlas Native Driver**: Direct collection management with `MongoClient` and `ObjectId`.
* **JWT Verification (`jose`)**: Remote JWKS integration verifying JSON Web Tokens issued by BetterAuth.
* **Validation Middleware**: Comprehensive request payload and strictly future-date enforcement.
* **CORS & JSON Parsers**: Configured for cross-origin client integration.

---

## 📋 REST API Endpoints Reference

### 1. Events Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | No | Fetch all upcoming civic drives. Supports `search`, `category`, `district`, and `sort` query filters. |
| `GET` | `/recent-events` | No | Fetch the 6 nearest upcoming initiatives for the landing page showcase. |
| `GET` | `/event/:id` | No | Retrieve detailed logistical specifications and roster quota for a single event. |
| `POST` | `/add-event` | **Yes (Bearer JWT)** | Create a new community drive with future-date and payload validation. |
| `PATCH`| `/event/:id` | **Yes (Bearer JWT)** | Update event details (quota, description, location). |
| `DELETE`| `/event/:id` | **Yes (Bearer JWT)** | Delete a drive from the active roster. |
| `GET` | `/my-events/:email` | **Yes (Bearer JWT)** | Fetch all campaigns created by a specific authenticated organizer. |
| `GET` | `/seed-events` | No | Initial database seeding endpoint for baseline 6-drive dataset. |

### 2. Volunteer Roster & Joined Drives

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/join-event` | No | Enlist as a volunteer. Checks capacity quotas, prevents duplicate sign-ups, and auto-increments event roster count by +1. |
| `GET` | `/my-joined-events/:email` | **Yes (Bearer JWT)** | Fetch all confirmed volunteer mission commitments for an account. |
| `DELETE`| `/my-joined-events/:id` | **Yes (Bearer JWT)** | Release/cancel a volunteer spot and auto-decrement event roster count by -1. |

### 3. System & Health

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root server status check. |
| `GET` | `/health` | Server uptime and health probe. |

---

## 🔍 Query Parameters Reference (`GET /events`)

* `search`: Case-insensitive text search across title, description, and meeting location.
* `category`: Filter by sector (`Winter Clothing`, `Medical Relief`, `Clean Environment`, `Tree Planting`, `Education & Youth`, `Water Sanitation`).
* `district`: Filter by any of the 64 districts (e.g. `Dhaka`, `Panchagarh`, `Satkhira`).
* `sort`: Sort ordering (`earliest`, `latest`, `most_spots`).

---

## 🚀 Installation & Local Development

### 1. Clone the repository:
```bash
git clone https://github.com/Samiha-26/oikyo-server.git
cd oikyo-server
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run the development server:
```bash
npm run dev
# or: node index.js
```

The server will initialize on port 8000:
```text
You successfully connected to MongoDB!
Server is running on port 8000
```

---

## 📄 License
MIT License
