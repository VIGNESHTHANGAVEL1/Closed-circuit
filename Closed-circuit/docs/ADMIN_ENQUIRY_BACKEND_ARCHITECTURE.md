# Admin Enquiry Backend Architecture

**Project:** Closed Circuit  
**Document:** Complete implementation reference for enquiry storage, admin login, dashboard, and exports.

---

## 1. What Was Existing

| Component | Before |
|-----------|--------|
| Contact form UI | Full form at `/contact` posting to Google Apps Script |
| Production data store | Google Sheets via Apps Script |
| Backend | Layered Express app with unused `POST /api/contact` → `contacts` table |
| Admin UI | Placeholder at `/admin/login` and `/admin` |
| Admin auth | Env plain-text credentials, JWT, no DB users |
| Database scripts | None in repository |
| Enquiry dashboard | Not implemented |
| Export | Not implemented |

---

## 2. What Was Added

### Backend

- `enquiries` and `admin_users` MySQL tables (SQL setup script)
- `POST /api/enquiries` with validation and rate limiting
- Backward-compatible `POST /api/contact`
- `POST /api/admin/login` with bcrypt + JWT
- Protected admin enquiry list, detail, Excel/PDF export APIs
- bcrypt password hashing, parameterized queries, CORS config
- Default admin user seeding on server startup

### Frontend

- `/login` — hidden admin login (no navbar/footer)
- `/enquiries` — protected dashboard with table, search, filters, pagination, exports
- Contact form dual-submit (Google + backend when configured)
- Legacy `/admin/*` redirects

### Documentation & SQL

- `docs/TECHNOLOGY_AND_BACKEND_FLOW_DOCUMENTATION.md`
- `database/admin_enquiry_setup.sql`

---

## 3. Backend Architecture

```
HTTP Request
     │
     ▼
routes/          → URL mapping
     │
     ▼
middleware/      → rate limit, validation, JWT auth
     │
     ▼
controllers/     → HTTP request/response
     │
     ▼
services/        → business logic, field normalization
     │
     ▼
models/          → parameterized SQL
     │
     ▼
MySQL
```

### Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| `routes` | Mount endpoints, apply middleware |
| `middleware` | Auth, validation, rate limits |
| `controllers` | Parse req/res, call services |
| `services` | Business rules, field mapping |
| `models` | Database queries only |
| `utils` | Shared response helpers, export builders |

---

## 4. API List

### Public

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/enquiries` | Submit enquiry |
| POST | `/api/contact` | Legacy alias (same handler) |

**POST /api/enquiries body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "message": "Interested in demo",
  "source_page": "/contact"
}
```

Also accepts legacy contact form field names (`fullName`, `emailId`, `mobileNumber`, etc.).

**Success:** `201 { "success": true, "id": 1 }`  
**Error:** `{ "success": false, "message": "..." }` (no internal details)

### Admin (JWT required except login)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/me` | Current admin profile |
| GET | `/api/admin/enquiries` | Paginated list |
| GET | `/api/admin/enquiries/:id` | Single enquiry |
| GET | `/api/admin/enquiries/export/excel` | Excel download |
| GET | `/api/admin/enquiries/export/pdf` | PDF download |

**Login body:**

```json
{ "username": "admin", "password": "..." }
```

**List query params:** `page`, `limit`, `search`, `dateFrom`, `dateTo`

**Export query params:** `search`, `dateFrom`, `dateTo` (respects current filters)

---

## 5. Database Table Structure

### `enquiries`

| Column | Type | Notes |
|--------|------|-------|
| id | INT UNSIGNED PK AI | |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Required |
| phone | VARCHAR(50) | Required |
| message | TEXT | Required |
| source_page | VARCHAR(255) | Nullable |
| ip_address | VARCHAR(45) | Nullable |
| created_at | TIMESTAMP | Default CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Auto-update |

**Sort order:** `ORDER BY created_at DESC` (latest first)

### `admin_users`

