import { NextFunction, Request, Response } from 'express';

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.json('route initialized.');
}
