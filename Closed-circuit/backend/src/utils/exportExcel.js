import ExcelJS from 'exceljs';
import { resolveEnquiryStatus } from '../constants/enquiryStatus.js';

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export async function buildEnquiriesExcel(contacts) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Enquiries');

  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Full Name', key: 'fullName', width: 24 },
    { header: 'Mobile Number', key: 'mobileNumber', width: 18 },
    { header: 'Email ID', key: 'emailId', width: 28 },
    { header: 'Town/City', key: 'town', width: 20 },
    { header: 'State', key: 'state', width: 18 },
    { header: 'Country', key: 'country', width: 18 },
    { header: 'Looking For', key: 'lookingFor', width: 42 },
    { header: 'Message', key: 'message', width: 40 },
    { header: 'Status', key: 'status', width: 22 },
    { header: 'Created At', key: 'created_at', width: 24 },
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
      message: row.description || '',
      status: resolveEnquiryStatus(row.status),
      created_at: formatDateTime(row.created_at),
    });
  });

  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}
