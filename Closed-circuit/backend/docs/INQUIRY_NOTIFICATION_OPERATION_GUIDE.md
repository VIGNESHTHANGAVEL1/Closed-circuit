# Closed Circuit — Inquiry Notification Operation Guide

Complete operational reference for inquiry OTP verification, email/SMS notifications, call reminders, notification logs, and dashboard enhancements.

---

## 1. Feature Overview

This module adds the following capabilities to the Closed Circuit application:

| Feature | Description |
|---------|-------------|
| **Mobile OTP verification** | Verifies mobile number before enquiry submission (2-minute OTP) |
| **Email OTP verification** | Verifies email before enquiry submission (10-minute OTP) |
| **Database-driven templates** | SMS and email content stored in `sms_templates` and `email_templates` |
| **Submission notifications** | Client and admin SMS/email after enquiry is saved |
| **Call reminder scheduler** | Hourly job sends reminders 1 hour before scheduled calls |
| **Notification logs** | Every send attempt logged in `notification_logs` |
| **Dashboard enhancement** | "Today's Scheduled Calls" stat card |

**Design principles:**

- Enquiry save succeeds even if SMS/email fails
- Secrets (SMTP password, SMS API key, OTP values) are never exposed in frontend or API responses
- Templates are fetched from the database at send time
- Safe additive migrations only — existing enquiry data is preserved
- Google Sheets fallback mode (`VITE_DISABLE_API=true`) bypasses OTP verification

---

## 2. Inquiry Form OTP Verification Flow

```
User enters Full Name
    ↓
Mobile field enabled → Send Mobile OTP → Enter OTP → Mobile Verified (token issued)
    ↓
Email field valid → Send Email OTP → Enter OTP → Email Verified (token issued)
    ↓
User fills remaining fields + consent
    ↓
Submit enabled → POST /api/contact with verification tokens
    ↓
Backend validates tokens → Saves enquiry → Sends client/admin notifications
```

**Submit button rules:**

- Disabled until mobile AND email are verified (API mode only)
- Shows: *"Please complete mobile and email verification before submitting the enquiry."*

---

## 3. Mobile OTP Flow

| Step | API | Input | Output |
|------|-----|-------|--------|
| Send | `POST /api/verification/mobile/send` | `{ fullName, mobileNumber }` | `{ message, expiresInMinutes: 2 }` |
| Verify | `POST /api/verification/mobile/verify` | `{ mobileNumber, otp }` | `{ verified: true, mobileVerificationToken }` |

**Rules:**

- Full Name required before sending mobile OTP
- Client name from Full Name field is used in SMS (`{#alphanumeric#}`)
- OTP stored as SHA-256 hash — never logged in plain text
- Template: `MOBILE_VERIFICATION_OTP` (fetched from `sms_templates`)
- Verification token valid for 30 minutes for form submission

---

## 4. Email OTP Flow

| Step | API | Input | Output |
|------|-----|-------|--------|
| Send | `POST /api/verification/email/send` | `{ fullName, emailId }` | `{ message, expiresInMinutes: 10 }` |
| Verify | `POST /api/verification/email/verify` | `{ emailId, otp }` | `{ verified: true, emailVerificationToken }` |

**Rules:**

- Email verification enabled when mobile field has valid format (10–15 digits)
- Template: `EMAIL_VERIFICATION_OTP` (HTML from `email_templates`)
- On successful verify, `EMAIL_VERIFICATION_SUCCESS` email is sent automatically
- OTP valid for 10 minutes

---

## 5. Inquiry Submission Notification Flow

```
POST /api/contact (with mobileVerificationToken + emailVerificationToken)
    ↓
Validate form fields + verification tokens
    ↓
INSERT INTO contacts
    ↓
sendInquirySubmissionNotifications() — fire-and-forget, non-blocking
    ↓
Return { success: true, id }
```

If any notification fails, the enquiry is still saved. Failures are logged in `notification_logs`.

---

## 6. Client SMS/Email Notification Flow

Triggered after successful enquiry save.

| Channel | Template Key | Variables |
|---------|--------------|-----------|
| SMS | `ENQUIRY_RECEIVED_CLIENT` | client name |
| Email | `ENQUIRY_RECEIVED_CLIENT_EMAIL` | clientName, lookingFor, preferredCallDate, preferredCallTime, submittedAt |

---

## 7. Admin SMS/Email Notification Flow

