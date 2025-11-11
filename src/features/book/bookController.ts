import { NextFunction, Request, Response } from 'express';
import cloudinary from '@/config/cloudinary';
import path from 'node:path';
import createHttpError from 'http-errors';
import { promises } from 'node:fs';
import bookModel from './bookModel';
import { AuthRequest } from '@/middlewares';
import { config } from '@/config';

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, genre } = req.body;
  const {
    coverImage: [coverImage],
    file: [file],
  } = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImagePath = `${config.uploadDir}/${coverImage.filename}`
  const filePath = `${config.uploadDir}/${file.filename}`

  try {
    // Upload - Cover Image
    const coverImageUploadRes = await cloudinary.uploader.upload(
      coverImagePath,
      {
        filename_override: coverImage.filename,
        format: coverImage.mimetype.split('/').at(-1),
        folder: 'book-covers',
      }
    );

    // Upload - Book's pdf
    const fileUploadRes = await cloudinary.uploader.upload(filePath, {
      filename_override: file.filename,
      format: 'pdf',
      folder: 'book-pdfs',
      resource_type: 'raw',
    });

    // Add book to DB
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      description,
      author: _req.userId,
      genre,
      coverImage: coverImageUploadRes.url,
      file: fileUploadRes.url,
    });

    res.status(201).json({ id: newBook._id });
  } catch (err) {
    return next(createHttpError(500, 'Error while uploading the files.'));
  } finally {
    // Remove multer files from server dir
    try {
      await promises.unlink(coverImagePath);
      await promises.unlink(filePath);
    } catch (err) {
      console.error(err);
    }
  }
}
