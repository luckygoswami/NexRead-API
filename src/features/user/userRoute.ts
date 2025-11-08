import { Router } from 'express';
import { createUser } from '@/features/user';

export const userRouter = Router();

// Routes
userRouter.post('/register', createUser);