Triggered after successful enquiry save (requires `ADMIN_MOBILE` / `ADMIN_EMAIL` in `.env`).

| Channel | Template Key | Variables |
|---------|--------------|-----------|
| SMS | `ENQUIRY_RECEIVED_ADMIN` | clientName, lookingFor, preferredDate, preferredTime |
| Email | `ENQUIRY_RECEIVED_ADMIN_EMAIL` | clientName, mobileNumber, emailId, lookingFor, preferredCallDate, preferredCallTime |

If admin contact details are not configured, admin notifications are skipped and logged as `SKIPPED`.

---

## 8. Reminder Scheduler Flow

```
Backend starts (index.js)
    ↓
startCallReminderScheduler()
    ↓
node-cron: '0 * * * *' (every hour, APP_TIMEZONE)
    ↓
findContactsDueForReminder() — status not Closed/Rejected, reminder flags incomplete
    ↓
Filter: scheduled call within next 1 hour (Asia/Kolkata)
    ↓
For each contact:
  - Client SMS: CALL_REMINDER_CLIENT
  - Client Email: CALL_REMINDER_CLIENT_EMAIL
  - Admin SMS: CALL_REMINDER_ADMIN
  - Admin Email: CALL_REMINDER_ADMIN_EMAIL
    ↓
Update only successful channel flags; failed channels retry next run
```

### Scheduler options

| Option | Pros | Cons |
|--------|------|------|
| **setInterval** | Simple | Drift, no timezone awareness |
| **node-cron** ✅ Recommended | Timezone support, cron syntax, runs in PM2 | Single-process only |
| **BullMQ / Redis** | Distributed, retries | Requires Redis infrastructure |
| **External cron job** | Decoupled from app | Extra deployment step |
| **Cloud scheduler** | Managed, reliable | Vendor lock-in, cost |

**Recommended for Closed Circuit: `node-cron`**

- Simple Node.js backend
- Runs inside existing PM2 process
- No Redis required
- Hourly schedule with `Asia/Kolkata` timezone

### Duplicate prevention

Columns on `contacts` table:

- `client_reminder_email_sent`
- `client_reminder_sms_sent`
- `admin_reminder_email_sent`
- `admin_reminder_sms_sent`
- `reminder_sent_at`

Each channel is marked independently. If SMS succeeds but email fails, only SMS flag is updated; email retries on the next hourly run.

### Manual scheduler test

```bash
cd backend
node -e "
import { bootstrapDatabase } from './src/config/bootstrap.js';
import { seedDefaultTemplates } from './src/scripts/seedTemplates.js';
import { runCallReminderSchedulerNow } from './src/schedulers/callReminderScheduler.js';

await bootstrapDatabase({ skipEnvValidation: true });
await seedDefaultTemplates();
const count = await runCallReminderSchedulerNow();
console.log('Processed reminders:', count);
process.exit(0);
"
```

Create a test enquiry with `preferredDate` = today and `preferredTime` within the next hour.

---

## 9. Dashboard "Today's Scheduled Calls" Logic

**Backend:** `GET /api/admin/dashboard/stats`

```json
{
  "success": true,
  "stats": {
    "totalEnquiries": 42,
    "newEnquiries": 10,
    "totalClients": 5,
    "todayScheduledCalls": 3
  }
}
```

**Query:** `COUNT(*) FROM contacts WHERE preferredDate = <today in APP_TIMEZONE>`

Today's date is computed using `Intl.DateTimeFormat` with `APP_TIMEZONE=Asia/Kolkata`.

**Frontend:** `AdminDashboard.jsx` shows three stat cards: Total Inquiries, New Inquiries, Today's Scheduled Calls.

---

## 10. Notification Logs Table Usage

Table: `notification_logs`

| Column | Purpose |
|--------|---------|
| `inquiry_id` | Links to `contacts.id` (nullable for OTP-only sends) |
| `recipient_type` | `CLIENT` or `ADMIN` |
| `channel` | `EMAIL` or `SMS` |
| `notification_type` | `OTP_VERIFICATION`, `EMAIL_VERIFICATION_SUCCESS`, `INQUIRY_SUBMISSION`, `CALL_REMINDER` |
| `status` | `SENT`, `FAILED`, `SKIPPED` |
| `template_key` | Which template was used |
| `provider_response` | Truncated provider response (no secrets) |
| `error_message` | Short safe error (no OTP, no credentials) |

**Inspect recent logs:**

