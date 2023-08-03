import { Types } from 'mongoose';

export interface IAdmin {
  _id: Types.ObjectId | Record<string, unknown>;
  nidn: string;
  kelamin: 'L' | 'P';
  password: string | null;
  namaLengkap: string | null;
  noTelfon: string | null;
  token: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  isValidPassword: (password: string) => Promise<boolean>;
}
