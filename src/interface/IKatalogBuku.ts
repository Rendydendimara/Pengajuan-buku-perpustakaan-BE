import { Types } from 'mongoose';

export interface IKatalogBuku {
  _id: Types.ObjectId | Record<string, unknown>;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
