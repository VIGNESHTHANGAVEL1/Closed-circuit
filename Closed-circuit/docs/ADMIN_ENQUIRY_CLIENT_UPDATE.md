# Admin Enquiry Status, Dashboard & Client Module

This document describes the enquiry status workflow, admin dashboard, client management module, public clients page, and DigitalOcean Spaces image uploads.

---

## 1. Enquiry status feature

- New column `status` on the `contacts` table (enquiries are stored in `contacts`).
- Allowed values: `New`, `Processing`, `Rejected temporarily`, `Rejected permanently`, `Closed`.
- Default: `New` (existing rows with `NULL` status are treated as `New` in queries and UI).
- Admin enquiry table shows an inline status dropdown per row; changes save immediately without a full page reload.

---

## 2. Status API

**Endpoint:** `PATCH /api/admin/enquiries/:id/status`  
**Auth:** Bearer JWT (admin)

**Payload:**
```json
{ "status": "Processing" }
```

**Response (success):**
```json
{
  "success": true,
  "enquiry": { "id": 1, "status": "Processing", ... },
  "message": "Status updated successfully."
}
```

**Validation:** Only the five allowed status strings are accepted.

**List/export filters:** Query param `status` on:
- `GET /api/admin/enquiries`
- `GET /api/admin/enquiries/export/excel`
- `GET /api/admin/enquiries/export/pdf`

Search also matches the status field.

---

## 3. Status DB migration

Run once against `cc_db`:

```bash
mysql -u root -p cc_db < cc-backend/database/contacts_status_migration.sql
```

File: `cc-backend/database/contacts_status_migration.sql`

---

## 4. Admin dashboard flow

| Route | Purpose |
|-------|---------|
| `/login` | Admin login |
| `/admin/dashboard` | Main dashboard (post-login redirect) |
| `/admin/enquiries` | Enquiry dashboard |
| `/admin/clients` | Client management |
| `/enquiries` | Redirects to `/admin/enquiries` (backward compatible) |
| `/admin` | Redirects to `/admin/dashboard` |

**Stats API:** `GET /api/admin/dashboard/stats`  
Returns: `totalEnquiries`, `newEnquiries`, `totalClients`.

---

## 5. Client module architecture

```
Admin UI (multipart form)
  → POST/PUT /api/admin/clients (JWT)
  → client.controller → client.service
  → spaces.service (DO Spaces upload)
  → client.model (MySQL clients table)

Public UI
  → GET /api/clients (no auth)
  → client.service.listPublicClients (safe fields only)
```

Clients are **not** linked to the enquiry/contacts table. All client data is entered manually in admin.

---

## 6. Client DB table

Run:

```bash
mysql -u root -p cc_db < cc-backend/database/clients_setup.sql
```

| Column | Type |
|--------|------|
| id | INT UNSIGNED PK |
| name | VARCHAR(255) |
| mobile_number | VARCHAR(50) |
| email_id | VARCHAR(255) |
| address | TEXT |
| client_type | ENUM('b2b','b2c') |
| business_type | VARCHAR(255) |
| onboard_date | DATE |
| client_logo_key | VARCHAR(512) |
| client_logo_url | VARCHAR(1024) |
| client_profile_pic_key | VARCHAR(512) |
| client_profile_pic_url | VARCHAR(1024) |
| created_at, updated_at | TIMESTAMP |

---