```sql
SELECT id, inquiry_id, channel, notification_type, status, template_key, error_message, sent_at
FROM notification_logs
ORDER BY id DESC
LIMIT 20;
```

---

## 11. SMS Template Table Usage

Table: `sms_templates`

Fetched by `template_key` at send time via `templateService.js`.

**Active templates:**

| template_key | template_id | Trigger |
|--------------|-------------|---------|
| `MOBILE_VERIFICATION_OTP` | 1107178097971411003 | Mobile OTP send |
| `ENQUIRY_RECEIVED_CLIENT` | 1107178089489748985 | After enquiry save |
| `ENQUIRY_RECEIVED_ADMIN` | 1107178089528191303 | After enquiry save |
| `CALL_REMINDER_CLIENT` | 1107178091751804980 | 1 hour before call |
| `CALL_REMINDER_ADMIN` | 1107178091731358255 | 1 hour before call |

**Placeholder format:** `{#alphanumeric#}` and `{#numeric#}` replaced in order.

---

## 12. Email Template Table Usage

Table: `email_templates`

Fetched by `template_key` at send time. Supports full HTML in `html_content`.

**Active templates:**

| template_key | Subject | Trigger |
|--------------|---------|---------|
| `EMAIL_VERIFICATION_OTP` | Verify Your Email Address – OTP for Closed Circuit Account Activation | Email OTP send |
| `EMAIL_VERIFICATION_SUCCESS` | Welcome to Closed Circuit – Your Secure Digital Community | Email OTP verify success |
| `ENQUIRY_RECEIVED_CLIENT_EMAIL` | Thank You for Your Enquiry – We Will Connect with You as Scheduled | After enquiry save |
| `ENQUIRY_RECEIVED_ADMIN_EMAIL` | New Enquiry Received – Action Required | After enquiry save |
| `CALL_REMINDER_CLIENT_EMAIL` | Reminder: Your Closed Circuit Product Discussion is Scheduled in One Hour | 1 hour before call |
| `CALL_REMINDER_ADMIN_EMAIL` | Reminder: Client Discussion Scheduled in One Hour | 1 hour before call |

**Variable format:** `{{clientName}}`, `{{OTP_CODE}}`, `{{SCHEDULED_DATE}}`, etc.

---

## 13–14. How to Update Templates in Future

Templates are database-driven. Code changes are not required for content updates.

### SMS template update

```sql
UPDATE sms_templates
SET template_content = 'Dear {#alphanumeric#}, your new message here.',
    template_id = 'NEW_DLT_TEMPLATE_ID',
    sender_id = 'YOUR_SENDER',
    updated_at = NOW()
WHERE template_key = 'ENQUIRY_RECEIVED_CLIENT';
```

### Email template update

```sql
UPDATE email_templates
SET subject = 'New Subject Line',
    html_content = '<html>...full responsive HTML...</html>',
    updated_at = NOW()
WHERE template_key = 'ENQUIRY_RECEIVED_CLIENT_EMAIL';
```

### Supported email variables

| Variable | Description |
|----------|-------------|
| `{{clientName}}` | Full name from enquiry |
| `{{mobileNumber}}` | Client mobile |
| `{{emailId}}` | Client email |
| `{{lookingFor}}` | Product / Looking For selection |
| `{{preferredCallDate}}` | Preferred call date |
| `{{preferredCallTime}}` | Preferred call time |
| `{{OTP_CODE}}` | OTP (email verification only) |
| `{{submittedAt}}` | Submission timestamp |
| `{{SCHEDULED_DATE}}` | Reminder date alias |
| `{{SCHEDULED_TIME}}` | Reminder time alias |

### SMS variable rules

- `{#alphanumeric#}` — replaced sequentially with each string variable
- `{#numeric#}` — replaced with numeric OTP value
- Order of variables is defined in `inquiryNotificationService.js` and `verificationService.js`

---

## 15. Manual Testing Steps

### Mobile OTP test

1. Open `/contact`
2. Enter Full Name
3. Enter mobile number → click **Verify Mobile**
4. Check SMS on device
5. Enter OTP → click **Confirm OTP**
6. Confirm green "Verified" badge appears

### Email OTP test

1. With valid mobile entered, enter email → click **Verify Email**
2. Check inbox for HTML OTP email
3. Enter OTP → click **Confirm OTP**
4. Confirm verified badge + welcome email received

### Submit test

