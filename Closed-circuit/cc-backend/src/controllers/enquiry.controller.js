import {
  createEnquiry,
  getEnquiryById,
  listEnquiries,
  exportEnquiries,
  updateEnquiryStatus,
} from '../services/enquiry.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { buildEnquiriesExcel } from '../utils/exportExcel.js';
import { buildEnquiriesPdf } from '../utils/exportPdf.js';

export async function submitEnquiry(req, res) {
  console.log('[contact] received req.body:', req.body);

  try {
    const result = await createEnquiry(req.body);
    console.log('[contact] DB insert success insertId:', result.id);
    return sendSuccess(res, { id: result.id }, 201);
  } catch (err) {
    console.error('[contact] DB insert error:', err);

    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }

    return sendError(res, 'Unable to submit enquiry. Please try again.', 500);
  }
}

// Backward-compatible alias for existing POST /api/contact consumers
export async function submitContact(req, res) {
  return submitEnquiry(req, res);
}

export async function getEnquiries(req, res) {
  try {
    const result = await listEnquiries(req.query);
    return sendSuccess(res, result);
  } catch (err) {
    console.error('getEnquiries error:', err);
    return sendError(res, 'Unable to load enquiries.', 500);
  }
}

export async function patchEnquiryStatus(req, res) {
  try {
    const enquiry = await updateEnquiryStatus(req.params.id, req.validatedStatus);

    if (!enquiry) {
      return sendError(res, 'Enquiry not found.', 404);
    }

    return sendSuccess(res, { enquiry, message: 'Status updated successfully.' });
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    console.error('patchEnquiryStatus error:', err);
    return sendError(res, 'Unable to update enquiry status.', 500);
  }
}

export async function getEnquiryDetail(req, res) {
  try {
    const enquiry = await getEnquiryById(req.params.id);

    if (!enquiry) {
      return sendError(res, 'Enquiry not found.', 404);
    }

    return sendSuccess(res, { enquiry });
  } catch (err) {
    console.error('getEnquiryDetail error:', err);
    return sendError(res, 'Unable to load enquiry.', 500);
  }
}

export async function exportEnquiriesExcel(req, res) {
  try {
    const rows = await exportEnquiries(req.query);
    const buffer = await buildEnquiriesExcel(rows);
    const filename = `enquiries-${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('exportEnquiriesExcel error:', err);
    return sendError(res, 'Unable to export Excel file.', 500);
  }
}

export async function exportEnquiriesPdf(req, res) {
  try {
    const rows = await exportEnquiries(req.query);
    const buffer = await buildEnquiriesPdf(rows);
    const filename = `enquiries-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('exportEnquiriesPdf error:', err);
    return sendError(res, 'Unable to export PDF file.', 500);
  }
}
