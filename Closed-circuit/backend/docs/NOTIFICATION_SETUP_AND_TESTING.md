# Closed Circuit — Notification Setup & Testing Guide

Quick reference for fixing missing SMS/email delivery, understanding where templates are configured, and testing OTP verification locally or in production.

---

## 1. Important: Templates Are NOT in `.env`

| Item | Where it is configured |
|------|------------------------|
| SMS template text, DLT template IDs | MySQL table `sms_templates` (auto-seeded on startup) |
| Email HTML, subjects | MySQL table `email_templates` (auto-seeded on startup) |
| SMTP password, SMS API key, sender ID | `backend/.env` only |

**You do not put template content or template IDs in `.env`.**

Templates are inserted automatically when the backend starts. On first run you should see:

```
✅ Templates seeded (SMS: 5, Email: 6)
```

On later runs:

```
✅ Templates checked (no new seeds required)
```

### Verify templates in MySQL

```sql
SELECT template_key, template_id FROM sms_templates;
SELECT template_key, subject FROM email_templates;
```

Expected SMS keys:

- `MOBILE_VERIFICATION_OTP`
- `ENQUIRY_RECEIVED_CLIENT`
- `ENQUIRY_RECEIVED_ADMIN`
- `CALL_REMINDER_CLIENT`
- `CALL_REMINDER_ADMIN`

Expected email keys:

- `EMAIL_VERIFICATION_OTP`
- `EMAIL_VERIFICATION_SUCCESS`
- `ENQUIRY_RECEIVED_CLIENT_EMAIL`
- `ENQUIRY_RECEIVED_ADMIN_EMAIL`
- `CALL_REMINDER_CLIENT_EMAIL`
- `CALL_REMINDER_ADMIN_EMAIL`

---

## 2. Install Dependencies (Required After Git Pull)

If you see:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'node-cron'
```

Run in the backend folder:

```bash
cd backend
npm install
npm start
```

Required packages: `node-cron`, `nodemailer`

---

## 3. Add Credentials to `.env`

Open `backend/.env` and **keep your existing values** (`PORT`, `DB_*`, `JWT_*`, `DO_SPACES_*`, etc.). **Append** these notification variables:

```env
APP_TIMEZONE=Asia/Kolkata

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=cc@closedcircuit.in
SMTP_FROM_NAME=Closed Circuit AI Pvt Ltd

# Admin receives enquiry + reminder alerts
ADMIN_EMAIL=admin@closedcircuit.in
ADMIN_MOBILE=8217543446
ADMIN_NAME=Admin

# SMS gateway (Fast2SMS example)
SMS_GATEWAY_URL=https://www.fast2sms.com/dev/bulkV2
SMS_API_KEY=your-fast2sms-api-key
SMS_SENDER_ID=your-dlt-sender-id
SMS_ENABLED=true
```

Replace placeholder values with your real SMTP and SMS provider credentials.

**Restart the backend after saving `.env`:**

```bash
npm start
```

---

## 4. Console Logs on Startup

When `npm start` runs, you will see a notification configuration summary:

```
--- Notification configuration ---
  Timezone: Asia/Kolkata

  SMS/Email TEMPLATES: stored in MySQL (sms_templates, email_templates)
  Templates are NOT configured in .env — they seed on startup.

  .env credentials required for actual delivery:

  ⚠️  SMS gateway NOT configured
     Add to .env: SMS_GATEWAY_URL, SMS_API_KEY, SMS_SENDER_ID
     Missing: SMS_GATEWAY_URL
     Missing: SMS_API_KEY
     Missing: SMS_SENDER_ID

  ⚠️  SMTP email NOT configured
     Add to .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL
     Missing: SMTP_HOST
     Missing: SMTP_USER
     Missing: SMTP_PASS

  ⚠️  Admin notifications: set ADMIN_EMAIL and ADMIN_MOBILE in .env

  ℹ️  Local dev: OTP will print in this console when gateway/SMTP is missing.
  ℹ️  Production: configure .env credentials for real SMS/email delivery.
----------------------------------
```

When everything is configured correctly:

```
  ✅ SMS gateway configured
     URL: https://www.fast2sms.com/dev/bulkV2
     Sender ID: YOUR_SENDER
     API key: (set)

  ✅ SMTP email configured
     Host: smtp.gmail.com:587
     From: cc@closedcircuit.in
     User: your-email@gmail.com

  ✅ Admin notification contacts
     Email: admin@closedcircuit.in
     Mobile: 82****46
```

---

## 5. Console Logs When Clicking “Verify Mobile”

### Without SMS configured (local testing)

```
[verification] POST /api/verification/mobile/send
[verification] Mobile OTP requested | name=VIGNESH T | mobile=97****03
[sms] SKIPPED MOBILE_VERIFICATION_OTP → 97**** | SMS gateway not configured in .env

[verification] DEV OTP (MOBILE) — gateway not configured, use this OTP to test:
[verification]   Mobile: 9751196903
[verification]   OTP: 482910
[verification]   Valid for 2 minutes
[verification]   Configure .env credentials for real SMS/email delivery.

