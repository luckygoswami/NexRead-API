import { config } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    ...(config.env == 'development' && { errorStack: err.stack }),
  });
};