1. Complete both verifications
2. Fill all required fields + consent checkbox
3. Click **Send Message**
4. Confirm enquiry appears in admin dashboard
5. Check `notification_logs` for 4+ `INQUIRY_SUBMISSION` entries
6. Confirm client SMS, client email, admin SMS, admin email

### Scheduler test

1. Create enquiry with today's date and time 30–60 minutes from now
2. Wait for top-of-hour cron OR run manual test command above
3. Confirm `CALL_REMINDER` log entries
4. Confirm reminder flags updated on contact row
5. Run scheduler again — no duplicate sends

### Dashboard test

1. Create enquiry with today's `preferredDate`
2. Refresh admin dashboard — "Today's Scheduled Calls" increments
3. Create enquiry with tomorrow's date — today count unchanged

---

## 16. Troubleshooting Failed SMS/Email

| Symptom | Check |
|---------|-------|
| SMS `SKIPPED` | `SMS_GATEWAY_URL`, `SMS_API_KEY`, `SMS_ENABLED=true` |
| Email `SKIPPED` | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` configured |
| SMS `FAILED` | DLT template ID approved, sender ID registered, mobile format |
| Email `FAILED` | SMTP credentials, port, `SMTP_SECURE` setting, spam folder |
| Template not found | Run server once to seed; check `sms_templates` / `email_templates` |
| OTP not received | Check `notification_logs` for `OTP_VERIFICATION` status |
| Reminder not sent | Status must not be Closed/Rejected; time within next hour window |

**Never log:** SMTP password, SMS API key, full OTP values, JWT secret, DO Spaces secret.

---

## 17. Required .env Values

Add to `backend/.env` (existing values unchanged):

```env
APP_TIMEZONE=Asia/Kolkata

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=cc@closedcircuit.in
SMTP_FROM_NAME=Closed Circuit AI Pvt Ltd

ADMIN_EMAIL=
ADMIN_MOBILE=
ADMIN_NAME=Admin

