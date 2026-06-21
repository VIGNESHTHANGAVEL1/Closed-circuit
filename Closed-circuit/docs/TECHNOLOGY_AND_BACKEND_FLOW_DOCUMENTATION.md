# Technology & Backend Flow Documentation

**Project:** Closed Circuit (closedcircuit.in)  
**Generated:** May 2026  
**Scope:** Analysis of the existing application before enquiry/admin backend implementation.

---

## 1. Technologies Used

### Frontend (`cc-app`)

| Item | Technology |
|------|------------|
| Framework | React 18 |
| Build tool | Vite 8 |
| Routing | React Router DOM v6 (`BrowserRouter`) |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| PWA | Service worker (`public/sw.js`) |
| Deployment | Vercel (SPA rewrites via `vercel.json`) |

**Entry:** `cc-app/src/main.jsx`  
**Router:** `cc-app/src/App.jsx`

### Backend (`cc-backend`)

| Item | Technology |
|------|------------|
| Runtime | Node.js (ES modules, `"type": "module"`) |
| Framework | Express 5 |
| Database driver | mysql2 (promise pool) |
| ORM | None — parameterized SQL via model layer |
| Auth | JWT (`jsonwebtoken`) + bcrypt password hashing |
| Export | ExcelJS (Excel), PDFKit (PDF) |
| Security | express-rate-limit, CORS, validation middleware |

**Entry:** `cc-backend/src/index.js`

### Database

| Item | Value |
|------|-------|
| Engine | MySQL |
| Default database | `cc_db` |
| Tables (after setup) | `enquiries`, `admin_users` |
| Legacy table | `contacts` (previous prototype — superseded by `enquiries`) |

### API Routing

- Express mounts all routes under `/api`
- Public enquiry: `POST /api/enquiries`
- Backward compatible: `POST /api/contact`
- Admin auth & data: `/api/admin/*`

### Build & Deployment Structure

```
Closed-circuit/
├── cc-app/          → Vercel static frontend (closedcircuit.in)
│   ├── vercel.json
│   └── dist/        → production build output
└── cc-backend/      → Node.js API (separate host required)
    ├── src/
    └── database/    → SQL setup scripts
```

### Environment Variables

**Frontend (`cc-app/.env`):**

| Variable | Purpose |
|----------|---------|
| `VITE_GOOGLE_SCRIPT_URL` | Production contact form → Google Sheets |
| `VITE_API_URL` | Backend API base URL for enquiries + admin |

**Backend (`cc-backend/.env`):**

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default 5000) |
| `CORS_ORIGIN` | Allowed frontend origin(s) |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Default admin seed credentials |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | JWT signing |

---

## 2. Existing Contact / Enquiry Form Flow

### Frontend component

**File:** `cc-app/src/pages/Contact.jsx`  
**Route:** `/contact`

### Form fields (UI unchanged)

| Field | Required |
|-------|----------|
| fullName | Yes |
| mobileNumber | Yes |
| emailId | Yes |
| town, state, country | Yes |
| lookingFor | Yes |
| preferredContactMethod | Yes |
| preferredDate, preferredTime | Yes |
| description | No |
| consentAccepted | Yes |

### Submission flow (dual path — production safe)

```
User submits /contact form
        │
        ├─► [Production] POST → Google Apps Script (VITE_GOOGLE_SCRIPT_URL)
        │         └── Google Sheets (existing production flow — preserved)
        │
        └─► [When configured] POST → /api/enquiries (VITE_API_URL)
                  └── MySQL enquiries table
```

**Production behavior preserved:**

- If `VITE_GOOGLE_SCRIPT_URL` is set, Google Sheets submission still runs exactly as before.
- Backend submission is **additive** when `VITE_API_URL` is configured.
- If backend fails but Google succeeds, user still sees success (production not broken).
- If only backend is configured (no Google URL), backend is used alone.

### Data mapping to `enquiries` table

| enquiries column | Source |
|------------------|--------|
| name | fullName |
| email | emailId |
| phone | mobileNumber |
| message | Combined structured text (town, state, lookingFor, etc.) |
| source_page | `/contact` |
| ip_address | Captured server-side from request |

### Previous backend state (before this work)

- Monolithic `server.js` was refactored to layered `src/` architecture.
- `POST /api/contact` inserted into `contacts` table with camelCase columns.
- **Not connected** to the live frontend (frontend used Google Script only).
- Admin login existed at `/admin/login` with env-based plain-text credentials (no DB, no bcrypt).

### Security issues identified (and addressed)

| Issue | Status |
|-------|--------|
| No server-side validation on contact API | Fixed — validation middleware |
| Plain-text admin password in env only | Fixed — bcrypt hash in `admin_users` |
| No rate limiting on public endpoints | Fixed — rate limiters added |
| CORS open to all origins | Configurable via `CORS_ORIGIN` |
| Backend errors exposed details | Fixed — generic client messages |
| No SQL migration in repo | Fixed — `database/admin_enquiry_setup.sql` |

---

## 3. Current Backend Status

### Architecture (after improvement)

```
cc-backend/src/
├── index.js                 # Boot + admin seed
├── app.js                   # Express factory, CORS, JSON
├── config/
│   ├── env.js
│   └── database.js
├── routes/
│   ├── index.js
│   ├── enquiry.routes.js    # Public enquiry endpoints
│   └── admin.routes.js      # Protected admin endpoints
├── controllers/
│   ├── enquiry.controller.js
│   └── auth.controller.js
├── services/
│   ├── enquiry.service.js
│   └── auth.service.js
├── models/
│   ├── enquiry.model.js
│   └── adminUser.model.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── rateLimit.middleware.js
├── utils/
│   ├── response.js
│   ├── exportExcel.js
│   └── exportPdf.js
└── scripts/
    └── seedAdmin.js
```

### Can architecture be added without disturbing the website?

**Yes.** Changes were scoped to:

- Backend layers inside existing `cc-backend`
- Hidden admin routes `/login` and `/enquiries` (not in navbar)
- Minimal `Contact.jsx` submit handler addition (Google flow preserved)
- No changes to other public pages

Public website routes, navbar, footer, and page content remain unchanged.

---

## 4. Admin Access (Hidden)

| URL | Purpose | Public nav link |
|-----|---------|-----------------|
| `/login` | Admin login | No |
| `/enquiries` | Enquiry dashboard | No |

Legacy URLs `/admin/login` and `/admin` redirect to the new paths.

---

## 5. Related Documentation

- `docs/ADMIN_ENQUIRY_BACKEND_ARCHITECTURE.md` — full implementation guide
- `cc-backend/database/admin_enquiry_setup.sql` — database setup
- `cc-app/CONTACT_FORM_SETUP.md` — Google Sheets setup (production)
