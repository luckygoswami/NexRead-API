import { config } from '@/config';
import multer from 'multer';

const upload = multer({
  dest: config.uploadDir,
  limits: { fileSize: 1e7 },
});

export const handleBookFiles = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);
