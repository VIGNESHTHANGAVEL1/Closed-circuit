import {
  listPublicDemoVideos,
  listDemoVideos,
  getDemoVideoById,
  createDemoVideo,
  updateDemoVideoById,
  removeDemoVideo,
} from '../services/demoVideo.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getPublicDemoVideos(req, res) {
  try {
    const videos = await listPublicDemoVideos();
    return res.status(200).json(videos);
  } catch (err) {
    console.error('getPublicDemoVideos error:', err);
    return sendError(res, 'Unable to load demo videos.', 500);
  }
}

export async function getDemoVideos(req, res) {
  try {
    const result = await listDemoVideos(req.query);
    return sendSuccess(res, result);
  } catch (err) {
    console.error('getDemoVideos error:', err);
    return sendError(res, 'Unable to load demo videos.', 500);
  }
}

export async function getDemoVideoDetail(req, res) {
  try {
    const video = await getDemoVideoById(req.params.id);
    if (!video) {
      return sendError(res, 'Demo video not found.', 404);
    }
    return sendSuccess(res, { video });
  } catch (err) {
    console.error('getDemoVideoDetail error:', err);
    return sendError(res, 'Unable to load demo video.', 500);
  }
}

export async function uploadDemoVideoHandler(req, res) {
  try {
    const file = req.file;
    const video = await createDemoVideo({ title: req.body?.title }, file);
    return sendSuccess(res, { video }, 201);
  } catch (err) {
    console.error('uploadDemoVideo error:', err);
    if (err.statusCode === 400 || err.statusCode === 503) {
      return sendError(res, err.message, err.statusCode);
    }
    return sendError(res, 'Unable to upload demo video.', 500);
  }
}

export async function updateDemoVideoHandler(req, res) {
  try {
    const video = await updateDemoVideoById(
      req.params.id,
      { title: req.body?.title, display_order: req.body?.display_order },
      req.file
    );
    if (!video) {
      return sendError(res, 'Demo video not found.', 404);
    }
    return sendSuccess(res, { video });
  } catch (err) {
    console.error('updateDemoVideo error:', err);
    if (err.statusCode === 400 || err.statusCode === 503) {
      return sendError(res, err.message, err.statusCode);
    }
    return sendError(res, 'Unable to update demo video.', 500);
  }
}

export async function deleteDemoVideoHandler(req, res) {
  try {
    const removed = await removeDemoVideo(req.params.id);
    if (!removed) {
      return sendError(res, 'Demo video not found.', 404);
    }
    return sendSuccess(res, { message: 'Demo video deleted.' });
  } catch (err) {
    console.error('deleteDemoVideo error:', err);
    return sendError(res, 'Unable to delete demo video.', 500);
  }
}
