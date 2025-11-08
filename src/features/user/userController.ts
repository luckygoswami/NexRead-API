import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;

  // Input Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, 'All fields are required.');
    return next(error);
  }

  // DB Validation
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        'User already exists with this email.'
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, 'Error while getting the error.'));
  }

  // Process
  // Response

  res.json('user registered');
}