| Column | Type | Notes |
|--------|------|-------|
| id | INT UNSIGNED PK AI | |
| username | VARCHAR(100) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt |
| role | VARCHAR(50) | Default `admin` |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Setup:** Run `cc-backend/database/admin_enquiry_setup.sql`  
**Default admin:** Seeded on first startup from `.env` if table is empty.

---

## 6. Admin Login Flow

```
Admin opens https://closedcircuit.in/login (direct URL only)
        │
        ▼
Enter username + password
        │
        ▼
POST /api/admin/login
        │
        ├─► Invalid → 401 "Invalid credentials"
        │
        └─► Valid → JWT returned
                │
                ▼
        Stored in sessionStorage (cc_admin_token)
                │
                ▼
        Redirect → /enquiries
```

---

## 7. Enquiry Dashboard Flow

```
/enquiries (protected)
        │
        ├─► No token → redirect /login
        │
        └─► GET /api/admin/enquiries?page=1&limit=10
                │
                ▼
        Table: S.No, Name, Email, Phone, Message, Date, View
                │
                ├─► Search / date filter → re-fetch
                ├─► Pagination → page param
                ├─► View → modal with full message
                ├─► Download Excel/PDF → export APIs with filters
                └─► Logout → clear session → /login
```

---

## 8. Export Excel / PDF Flow

```
Admin clicks Download Excel or PDF
        │
        ▼
GET /api/admin/enquiries/export/excel|pdf
  ?search=&dateFrom=&dateTo=
  Authorization: Bearer <token>
        │
        ▼
Server queries enquiries (same filters as list)
        │
        ├─► Excel: ExcelJS workbook buffer
        └─► PDF: PDFKit document buffer
                │
                ▼
        Browser downloads file
```

**Export columns:** S.No, Name, Email, Phone, Message, Submitted Date & Time (+ Source in Excel)

---

## 9. Security Notes

| Control | Implementation |
|---------|----------------|
| Password storage | bcrypt hash in `admin_users` — never plain text |
| Authentication | JWT Bearer token, 8h default expiry |
| Authorization | `requireAuth` middleware on all admin enquiry routes |
| SQL injection | Parameterized queries only |
| Input validation | Required fields + email format on enquiries; login validation |
| Rate limiting | 10 login attempts / 15 min; 30 enquiries / 15 min per IP |
| Error exposure | Generic messages to client; details logged server-side |
| CORS | Configurable via `CORS_ORIGIN` (comma-separated origins) |
| Admin visibility | `/login` and `/enquiries` excluded from navbar/footer |
| Token storage | sessionStorage (cleared when tab closes) |
| Trust proxy | Enabled for correct IP behind reverse proxy |

---

## 10. Production Deployment Steps

### Step 1 — Database

```bash
mysql -u root -p < cc-backend/database/admin_enquiry_setup.sql
```

### Step 2 — Backend environment

Create `cc-backend/.env` on your API server:

```env
PORT=5001
CORS_ORIGIN=https://closedcircuit.in
DB_HOST=your-mysql-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=cc_db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=strong-production-password
JWT_SECRET=long-random-secret-min-32-chars
JWT_EXPIRES_IN=8h
```

Start backend:

```bash
cd cc-backend
npm install
npm start
```

Use PM2 or similar for process management. Put nginx/Caddy in front with HTTPS.

### Step 3 — Frontend environment (Vercel)

In Vercel project settings:

```env
VITE_GOOGLE_SCRIPT_URL=<existing production value — keep unchanged>
VITE_API_URL=https://api.closedcircuit.in
```

Redeploy frontend. **Do not remove** `VITE_GOOGLE_SCRIPT_URL` until you intentionally migrate off Google Sheets.

### Step 4 — Verify

- Public site loads normally
- Contact form still submits to Google Sheets
- Contact form also saves to MySQL (when API URL set)
- `/login` works, not linked in nav
- `/enquiries` protected

---

## 11. Testing Checklist

