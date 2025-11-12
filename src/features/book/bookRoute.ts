import { Router } from 'express';
import {
  createBook,
  updateBook,
  getBook,
  listBooks,
  deleteBook,
} from '@/features/book';
import { authenticate, handleBookFiles } from '@/middlewares';

export const bookRouter = Router();

// Routes
bookRouter.post('/', authenticate, handleBookFiles, createBook);
bookRouter.patch('/:bookId', authenticate, handleBookFiles, updateBook);
bookRouter.get('/:bookId', getBook);
bookRouter.get('/', listBooks);
bookRouter.delete('/:bookId', authenticate, deleteBook);
