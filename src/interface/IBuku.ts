import { Types } from 'mongoose';

export interface IBuku {
  _id: Types.ObjectId | Record<string, unknown>;
  judul: string;
  penulis: string;
  katalog: Types.ObjectId | Record<string, unknown>;
  tahunTerbit: string;
  bahasa: string;
  prodi: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