| # | Test | Expected |
|---|------|----------|
| 1 | Homepage loads | Public site unchanged |
| 2 | Contact page UI | Same design, same fields |
| 3 | Contact form submit (production) | Google Sheets still receives data |
| 4 | Contact form submit (with API) | Row in `enquiries` table |
| 5 | `/login` direct URL | Admin login page, no navbar |
| 6 | Wrong credentials | Rejected with error message |
| 7 | Correct credentials | JWT issued, redirect to `/enquiries` |
| 8 | `/enquiries` without login | Redirect to `/login` |
| 9 | Enquiry list | Latest first (`created_at DESC`) |
| 10 | Pagination | Page navigation works |
| 11 | Search | Filters by name/email/phone/message |
| 12 | Date filter | Filters by date range |
| 13 | View details | Modal shows full message |
| 14 | Excel export | File downloads with data |
| 15 | PDF export | File downloads with data |
| 16 | Logout | Session cleared, redirect to `/login` |
| 17 | Production build | `npm run build` succeeds |
| 18 | Navbar | No login/enquiries links |

---

## 12. Local Development

```bash
# Terminal 1 — Backend
cd cc-backend
cp .env.example .env
# Edit .env with local MySQL credentials
mysql -u root -p < database/admin_enquiry_setup.sql
npm install
npm run dev

# Terminal 2 — Frontend
cd cc-app
cp .env.example .env
# Set VITE_API_URL=http://localhost:5001  (use 5001 if 5000 blocked on macOS)
npm install
npm run dev
```

**URLs:**

- Public site: http://localhost:5173
- Contact: http://localhost:5173/contact
- Admin login: http://localhost:5173/login
- Dashboard: http://localhost:5173/enquiries

**Default admin (after seed):** credentials from `ADMIN_USERNAME` / `ADMIN_PASSWORD` in backend `.env`

---

## 13. Files Modified / Created

### Created

- `cc-backend/database/admin_enquiry_setup.sql`
- `cc-backend/src/models/enquiry.model.js`
- `cc-backend/src/models/adminUser.model.js`
- `cc-backend/src/controllers/enquiry.controller.js`
- `cc-backend/src/routes/enquiry.routes.js`
- `cc-backend/src/routes/admin.routes.js`
- `cc-backend/src/middleware/validation.middleware.js`
- `cc-backend/src/middleware/rateLimit.middleware.js`
- `cc-backend/src/utils/response.js`
- `cc-backend/src/utils/exportExcel.js`
- `cc-backend/src/utils/exportPdf.js`
- `cc-backend/src/scripts/seedAdmin.js`
- `cc-app/src/pages/admin/EnquiryDashboard.jsx`
- `docs/TECHNOLOGY_AND_BACKEND_FLOW_DOCUMENTATION.md`
- `docs/ADMIN_ENQUIRY_BACKEND_ARCHITECTURE.md`

### Modified

- `cc-backend/src/config/env.js`
- `cc-backend/src/app.js`
- `cc-backend/src/index.js`
- `cc-backend/src/services/auth.service.js`
- `cc-backend/src/controllers/auth.controller.js`
- `cc-backend/src/middleware/auth.middleware.js`
- `cc-backend/src/routes/index.js`
- `cc-backend/.env.example`
- `cc-backend/package.json`
- `cc-app/src/App.jsx`
- `cc-app/src/pages/Contact.jsx` (submit handler only)
- `cc-app/src/pages/admin/AdminLogin.jsx`
- `cc-app/src/components/AdminRoute.jsx`
- `cc-app/src/lib/api.js`
- `cc-app/.env.example`

### Removed (superseded)

- `cc-backend/src/controllers/contact.controller.js`
- `cc-backend/src/services/contact.service.js`
- `cc-backend/src/repositories/contact.repository.js`
- `cc-backend/src/routes/contact.routes.js`
- `cc-backend/src/routes/auth.routes.js`
- `cc-app/src/pages/admin/AdminDashboard.jsx`

`POST /api/contact` remains available via `enquiry.routes.js` for backward compatibility.
