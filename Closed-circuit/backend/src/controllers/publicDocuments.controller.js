import { listBrochureFiles, listCertificateFiles } from '../services/spaces.service.js';

export async function getBrochures(req, res) {
  try {
    const files = await listBrochureFiles();
    return res.status(200).json(files);
  } catch (err) {
    console.error('[publicDocuments] getBrochures error:', err.message);
    return res.status(500).json({ message: 'Unable to load brochures.' });
  }
}

export async function getCertificates(req, res) {
  try {
    const files = await listCertificateFiles();
    return res.status(200).json(files);
  } catch (err) {
    console.error('[publicDocuments] getCertificates error:', err.message);
    return res.status(500).json({ message: 'Unable to load certificates.' });
  }
}
