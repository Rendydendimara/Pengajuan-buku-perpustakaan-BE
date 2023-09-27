import { Types } from 'mongoose';

interface IBuku {
  _id: Types.ObjectId | Record<string, unknown>;
  jumlah: number;
}
interface IBukuLink {
  _id: Types.ObjectId | Record<string, unknown>;
  jumlah: number;
  linkBuku: string | null;
}

export interface IPengajuanBuku {
  _id: Types.ObjectId | Record<string, unknown>;
  buku: IBuku[];
  dosenProdi: Types.ObjectId | Record<string, unknown>;
  pesanAdmin: string;
  pesanDosen: string;
  status: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  bukuLink: IBukuLink[];
}
