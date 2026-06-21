# Production Run Steps — cc-backend

This guide covers deploying the Closed Circuit backend API on a production server.

## Prerequisites

- Node.js 18+ installed
- MySQL server running and reachable from the app host
- DigitalOcean Spaces credentials (for client image uploads)
- A `.env` file in the `cc-backend` directory (never commit this file)

## 1. Install dependencies

```bash
cd cc-backend
npm install
```

## 2. Configure environment (`.env`)

Copy the example file and fill in production values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `5000`) |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name (default `cc_db`) |
| `ADMIN_USERNAME` | Initial admin login username |
| `ADMIN_PASSWORD` | Initial admin login password |
| `JWT_SECRET` | Long random string for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `8h`) |
| `DO_SPACES_KEY` | DigitalOcean Spaces access key |
| `DO_SPACES_SECRET` | DigitalOcean Spaces secret key |
| `DO_SPACES_ENDPOINT` | Spaces endpoint URL |
| `DO_SPACES_REGION` | Spaces region (e.g. `blr1`) |
| `DO_SPACES_BUCKET` | Spaces bucket name |
| `DO_SPACES_ROOT_FOLDER` | Root folder prefix (may be empty) |
| `CLIENT_IMAGE_MAX_BYTES` | Max upload size in bytes |

### Inquiry notification variables (add to `.env`)

These are **credentials only**. SMS/email **template content** is stored in the database (`sms_templates`, `email_templates`) and auto-seeded on first startup — do not put template text in `.env`.

| Variable | Description |
|----------|-------------|
| `APP_TIMEZONE` | Timezone for scheduler and dashboard (e.g. `Asia/Kolkata`) |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (usually `587`) |
| `SMTP_SECURE` | `true` for port 465, else `false` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM_EMAIL` | Sender email (e.g. `cc@closedcircuit.in`) |
| `SMTP_FROM_NAME` | Sender display name |
| `ADMIN_EMAIL` | Admin email for enquiry/reminder alerts |
| `ADMIN_MOBILE` | Admin mobile for enquiry/reminder SMS |
| `ADMIN_NAME` | Admin name used in reminder templates |
| `SMS_GATEWAY_URL` | SMS provider API URL |
| `SMS_API_KEY` | SMS provider API key |
| `SMS_SENDER_ID` | DLT-approved sender ID |
| `SMS_ENABLED` | `true` to enable SMS (default `true`) |

After `npm start`, check the console for `✅ Templates seeded` or `✅ Templates checked`. Verify in MySQL:

```sql
SELECT template_key, template_id FROM sms_templates;
SELECT template_key, subject FROM email_templates;
```

**Security:** Do not log or commit `.env` values. Secrets are never printed by build or startup scripts.

## 3. Run production build check

Validates project files, environment variables, database connectivity, and Spaces config:

```bash
npm run build
```

Fix any reported errors before starting the server.

## 4. Start the server

**Option A — build then start (recommended for first deploy):**

```bash
npm run build
npm start
```

**Option B — single command:**

```bash
npm run prod
```

**Option C — development with auto-reload:**

```bash
npm run dev
```

On successful startup you should see:

```
✅ Database connected
✅ Database created or already exists: cc_db
✅ Tables checked
✅ Missing columns migrated
✅ Admin user already exists: admin   (or seeded on first run)
✅ Backend ready on PORT 5000
```

## 5. PM2 (process manager)

Install PM2 globally if needed:

```bash
npm install -g pm2
```

Start the backend:

```bash
cd cc-backend
pm2 start src/index.js --name cc-backend
```

Or with build check first:

```bash
npm run build && pm2 start src/index.js --name cc-backend
```

Restart after code or `.env` changes:

```bash
pm2 restart cc-backend
```

View logs:

```bash
pm2 logs cc-backend
```

Check status:

```bash
pm2 status
```

## 6. Optional database commands

These run the same safe bootstrap used at startup:

```bash
# Create database + tables + migrate columns
npm run db:init

# Run migrations only (database must exist)
npm run db:migrate
```

Normally you do **not** need these manually — `npm start` handles everything automatically.

## Automatic database creation

On every startup the backend:

1. Connects to MySQL **without** selecting a database
2. Checks whether `DB_NAME` (default `cc_db`) exists
3. Creates it if missing (`utf8mb4` / `utf8mb4_unicode_ci`)
4. Connects to the target database and continues startup

No manual `CREATE DATABASE` is required on a fresh server as long as the MySQL user has create privileges.

## Migration safety

This backend uses **mysql2** (not Sequelize). Migrations are safe and non-destructive:

- `CREATE TABLE IF NOT EXISTS` for `admin_users`, `contacts`, and `clients`
- Missing columns are added with `ALTER TABLE ... ADD COLUMN`
- Existing tables are **never** dropped
- Existing columns are **never** dropped or altered
- No `force` sync — production data is preserved

The `status` column on `contacts` is added automatically if an older schema is detected.

## Admin user seeding

On startup, if no user exists with `ADMIN_USERNAME`, one is created using `ADMIN_PASSWORD` (bcrypt hashed). If the admin already exists, credentials are **not** overwritten.

## Troubleshooting

| Error | Action |
|-------|--------|
| Missing environment variables | Add the listed keys to `.env` and re-run `npm run build` |
| Database connection failed | Verify MySQL is running, host/user/password, and firewall rules |
| Migration failed | Check MySQL user has `CREATE`, `ALTER`, and `INDEX` privileges |
| Port already in use | Change `PORT` in `.env` or stop the process using that port |
| Spaces config incomplete | Set all `DO_SPACES_*` variables in `.env` |

The application exits immediately with a clear error message when critical configuration is missing or invalid.
