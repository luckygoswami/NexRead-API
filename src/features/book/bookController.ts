import { NextFunction, Request, Response } from 'express';

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.files);
  res.json('route initialized.');
}
