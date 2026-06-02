const SPREADSHEET_ID = '1FlvkAK-_9vvVe2NffOEefi1tqAc7yUMG4zry6DAhK5I';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    const sheet = getSheet_();
    const payload = normalizePayload_(e);

    sheet.appendRow([
      new Date(),
      payload.fullName,
      payload.mobileNumber,
      payload.emailId,
      payload.town,
      payload.state,
      payload.country,
      payload.lookingFor,
      payload.preferredContactMethod,
      payload.preferredDate,
      payload.preferredTime,
      payload.description,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupContactSheet() {
  const sheet = getSheet_();
  const headers = [
    'Submitted At',
    'Full Name',
    'Mobile Number',
    'Email ID',
    'Town/City',
    'State',
    'Country',
    'Looking For',
    'Preferred Contact Method',
    'Preferred Date',
    'Preferred Time',
    'Description',
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else {
    const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const isHeaderMissing = headers.some((header, index) => existingHeaders[index] !== header);

    if (isHeaderMissing) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function normalizePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  return {
    fullName: valueOrEmpty_(params.fullName),
    mobileNumber: valueOrEmpty_(params.mobileNumber),
    emailId: valueOrEmpty_(params.emailId),
    town: valueOrEmpty_(params.town),
    state: valueOrEmpty_(params.state),
    country: valueOrEmpty_(params.country),
    lookingFor: valueOrEmpty_(params.lookingFor),
    preferredContactMethod: valueOrEmpty_(params.preferredContactMethod),
    preferredDate: valueOrEmpty_(params.preferredDate),
    preferredTime: valueOrEmpty_(params.preferredTime),
    description: valueOrEmpty_(params.description),
  };
}

function valueOrEmpty_(value) {
  return value ? String(value).trim() : '';
}