[verification] Mobile OTP result: deliveryMode=console
```

**Use the OTP from the backend terminal** (not the browser) to complete verification.

The contact form will show:

> SMTP not configured. OTP printed in backend console for local testing.

(or the SMS equivalent for mobile)

### With SMS configured (production)

```
[verification] POST /api/verification/mobile/send
[verification] Mobile OTP requested | name=VIGNESH T | mobile=97****03
[sms] Sending MOBILE_VERIFICATION_OTP | template_id=1107178097971411003 | to=97****
[sms] SENT MOBILE_VERIFICATION_OTP → 97****
[verification] Mobile OTP result: deliveryMode=sms
```

---

## 6. Console Logs When Clicking “Verify Email”

### Without SMTP configured (local testing)

```
[verification] POST /api/verification/email/send
[verification] Email OTP requested | name=VIGNESH T | email=vigneshtskv96@gmail.com
[email] SKIPPED EMAIL_VERIFICATION_OTP → vigneshtskv96@gmail.com | SMTP not configured in .env

[verification] DEV OTP (EMAIL) — gateway not configured, use this OTP to test:
[verification]   Email: vigneshtskv96@gmail.com
[verification]   OTP: 739201
[verification]   Valid for 10 minutes
[verification]   Configure .env credentials for real SMS/email delivery.

[verification] Email OTP result: deliveryMode=console
```

### With SMTP configured (production)

```
[verification] POST /api/verification/email/send
[verification] Email OTP requested | name=VIGNESH T | email=vigneshtskv96@gmail.com
[email] Sending EMAIL_VERIFICATION_OTP → vigneshtskv96@gmail.com | subject="Verify Your Email..."
[email] SENT EMAIL_VERIFICATION_OTP → vigneshtskv96@gmail.com | messageId=...
[verification] Email OTP result: deliveryMode=email
```

---

## 7. Why “OTP Sent” Appeared But No SMS/Email Arrived

The form showed success because:

1. OTP was generated and saved in the database (`verification_otps` table)
2. SMS/email delivery was **skipped** because `.env` credentials were missing
3. The backend now logs this clearly and prints OTP in the console for local testing

---

## 8. Check Notification Logs in Database

Every send attempt is recorded:

```sql
SELECT channel, notification_type, status, template_key, error_message, created_at
FROM notification_logs
ORDER BY id DESC
LIMIT 10;
```

| status | Meaning |
|--------|---------|
| `SENT` | Delivered successfully |
| `FAILED` | Gateway/SMTP error — check `error_message` |
| `SKIPPED` | Credentials not configured in `.env` |

---

## 9. Local Testing Steps (Without SMS/Email Setup)

1. Start backend: `npm start`
2. Start frontend: `npm run dev`
3. Open `http://localhost:5173/contact`
4. Enter **Full Name** and **Mobile Number**
5. Click **Verify Mobile**
6. Read OTP from the **backend terminal console**
7. Enter OTP → click **Confirm OTP**
8. Enter **Email ID** → click **Verify Email**
9. Read email OTP from **backend console**
10. Enter OTP → click **Confirm OTP**
11. Complete the form and submit

---

## 10. Production Testing Steps (With SMS/Email Setup)

1. Fill all notification variables in `backend/.env`
2. Restart backend: `npm start`
3. Confirm startup shows `✅ SMS gateway configured` and `✅ SMTP email configured`
4. Open contact form
5. Verify mobile — check phone for SMS
6. Verify email — check inbox (and spam folder)
7. Submit enquiry
8. Check `notification_logs` for `INQUIRY_SUBMISSION` entries
9. Confirm client and admin received SMS/email

---

## 11. Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find package 'node-cron'` | Run `npm install` in `backend` |
| SMS `SKIPPED` in logs | Set `SMS_GATEWAY_URL`, `SMS_API_KEY`, `SMS_SENDER_ID` in `.env` |
| Email `SKIPPED` in logs | Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in `.env` |
| Template not found error | Restart backend to run template seeding |
| OTP expired | Request new OTP (mobile: 2 min, email: 10 min) |
| Gmail SMTP fails | Use an app password, not your normal Gmail password |
| SMS fails with DLT error | Confirm template ID and sender ID are DLT-approved |

---

## 12. Security Reminders

- Never commit `backend/.env`
- Never put template content in `.env`
- OTP values are printed in console **only when gateway/SMTP is not configured** (for local testing)
- OTP is never returned in API responses
- SMTP password and SMS API key are never logged

---

## 13. Related Documentation

- Full operation guide: [INQUIRY_NOTIFICATION_OPERATION_GUIDE.md](./INQUIRY_NOTIFICATION_OPERATION_GUIDE.md)
- Production deploy: [../PRODUCTION_RUN_STEPS.md](../PRODUCTION_RUN_STEPS.md)
- Environment template: [../.env.example](../.env.example)

---

*Last updated: June 2026*
