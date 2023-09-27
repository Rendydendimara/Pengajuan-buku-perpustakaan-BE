import { NextFunction, Request, Response } from 'express';
import PengajuanBuku from '../../models/pengajuanBuku';
import mongoose from 'mongoose';
import Buku from '../../models/buku';
import KatalogBuku from '../../models/katalogBuku';

export const getStatistikSharedUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query;
    const adminProdi: any = req.query.adminProdi;
    // type = admin, atau list prodi
    if (type === 'admin') {
      const totalBuku = await Buku.countDocuments({ deletedAt: null });
      const totalKatalog = await KatalogBuku.countDocuments({
        deletedAt: null,
      });
      const totalPengajuanBuku = await PengajuanBuku.countDocuments({
        deletedAt: null,
      });
      const totalPengajuanBukuSelesai = await PengajuanBuku.countDocuments({
        status: 'selesai',
      });
      const totalPengajuanBukuGagal = await PengajuanBuku.countDocuments({
        status: 'ditolak',
      });
      const totalPengajuanBukuDalamProses = await PengajuanBuku.countDocuments({
        $or: [{ status: 'diterima' }, { status: 'diproses' }],
      });
      const dataPengajuanBuku = await PengajuanBuku.find({
        deletedAt: null,
      }).select('status createdAt');

      return res.send({
        success: true,
        data: {
          totalBuku,
          totalKatalog,
          totalPengajuanBuku,
          totalPengajuanBukuSelesai,
          totalPengajuanBukuGagal,
          totalPengajuanBukuDalamProses,
          dataPengajuanBuku,
        },
        message: 'Success get list statistik',
      });
    } else {
      const totalBuku = await Buku.countDocuments({
        deletedAt: null,
        prodi: type,
      });
      const totalKatalog = await KatalogBuku.countDocuments({
        deletedAt: null,
      });
      const totalPengajuanBuku = await PengajuanBuku.countDocuments({
        deletedAt: null,
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
      });
      const totalPengajuanBukuSelesai = await PengajuanBuku.countDocuments({
        status: 'selesai',
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
      });
      const totalPengajuanBukuGagal = await PengajuanBuku.countDocuments({
        status: 'ditolak',
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
      });
      const totalPengajuanBukuDalamProses = await PengajuanBuku.countDocuments({
        $or: [{ status: 'diterima' }, { status: 'diproses' }],
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
      });
      const dataPengajuanBuku = await PengajuanBuku.find({
        deletedAt: null,
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
      }).select('status createdAt');

      return res.send({
        success: true,
        data: {
          totalBuku,
          totalKatalog,
          totalPengajuanBuku,
          totalPengajuanBukuSelesai,
          totalPengajuanBukuGagal,
          totalPengajuanBukuDalamProses,
          dataPengajuanBuku,
        },
        message: 'Success get list statistik',
      });
    }
  } catch (e) {
    next(e);
  }
};
