# cc-backend — Architecture Documentation

This document describes the architecture of the **Closed Circuit backend API** (`cc-backend`): how the project is organized, how requests flow through the system, and how to run and extend it.

---

## Overview

`cc-backend` is a Node.js / Express REST API that persists contact form submissions to a MySQL database. It was refactored from a single monolithic file into a layered architecture **without changing business logic** — the same endpoint, payload, SQL, and responses behave exactly as before.

| Item | Value |
|------|-------|
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | MySQL via `mysql2` |
| Default port | `5000` |

---

## Project Structure

```
cc-backend/
├── src/
│   ├── index.js                    # Application entry point
│   ├── app.js                      # Express app factory
│   ├── config/
│   │   ├── env.js                  # Environment variables & defaults
│   │   └── database.js             # MySQL connection pool
│   ├── routes/
│   │   ├── index.js                # Route aggregator
│   │   ├── contact.routes.js       # Contact endpoints
│   │   └── auth.routes.js          # Admin auth endpoints
│   ├── controllers/
│   │   ├── contact.controller.js   # HTTP request / response handling
│   │   └── auth.controller.js      # Login / profile handlers
│   ├── services/
│   │   ├── contact.service.js      # Business orchestration
│   │   └── auth.service.js         # Credential check & JWT
│   ├── middleware/
│   │   └── auth.middleware.js      # Bearer token verification
│   └── repositories/
│       └── contact.repository.js   # Database queries
├── .env.example                    # Environment variable template
├── package.json
└── ARCHITECTURE.md                 # This file
```

---

## Layered Architecture

Each layer has a single responsibility. Dependencies flow **downward only** — upper layers never import from layers below their direct dependency.

```
┌─────────────────────────────────────────────────────────┐
│  Client (HTTP)                                          │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Routes          — URL mapping, HTTP verbs              │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Controllers     — Parse request, send response         │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Services        — Business logic orchestration         │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Repositories    — SQL queries, data access             │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Config / Database — Connection pool, env settings      │
└─────────────────────────────────────────────────────────┘
```

### Layer responsibilities

| Layer | File(s) | Responsibility |
|-------|---------|----------------|
| **Entry** | `src/index.js` | Bootstraps the app and starts the HTTP server |
| **App** | `src/app.js` | Creates the Express instance, registers middleware and routes |
| **Config** | `src/config/` | Centralizes environment variables and database pool |
| **Routes** | `src/routes/` | Maps HTTP paths and methods to controller functions |
| **Controllers** | `src/controllers/` | Reads `req`, calls services, writes `res` |
| **Services** | `src/services/` | Coordinates business operations (thin for now; grows with features) |
| **Repositories** | `src/repositories/` | Executes SQL; no HTTP or business-rule knowledge |

---

## Request Flow

Example: saving a contact submission via `POST /api/contact`.

```
POST /api/contact
       │
       ▼
contact.routes.js       router.post('/contact', createContact)
       │
       ▼
contact.controller.js   Extract body fields → call saveContact()
       │
       ▼
contact.service.js      saveContact() → insertContact()
       │
       ▼
contact.repository.js   INSERT INTO contacts (...)
       │
       ▼
MySQL (cc_db.contacts)
       │
       ▼
Response: { "success": true }   or   500 { "success": false }
```

---

## API Reference

### `POST /api/contact`

Saves a contact form submission to the `contacts` table.

**Request headers**

```
Content-Type: application/json
```

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | string | Contact's full name |
| `mobileNumber` | string | Mobile phone number |
| `emailId` | string | Email address |
| `town` | string | Town / city |
| `state` | string | State / region |
| `country` | string | Country |
| `lookingFor` | string | What the contact is looking for |
| `preferredContactMethod` | string | Preferred way to be contacted |
| `preferredDate` | string | Preferred contact date |
| `preferredTime` | string | Preferred contact time |
| `description` | string | Additional message / description |

**Success response** — `200 OK`

```json
{
  "success": true
}
```

**Error response** — `500 Internal Server Error`

```json
{
  "success": false
}
```

Errors are logged to the server console via `console.error`.

---

### `POST /api/auth/login`

Admin login endpoint. **Separate from the public contact API** — used only by the admin UI at the direct URL `/admin/login`.

**Request headers**

```
Content-Type: application/json
```

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Admin username |
| `password` | string | Admin password |

**Success response** — `200 OK`

