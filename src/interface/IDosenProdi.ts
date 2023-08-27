import { Types } from 'mongoose';

export interface IDosenProdi {
  _id: Types.ObjectId | Record<string, unknown>;
  nidn: string;
  kelamin: 'L' | 'P';
  password: string | null;
  namaLengkap: string | null;
  noTelfon: string | null;
  email: string | null;
  programStudi: string;
  token: string | null;
  createdAt: Date;
  isSuspend: boolean;
  deletedAt: Date | null;
  updatedAt: Date | null;
  isValidPassword: (password: string) => Promise<boolean>;
}
