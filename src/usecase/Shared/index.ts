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
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBuku = await PengajuanBuku.countDocuments({
        deletedAt: null,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBukuSelesai = await PengajuanBuku.countDocuments({
        status: 'selesai',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBukuGagal = await PengajuanBuku.countDocuments({
        status: 'ditolak',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBukuDalamProses = await PengajuanBuku.countDocuments({
        $or: [{ status: 'diterima' }, { status: 'diproses' }],
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const dataPengajuanBuku = await PengajuanBuku.find({
        deletedAt: null,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
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
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalKatalog = await KatalogBuku.countDocuments({
        deletedAt: null,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBuku = await PengajuanBuku.countDocuments({
        deletedAt: null,
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBukuSelesai = await PengajuanBuku.countDocuments({
        status: 'selesai',
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBukuGagal = await PengajuanBuku.countDocuments({
        status: 'ditolak',
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const totalPengajuanBukuDalamProses = await PengajuanBuku.countDocuments({
        $or: [{ status: 'diterima' }, { status: 'diproses' }],
        dosenProdi: new mongoose.Types.ObjectId(adminProdi),
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
      });
      const dataPengajuanBuku = await PengajuanBuku.find({
        deletedAt: null,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), 0, 31),
          $lt: new Date(new Date().getFullYear(), 12, 31),
        },
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
