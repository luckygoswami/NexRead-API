import { Router } from 'express';
import { createUser, loginUser } from '@/features/user';

export const userRouter = Router();

// Routes
userRouter.post('/register', createUser);

userRouter.post('/login', loginUser);
