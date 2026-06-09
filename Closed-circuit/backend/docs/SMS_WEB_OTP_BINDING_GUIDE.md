# Web OTP binding & SMS template sources (local vs production)

This document explains how **mobile verification OTP** SMS text is chosen when `SMS_WEB_OTP_BINDING` is `true` or `false`, why **local** can look identical for both flags while **production** differs, and how this aligns with the Closed Circuit multi-tenant login app.

---

## TL;DR

| Question | Answer |
|----------|--------|
| Where does the SMS body come from at send time? | **`sms_templates` in the database** (`template_key = 'MOBILE_VERIFICATION_OTP'`), not directly from `.env`. |
| What does `.env` do? | On backend **startup**, optional `SMS_TEMPLATE_CONTENT_MOBILE_VERIFICATION_OTP` is synced into that DB row. Code defaults in `seedTemplates.js` seed new rows. |
| Why does production log a different body than `.env`? | Production DB row may still have **older text**, or you are reading **`rendered message`** (after Web OTP line logic), not raw DB content. |
| Why does `SMS_WEB_OTP_BINDING=true` fail to deliver SMS? | **DLT / gateway validation**: the final string (including `@domain #123456`) must **exactly** match a registered template. |
| Why does local behave the same for `true` and `false`? | With **`web_otp_host` invalid** (e.g. `localhost`), Web OTP binding is **disabled at runtime** even if the env flag is `true`. |
| Which gateway mode? | **SMS Just / Kapsystem** (`dlt_entity`): POST with query params — same as College CSM (`username`, `pass`, `dest_mobileno`, `message`, `dltentityid`, `dlttempid`, `response=Y`). Success response: schedule ID like `5068570-2008_12_29`. **Fast2SMS** (`dlt_variables`): template ID + variables only. |

---

## 1. Runtime flow

Mobile OTP send uses:

1. **`sendTemplateSms(..., 'MOBILE_VERIFICATION_OTP', variables, smsContext)`**
2. Loads **`sms_templates`** row where `template_key = 'MOBILE_VERIFICATION_OTP'`
3. **`renderOtpSmsMessage`** (`backend/src/utils/otpSmsRender.js`) adjusts the final body:
   - `SMS_WEB_OTP_BINDING`
   - `web_otp_host` (from browser `Origin` / `clientOrigin`, then `SMS_WEB_OTP_DOMAIN`, then `PUBLIC_APP_URL`)
   - OTP digits
   - Whether DB content contains `@{web_otp_host} #{otp}`

4. **`SMS_SEND_MODE`**:
   - `full_message` — sends rendered text + `dlttemplateid` (Kapsystem-style; **use this if SMS works in the other Closed Circuit app**)
   - `dlt_variables` — sends Fast2SMS DLT ID + `variables_values` (rendered text is logged only)

---

## 2. Production checklist

1. **Inspect DB (source of truth)**

```sql
SELECT template_key, template_content, template_id, is_active, updated_at
FROM sms_templates
WHERE template_key = 'MOBILE_VERIFICATION_OTP';
```

2. **Set gateway credentials** (SMS Just / Kapsystem — College CSM pattern):

```env
SMS_SEND_MODE=dlt_entity
SMS_GATEWAY_BASE_URL=https://www.smsjust.com/blank/sms/user/urlsms.php
SMS_BALANCE_URL=https://www.smsjust.com/blank/sms/user/balance_check.php
SMS_USERNAME=your_username
SMS_PASSWORD=your_password
SMS_SENDER_ID=CIRCUI
SMS_DLT_ENTITY_ID=1101638280000091921
```

Xtend alternative: `http://smsapi.xtendonline.com/blank/sms/user/urlsms.php`

3. **Web OTP (optional)**

```env
SMS_WEB_OTP_BINDING=true
SMS_WEB_OTP_DOMAIN=closedcircuit.in
```

Use the domain **exactly** as filed with the operator. The browser hostname must match (e.g. `closedcircuit.in` not `www.closedcircuit.in` if users open that URL).

4. **Force body from env** (optional)

```env
SMS_TEMPLATE_CONTENT_MOBILE_VERIFICATION_OTP=Dear {#alphanumeric#}...
```

Restart backend so `syncSmsTemplateContentFromEnv()` writes to DB.

5. **Check logs**

```
[sms] template content (from DB):
[sms] rendered message:
[sms] response status / error from gateway
```

6. **Check `notification_logs`**

```sql
SELECT status, error_message, provider_response, created_at
FROM notification_logs
WHERE notification_type = 'OTP_VERIFICATION'
ORDER BY id DESC LIMIT 5;
```

---

## 3. Code references

| Area | File |
|------|------|
| Env flags | `backend/src/config/env.js` |
| DB seed / env → DB sync | `backend/src/scripts/seedTemplates.js` |
| Final body (strip / substitute Web OTP) | `backend/src/utils/otpSmsRender.js` |
| Domain validity | `backend/src/utils/webOtpSms.js` |
| Send + gateway modes | `backend/src/services/smsService.js` |
| Mobile OTP send | `backend/src/services/verificationService.js` |
| Frontend Web OTP listener | `frontend/src/pages/Contact.jsx`, `frontend/src/utils/webOtp.js` |

---

*Aligned with Closed Circuit login OTP SMS patterns — June 2026*
