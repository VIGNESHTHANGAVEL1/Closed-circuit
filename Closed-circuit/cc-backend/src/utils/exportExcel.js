import ExcelJS from 'exceljs';

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export async function buildEnquiriesExcel(contacts) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Contacts');

  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Full Name', key: 'fullName', width: 24 },
    { header: 'Mobile', key: 'mobileNumber', width: 18 },
    { header: 'Email', key: 'emailId', width: 28 },
    { header: 'Town', key: 'town', width: 18 },
    { header: 'State', key: 'state', width: 18 },
    { header: 'Country', key: 'country', width: 18 },
    { header: 'Looking For', key: 'lookingFor', width: 22 },
    { header: 'Preferred Contact', key: 'preferredContactMethod', width: 20 },
    { header: 'Preferred Date', key: 'preferredDate', width: 16 },
    { header: 'Preferred Time', key: 'preferredTime', width: 16 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Submitted Date & Time', key: 'created_at', width: 24 },
  ];

  contacts.forEach((row, index) => {
    sheet.addRow({
      sno: index + 1,
      fullName: row.fullName,
      mobileNumber: row.mobileNumber,
      emailId: row.emailId,
      town: row.town,
      state: row.state,
      country: row.country,
      lookingFor: row.lookingFor,
      preferredContactMethod: row.preferredContactMethod,
      preferredDate: row.preferredDate,
      preferredTime: row.preferredTime,
      description: row.description || '',
      created_at: formatDateTime(row.created_at),
    });
  });

  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}
