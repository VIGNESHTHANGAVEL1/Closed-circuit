import ExcelJS from 'exceljs';
import { resolveEnquiryStatus } from '../constants/enquiryStatus.js';
import { formatContactSummary } from '../services/enquiry.service.js';

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
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Message/Description', key: 'message', width: 50 },
    { header: 'Status', key: 'status', width: 22 },
    { header: 'Submitted Date & Time', key: 'created_at', width: 24 },
  ];

  contacts.forEach((row, index) => {
    sheet.addRow({
      sno: index + 1,
      name: row.fullName,
      email: row.emailId,
      phone: row.mobileNumber,
      message: formatContactSummary(row),
      status: resolveEnquiryStatus(row.status),
      created_at: formatDateTime(row.created_at),
    });
  });

  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}
