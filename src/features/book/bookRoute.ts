import { Router } from 'express';
import { createBook, updateBook } from '@/features/book';
import { authenticate, handleBookFiles } from '@/middlewares';

export const bookRouter = Router();

// Routes
bookRouter.post('/', authenticate, handleBookFiles, createBook);
bookRouter.patch('/:bookId', authenticate, handleBookFiles, updateBook);
