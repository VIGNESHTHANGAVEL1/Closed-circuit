import multer from 'multer';
import { config } from '../config/env.js';

const storage = multer.memoryStorage();

export const clientImageUpload = multer({
  storage,
  limits: {
    fileSize: config.spaces.maxImageBytes,
    files: 2,
  },
}).fields([
  { name: 'client_logo', maxCount: 1 },
  { name: 'client_profile_pic', maxCount: 1 },
]);

export const demoVideoUpload = multer({
  storage,
  limits: {
    fileSize: config.spaces.maxVideoBytes,
    files: 1,
  },
}).single('video_file');
