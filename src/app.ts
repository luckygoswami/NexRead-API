import express from 'express';
import { globalErrorHandler } from '@/middlewares';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello Express world!' });
});

app.use(globalErrorHandler);

export default app;
