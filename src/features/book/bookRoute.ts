import { Router } from 'express';
import { createBook } from '@/features/book';
import multer from 'multer';
import path from 'node:path';

export const bookRouter = Router();

const upload = multer({
  dest: path.resolve(__dirname, '../../../public/data/uploads'),
  limits: { fileSize: 3e7 },
});

// Routes
bookRouter.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  createBook
);
