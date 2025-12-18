import { User } from '@/features/user';

export interface Book {
  _id: string;
  title: string;
  description: string;
  uploadedBy: User;
  author: string;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
