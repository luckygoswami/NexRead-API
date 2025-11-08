import express from 'express';
import { globalErrorHandler } from '@/middlewares';
import { userRouter } from '@/features/user';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello Express world!' });
});

app.use('/api/users/', userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
