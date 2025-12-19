import { NextFunction, raw, Request, Response } from 'express';
import cloudinary from '@/config/cloudinary';
import createHttpError from 'http-errors';
import { promises } from 'node:fs';
import bookModel from './bookModel';
import { AuthRequest } from '@/middlewares';
import { config } from '@/config';
import { verify } from 'jsonwebtoken';

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, genre, author } = req.body;
  const {
    coverImage: [coverImage],
    file: [file],
  } = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImagePath = `${config.uploadDir}/${coverImage.filename}`;
  const filePath = `${config.uploadDir}/${file.filename}`;

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
      author,
      uploadedBy: _req.userId,
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

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { bookId } = req.params;
  try {
    // Validate book and author
    const book = await bookModel.findOne({ _id: bookId });
    if (!book)
      return next(createHttpError(404, 'No book found with the given Id.'));

    // Validate authorization
    const _req = req as AuthRequest;
    if (_req.userId != book.author.toString())
      return next(createHttpError(403, 'Not authorised to update this book.'));

    // Upload files to cloudinary
    const reqFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const coverImage = reqFiles?.coverImage?.[0];
    const file = reqFiles?.file?.[0];
    let coverImageUploadRes;
    let fileUploadRes;

    if (coverImage) {
      const coverImagePath = `${config.uploadDir}/${coverImage.filename}`;
      coverImageUploadRes = await cloudinary.uploader.upload(coverImagePath, {
        filename_override: coverImage.filename,
        format: coverImage.mimetype.split('/').at(-1),
        folder: 'book-covers',
      });

      // Delete old cover-image from server dir
      await promises.unlink(coverImagePath);

      // Delete old cover-image from cloudinary
      const [imageName] = book.coverImage
        .split('/')
        .at(-1)
        ?.split('.') as string[];

      await cloudinary.uploader.destroy(`book-covers/${imageName}`);
    }

    if (file) {
      const filePath = `${config.uploadDir}/${file.filename}`;
      fileUploadRes = await cloudinary.uploader.upload(filePath, {
        filename_override: file.filename,
        format: 'pdf',
        folder: 'book-pdfs',
        resource_type: 'raw',
      });

      // Delete old book-pdf from server dir
      await promises.unlink(filePath);

      // Delete old book-pdf from cloudinary
      const fileName = book.file.split('/').at(-1) as string;
      await cloudinary.uploader.destroy(`book-pdfs/${fileName}`, {
        resource_type: 'raw',
      });
    }

    // Update data in DB
    const updates = {
      title: req.body.title ?? book.title,
      description: req.body.description ?? book.description,
      genre: req.body.genre ?? book.genre,
      coverImage: coverImageUploadRes?.url ?? book.coverImage,
      file: fileUploadRes?.url ?? book.file,
    };
    await bookModel.updateOne({ _id: bookId }, updates);

    return res.sendStatus(204);
  } catch (err) {
    return next(createHttpError(500, 'Error while updating the Book.'));
  }
}

export async function getBook(req: Request, res: Response, next: NextFunction) {
  const { bookId } = req.params;

  try {
    const book = await bookModel
      .find({ _id: bookId })
      .populate('uploadedBy', 'name');

    if (!book) return next(createHttpError(404, 'Book not found.'));

    res.json(book);
  } catch (err) {
    return next(createHttpError(500, 'Error while getting a book.'));
  }
}

export async function listBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.query;
  const authToken = req.headers.authorization?.split(' ')[1];
  let userId;

  try {
    let query: Partial<Record<'title', any>> = {};
    if (title) query.title = { $regex: title, $options: 'i' };

    if (authToken) {
      userId = verify(authToken, config.jwtSecret).sub;

      const books = await bookModel
        .find({ ...query, uploadedBy: userId })
        .populate('uploadedBy', 'name');

      return res.json(books);
    }

    const books = await bookModel.find(query).populate('uploadedBy', 'name');
    res.json(books);
  } catch (err) {
    return next(createHttpError(500, 'Error while getting books.'));
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { bookId } = req.params;
  const _req = req as AuthRequest;

  try {
    const book = await bookModel.findOne({ _id: bookId });

    // Validate authorization
    if (!book) return next(createHttpError(404, 'Book not found.'));
    if (book.author.toString() != _req.userId)
      return next(
        createHttpError(403, 'You are not authorised to delete this book.')
      );

    // Delete book files from DB
    await bookModel.deleteOne({ _id: bookId });

    // Delete book files from cloudinary
    const imageId = `book-covers/${
      book.coverImage.split('/').at(-1)?.split('.')[0]
    }`;
    const pdfId = `book-pdfs/${book.file.split('/').at(-1)}`;
    await cloudinary.uploader.destroy(imageId);
    await cloudinary.uploader.destroy(pdfId, { resource_type: 'raw' });

    res.sendStatus(204);
  } catch (err) {
    return next(createHttpError(500, 'Error while deleting a book.'));
  }
}