```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Error responses**

| Status | Body |
|--------|------|
| `400` | `{ "success": false, "message": "Username and password are required." }` |
| `401` | `{ "success": false, "message": "Invalid credentials." }` |
| `500` | `{ "success": false, "message": "Login failed." }` |

---

### `GET /api/auth/me`

Returns the authenticated admin profile. Requires a valid JWT.

**Request headers**

```
Authorization: Bearer <token>
```

**Success response** — `200 OK`

```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Error response** — `401 Unauthorized`

```json
{
  "success": false,
  "message": "Authentication required."
}
```

---

## Admin UI (cc-app)

The login flow is **not linked from the public navbar**. Admins access it only via direct URL:

| URL | Purpose |
|-----|---------|
| `/admin/login` | Admin sign-in page (no public nav link) |
| `/admin` | Protected admin dashboard (redirects to login if unauthenticated) |

Set `VITE_API_URL` in `cc-app/.env` to point at the backend (default `http://localhost:5000`).

---

## Database

### Connection

The app uses a MySQL connection **pool** created in `src/config/database.js`. Pool settings come from `src/config/env.js`.

### Table: `contacts`

The repository inserts into these columns (in order):

```
fullName, mobileNumber, emailId, town, state, country,
lookingFor, preferredContactMethod, preferredDate, preferredTime, description
```

---

## Configuration

Environment variables are loaded via [dotenv](https://github.com/motdotla/dotenv). Copy `.env.example` to `.env` and adjust as needed.

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | HTTP server port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_USER` | `ramesh` | MySQL username |
| `DB_PASSWORD` | `Great@123` | MySQL password |
| `DB_NAME` | `cc_db` | MySQL database name |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `change-me` | Admin login password |
| `JWT_SECRET` | *(dev default)* | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | `8h` | Token expiry duration |

Defaults match the original hardcoded values so behavior is unchanged when no `.env` file is present.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL server with the `cc_db` database and `contacts` table

### Install dependencies

```bash
cd cc-backend
npm install
```

### Configure environment (optional)

```bash
cp .env.example .env
# Edit .env with your values
```

### Run the server

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

The server logs:

```
Backend running on port 5000
```

### Test admin login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"change-me"}'
```

---

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "mobileNumber": "9876543210",
    "emailId": "jane@example.com",
    "town": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "lookingFor": "Product demo",
    "preferredContactMethod": "Email",
    "preferredDate": "2026-06-01",
    "preferredTime": "10:00 AM",
    "description": "Interested in learning more."
  }'
```

---

## What Changed (Refactor Summary)

### Before

- Single file: `server.js` (~65 lines)
- Express setup, DB config, route handler, and SQL all in one place
- Database credentials hardcoded inline
- `dotenv` imported but not used for configuration

### After

- Layered `src/` directory with separated concerns
- Config extracted to `src/config/` with env-based overrides
- Express app factory (`createApp`) decoupled from server startup
- npm scripts: `start` and `dev`
- `.env.example` for onboarding

### Unchanged (business logic preserved)

- Endpoint: `POST /api/contact`
- Request body fields and JSON shape
- SQL insert statement and column mapping
- Response format: `{ success: true }` / `{ success: false }`
- Error handling: log to console, return 500
- Port `5000` and default database credentials

---

## Frontend Integration Note

The React app (`cc-app`) currently submits the contact form to **Google Apps Script** via `VITE_GOOGLE_SCRIPT_URL`, not to this backend. To use `cc-backend` from the frontend, update the contact form to `POST` JSON to:

```
http://localhost:5000/api/contact
```

Ensure CORS is allowed for the frontend origin (currently `cors()` accepts all origins).

---

## Adding New Features

Follow the same layered pattern:

1. **Repository** — add SQL / data access functions in `src/repositories/`
2. **Service** — add business logic in `src/services/`
3. **Controller** — handle HTTP in `src/controllers/`
4. **Routes** — register the path in `src/routes/`
5. **Routes index** — import the new route module in `src/routes/index.js` if needed

Example for a future `GET /api/contacts` endpoint:

```
src/repositories/contact.repository.js   → findAllContacts()
src/services/contact.service.js          → listContacts()
src/controllers/contact.controller.js    → getContacts(req, res)
src/routes/contact.routes.js             → router.get('/', getContacts)
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |
| `mysql2` | MySQL driver with promise support |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Load environment variables from `.env` |

---

## Future Improvements (Optional)

These were intentionally out of scope for the architecture refactor but are natural next steps:

- Input validation middleware (e.g. required fields, email format)
- Centralized error-handling middleware
- Health check endpoint (`GET /api/health`)
- Structured logging instead of `console.error`
- Unit tests for services and repositories
- Database migration scripts for the `contacts` schema
