import {
  insertDemoVideo,
  findDemoVideoById,
  findAllDemoVideosPublic,
  findDemoVideos,
  updateDemoVideo,
  deleteDemoVideo,
} from '../models/demoVideo.model.js';
import { uploadDemoVideo, deleteObjectByKey } from './spaces.service.js';

function normalizePage(value) {
  const page = Number(value) || 1;
  return page < 1 ? 1 : page;
}

function normalizeLimit(value) {
  const limit = Number(value) || 10;
  if (limit < 1) return 10;
  if (limit > 100) return 100;
  return limit;
}

export async function listPublicDemoVideos() {
  return findAllDemoVideosPublic();
}

export async function listDemoVideos(query = {}) {
  return findDemoVideos({
    search: query.search || '',
    page: normalizePage(query.page),
    limit: normalizeLimit(query.limit),
  });
}

export async function getDemoVideoById(id) {
  return findDemoVideoById(id);
}

export async function createDemoVideo({ title }, file) {
  if (!title?.trim()) {
    const error = new Error('Video title is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!file) {
    const error = new Error('Video file is required.');
    error.statusCode = 400;
    throw error;
  }

  const upload = await uploadDemoVideo(file);
  const id = await insertDemoVideo({
    title: title.trim(),
    videoUrl: upload.url,
    videoKey: upload.key,
  });

  return findDemoVideoById(id);
}

export async function updateDemoVideoById(id, { title, display_order }, file) {
  const existing = await findDemoVideoById(id);
  if (!existing) {
    return null;
  }

  const updates = {};

  if (title !== undefined) {
    if (!title?.trim()) {
      const error = new Error('Video title is required.');
      error.statusCode = 400;
      throw error;
    }
    updates.title = title.trim();
  }

  if (display_order !== undefined) {
    const order = Number(display_order);
    if (!Number.isInteger(order) || order < 1) {
      const error = new Error('Display order must be a positive integer.');
      error.statusCode = 400;
      throw error;
    }
    updates.display_order = order;
  }

  if (file) {
    const upload = await uploadDemoVideo(file);
    updates.video_url = upload.url;
    updates.video_key = upload.key;

    if (existing.video_key) {
      await deleteObjectByKey(existing.video_key);
    }
  }

  if (Object.keys(updates).length) {
    await updateDemoVideo(id, updates);
  }

  return findDemoVideoById(id);
}

export async function removeDemoVideo(id) {
  const existing = await findDemoVideoById(id);
  if (!existing) {
    return false;
  }

  if (existing.video_key) {
    await deleteObjectByKey(existing.video_key);
  }

  return deleteDemoVideo(id);
}
