import PDFDocument from 'pdfkit';

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export function buildEnquiriesPdf(contacts) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Closed Circuit — Contact Enquiries Export', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#555555').text(`Generated: ${formatDateTime(new Date())}`, { align: 'center' });
    doc.moveDown(1.5);
    doc.fillColor('#000000');

    if (!contacts.length) {
      doc.fontSize(12).text('No enquiries found for the selected filters.');
      doc.end();
      return;
    }

    contacts.forEach((row, index) => {
      doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. ${row.fullName}`);
      doc.font('Helvetica').fontSize(10);
      doc.text(`Email: ${row.emailId}`);
      doc.text(`Mobile: ${row.mobileNumber}`);
      doc.text(`Town: ${row.town}`);
      doc.text(`State: ${row.state}`);
      doc.text(`Country: ${row.country}`);
      doc.text(`Looking For: ${row.lookingFor}`);
      doc.text(`Preferred Contact: ${row.preferredContactMethod}`);
      doc.text(`Preferred Date: ${row.preferredDate}`);
      doc.text(`Preferred Time: ${row.preferredTime}`);
      doc.text(`Submitted: ${formatDateTime(row.created_at)}`);
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').text('Description:');
      doc.font('Helvetica').text(row.description || '-', { width: 500 });
      doc.moveDown(1);

      if (doc.y > 700 && index < contacts.length - 1) {
        doc.addPage();
      }
    });

    doc.end();
  });
}
