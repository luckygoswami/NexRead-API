import { config } from '@/config';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { verify } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId: string;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    return next(createHttpError(401, 'Authorization token is required.'));
  }

  try {
    const userId = verify(authToken, config.jwtSecret).sub;
    const _req = req as AuthRequest;
    _req.userId = userId as string;
    next();
  } catch (err) {
    return next(createHttpError(401, 'Auth token expired.'));
  }
}
