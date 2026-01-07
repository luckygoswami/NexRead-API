import express from 'express';
import { globalErrorHandler } from '@/middlewares';
import { userRouter } from '@/features/user';
import { bookRouter } from '@/features/book';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hellow, NexRead users!' });
});

app.use('/api/users/', userRouter);
app.use('/api/books/', bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
