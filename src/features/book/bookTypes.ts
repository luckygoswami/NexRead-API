import { User } from '@/features/user';

export interface Book {
  _id: string;
  title: string;
  description: string;
  author: User;
  genre: string;
  converImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
