import ExcelJS from 'exceljs';

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export async function buildEnquiriesExcel(enquiries) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Enquiries');

  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Message', key: 'message', width: 50 },
    { header: 'Source Page', key: 'source_page', width: 18 },
    { header: 'Submitted Date & Time', key: 'created_at', width: 24 },
  ];

  enquiries.forEach((row, index) => {
    sheet.addRow({
      sno: index + 1,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      source_page: row.source_page || '',
      created_at: formatDateTime(row.created_at),
    });
  });

  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}