SMS_GATEWAY_URL=
SMS_API_KEY=
SMS_SENDER_ID=
SMS_ENABLED=true
```

---

## 18. Production Deployment Notes

1. Run `npm install` in backend (adds `nodemailer`, `node-cron`)
2. Add new `.env` values on server
3. Restart PM2 process — migrations and template seeding run automatically on startup
4. Scheduler starts once per process — do not run multiple PM2 instances without deduplication
5. Configure DLT-approved SMS templates with your gateway provider
6. Use app-specific SMTP password (not personal email password)
7. Set `ADMIN_EMAIL` and `ADMIN_MOBILE` for admin notifications

---

## 19. Security Precautions

- OTP stored as SHA-256 hash only
- Verification tokens are random 64-char hex, expire in 30 minutes
- No secrets in frontend bundle, API responses, or notification logs
- Rate limiting on verification and enquiry endpoints (30 req / 15 min)
- SMS/email failures do not block enquiry submission
- Template content editable in DB — restrict DB access in production

---

## 20. Code Reference — Files Created/Modified

### `src/services/emailService.js`

| | |
|---|---|
| **Purpose** | Send HTML emails via Nodemailer using DB templates |
| **Main functions** | `sendTemplateEmail()` |
| **Input** | `{ to, templateKey, variables, recipientType, notificationType, recipientName, inquiryId }` |
| **Output** | `{ success, messageId }` or `{ success: false, skipped/error }` |
| **Error handling** | Logs to `notification_logs` as FAILED; never throws to caller |
| **Used by** | `verificationService.js`, `inquiryNotificationService.js` |

### `src/services/smsService.js`

| | |
|---|---|
| **Purpose** | Send DLT SMS via configured gateway using DB templates |
| **Main functions** | `sendTemplateSms()` |
| **Input** | `{ mobile, templateKey, variables[], recipientType, notificationType, recipientName, inquiryId }` |
| **Output** | `{ success, message }` or `{ success: false, skipped/error }` |
| **Error handling** | Logs FAILED status; masks mobile in dev logs |
| **Used by** | `verificationService.js`, `inquiryNotificationService.js` |

### `src/services/templateService.js`

| | |
|---|---|
| **Purpose** | Fetch and render SMS/email templates from database |
| **Main functions** | `getSmsTemplate()`, `getEmailTemplate()`, `buildSmsMessage()`, `buildEmailMessage()` |
| **Input** | `templateKey`, variables array (SMS) or object (email) |
| **Output** | Rendered message with template metadata |
| **Error handling** | Throws 500 if template missing |
| **Used by** | `emailService.js`, `smsService.js` |

### `src/services/notificationLogService.js`

| | |
|---|---|
| **Purpose** | Safe wrapper for writing notification audit logs |
| **Main functions** | `logNotificationAttempt()` |
| **Input** | Log fields (status, channel, template_key, etc.) |
| **Output** | Insert ID or silent fail |
| **Error handling** | Catches DB errors — logging failure never crashes send flow |
| **Used by** | `emailService.js`, `smsService.js` |

### `src/schedulers/callReminderScheduler.js`

| | |
|---|---|
| **Purpose** | Hourly cron job for call reminders |
| **Main functions** | `startCallReminderScheduler()`, `runCallReminderSchedulerNow()` |
| **Input** | None (reads DB) |
| **Output** | Number of contacts processed |
| **Error handling** | try/catch per run and per contact — never crashes backend |
| **Used by** | `src/index.js` on startup |

### `src/routes/verification.routes.js`

| | |
|---|---|
| **Purpose** | Public OTP verification API routes |
| **Routes** | `/api/verification/mobile/send`, `/verify`, `/email/send`, `/verify` |
| **Used by** | `Contact.jsx` frontend |

### `src/controllers/verification.controller.js`

| | |
|---|---|
| **Purpose** | HTTP handlers for OTP send/verify |
| **Main functions** | `requestMobileOtp`, `confirmMobileOtp`, `requestEmailOtp`, `confirmEmailOtp` |
| **Error handling** | 400 for validation, 500 for unexpected errors |

### `src/controllers/enquiry.controller.js` (modified)

| | |
|---|---|
| **Purpose** | Enquiry submit — removed sensitive body logging |
| **Change** | Delegates verification check to `enquiry.service.js` |

### `src/services/enquiry.service.js` (modified)

| | |
|---|---|
| **Purpose** | Enquiry CRUD + verification token validation + post-submit notifications |
| **New** | `assertVerificationTokens()` before insert; `todayScheduledCalls` in dashboard stats |

### `src/services/verificationService.js`

| | |
|---|---|
| **Purpose** | OTP generation, verification, session token issuance |
| **Main functions** | `sendMobileVerificationOtp`, `verifyMobileOtp`, `sendEmailVerificationOtp`, `verifyEmailOtp`, `assertVerificationTokens` |

### `src/services/inquiryNotificationService.js`

| | |
|---|---|
| **Purpose** | Orchestrates submission and reminder notifications |
| **Main functions** | `sendInquirySubmissionNotifications`, `sendCallReminderNotifications`, `processDueCallReminders` |

### `src/models/smsTemplate.model.js`

| | |
|---|---|
| **Purpose** | Data access for `sms_templates` table |
| **Main functions** | `findSmsTemplateByKey`, `countSmsTemplateByKey`, `insertSmsTemplate` |

### `src/models/emailTemplate.model.js`

| | |
|---|---|
| **Purpose** | Data access for `email_templates` table |
| **Main functions** | `findEmailTemplateByKey`, `countEmailTemplateByKey`, `insertEmailTemplate` |

### `src/models/notificationLog.model.js`

| | |
|---|---|
| **Purpose** | Insert rows into `notification_logs` |

### `src/models/verificationOtp.model.js`

| | |
|---|---|
| **Purpose** | Store and validate hashed OTPs in `verification_otps` |

### `src/models/verificationSession.model.js`

| | |
|---|---|
| **Purpose** | Issue and validate post-OTP verification tokens |

### `src/models/contact.model.js` (modified)

| | |
|---|---|
| **Purpose** | Added reminder flags, `countTodayScheduledContacts`, `findContactsDueForReminder` |

### `src/scripts/seedTemplates.js`

| | |
|---|---|
| **Purpose** | Seed default SMS/email templates on startup if missing |
| **Rule** | Never duplicates — checks `count*ByKey` before insert |

### `src/config/schema.js` (modified)

| | |
|---|---|
| **Purpose** | Table definitions for new tables and contact reminder columns |

### `frontend/src/pages/Contact.jsx` (modified)

| | |
|---|---|
| **Purpose** | OTP verification UI, submit gating, verification token submission |

### `frontend/src/pages/admin/AdminDashboard.jsx` (modified)

| | |
|---|---|
| **Purpose** | Three stat cards including Today's Scheduled Calls |

---

*Last updated: June 2026*
