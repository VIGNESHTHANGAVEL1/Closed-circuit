# Contact Form to Google Sheets Setup

This website is static, so the contact form cannot write directly to a Google Sheet share link.
It must send data to a Google Apps Script Web App URL, and that script writes to the sheet.

Client sheet URL:

`https://docs.google.com/spreadsheets/d/1vjdvgzaBQuWuEyP7yMkeVPJF0_fuISQh5pOepbTvIjY/edit?usp=sharing`

The Apps Script template in this repo already targets this sheet ID.

## 1. Create or open Apps Script

Recommended:

- Open the client sheet
- `Extensions -> Apps Script`

Then replace the default script with:

- `scripts/google-apps-script-contact-form.gs`

## 2. Verify sheet target (only if needed)

In `google-apps-script-contact-form.gs`, this constant is prefilled:

`SPREADSHEET_ID = '1vjdvgzaBQuWuEyP7yMkeVPJF0_fuISQh5pOepbTvIjY'`

If client changes sheet in future, update this ID.

## 3. Prepare headers in the sheet

In Apps Script, run:

- `setupContactSheet`

Authorize on first run. This creates/fixes the header row in `Sheet1`.

## 4. Deploy as Web App

In Apps Script:

- `Deploy -> New deployment`
- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`

Copy the deployed URL. It looks like:

`https://script.google.com/macros/s/DEPLOYMENT_ID/exec`

## 5. Configure frontend env

Set `.env`:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Do not use:

- Google Sheet share URL (`docs.google.com/spreadsheets/...`)
- Apps Script editor URL

Only use the deployed `/exec` URL.

## 6. Restart and test

- Restart the Vite dev server after `.env` change
- Submit the contact form
- Confirm a new row appears in `Sheet1`

## Notes

- If script code changes later, redeploy and keep the latest `/exec` URL in `.env`.
- The form uses browser-safe submission (`application/x-www-form-urlencoded`) for Apps Script compatibility.
