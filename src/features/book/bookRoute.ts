import { Router } from 'express';
import { createBook } from '@/features/book';

export const bookRouter = Router();

// Routes
bookRouter.post('/', createBook);