## 7. Client API list

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/clients` | Public (safe fields only) |
| GET | `/api/admin/clients` | JWT |
| GET | `/api/admin/clients/:id` | JWT |
| POST | `/api/admin/clients` | JWT + multipart |
| PUT | `/api/admin/clients/:id` | JWT + multipart |
| DELETE | `/api/admin/clients/:id` | JWT |

**Multipart fields:** `client_logo`, `client_profile_pic` (optional on create/update).

**Text fields:** `name`, `mobile_number`, `email_id`, `address`, `client_type`, `business_type`, `onboard_date`.

---

## 8. Public clients page flow

- Navbar item **Clients** → `/clients` (alias `/client` redirects).
- Page: `cc-app/src/pages/Clients.jsx`
- Fetches `GET /api/clients`
- Displays: name, client type, business type, onboard date, logo, profile image
- No admin controls on the public page.

---

## 9. DigitalOcean Spaces image upload flow

Videos/media on the public site already use the CDN (`lara.blr1.cdn.digitaloceanspaces.com`). Client images reuse the same bucket via `@aws-sdk/client-s3`.

**On backend start:** `ensureClientFoldersExist()` creates placeholder objects if missing (does not modify existing video/media).

**Folder paths (object keys):**
```
Closed Circuit/clients/logos/<unique-filename>
Closed Circuit/clients/profile-pictures/<unique-filename>
```

If `DO_SPACES_ROOT_FOLDER` is set in `.env`, it is prepended to keys.

**Upload validation:**
- Types: jpg, jpeg, png, webp
- Max size: `CLIENT_IMAGE_MAX_BYTES` (default 5MB)
- Unique sanitized filenames

**DB storage:** Both object `key` and public CDN `url` are saved. The public API returns only URLs.

**Update behavior:** Omitting image fields on PUT keeps existing images. New uploads replace keys/URLs and delete the previous object when possible.

**Delete behavior:** Deleting a client removes associated images from Spaces (errors are logged, not fatal).

---

## 10. Required .env values

```env
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_REGION=blr1
DO_SPACES_BUCKET=lara
DO_SPACES_ROOT_FOLDER=
CLIENT_IMAGE_MAX_BYTES=5242880
```

Never expose `DO_SPACES_KEY` or `DO_SPACES_SECRET` to the frontend. Uploads run only on the backend.

---

## 11. Export columns (enquiries)

Excel and PDF exports use current filters (including `status`) and columns:

1. S.No  
2. Name  
3. Email  
4. Phone  
5. Message/Description  
6. Status  
7. Submitted Date & Time  

---

## 12. Testing checklist

- [ ] Public website pages load (unchanged except Clients menu/page)
- [ ] Contact form still saves enquiries
- [ ] Enquiry dashboard shows Status column; default is New
- [ ] Status dropdown updates DB without full page reload
- [ ] Search/filter by Closed shows only Closed records
- [ ] Excel/PDF export respects status filter
- [ ] Admin login redirects to `/admin/dashboard`
- [ ] Dashboard cards link to enquiries and clients
- [ ] Admin CRUD for clients (create, edit, delete with confirm)
- [ ] Client logo/profile upload to Spaces under correct folders
- [ ] DB stores correct URL/key; admin list shows images
- [ ] Update without new image keeps old image
- [ ] Invalid file type rejected
- [ ] Public `/clients` shows admin-added clients; no admin controls
- [ ] Existing CDN videos (Flow, Gifts) still work

---

## 13. Deployment steps

1. Pull latest code on server.
2. Run SQL migrations:
   - `contacts_status_migration.sql`
   - `clients_setup.sql`
3. Set DigitalOcean Spaces variables in backend `.env` (see section 10).
4. Install backend dependencies: `npm install` in `cc-backend`.
5. Restart backend API (folder init runs on start).
6. Build frontend: `npm run build` in `cc-app`.
7. Verify admin login → dashboard → enquiries/clients.
8. Create a test client with images; confirm CDN URLs on public `/clients`.

---

## 14. Production deployment notes

- Use strong `JWT_SECRET` and `ADMIN_PASSWORD` in production.
- Restrict `CORS_ORIGIN` to your site origin(s).
- Ensure MySQL user uses parameterized queries (handled by `mysql2` placeholders).
- Spaces bucket policy should allow public-read for client images (same as existing media).
- If Spaces is not configured, client create/update with images returns 503; text-only operations still require a configured DB table.
