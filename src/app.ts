import express from 'express';
import { globalErrorHandler } from '@/middlewares';
import { userRouter } from '@/features/user';
import { bookRouter } from '@/features/book';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello Express world!' });
});

app.use('/api/users/', userRouter);
app.use('/api/books/', bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
