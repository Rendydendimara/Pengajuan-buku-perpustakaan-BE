import { Types } from 'mongoose';

export interface IPengajuanBuku {
  _id: Types.ObjectId | Record<string, unknown>;
  buku: Types.ObjectId | Record<string, unknown>;
  dosenProdi: Types.ObjectId | Record<string, unknown>;
  jumlah: number;
  pesanAdmin: string;
  pesanDosen: string;
  status: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
