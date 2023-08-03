import { NextFunction, Request, Response } from 'express';
import PengajuanBuku from '../../models/pengajuanBuku';
import mongoose from 'mongoose';
import Buku from '../../models/buku';
import KatalogBuku from '../../models/katalogBuku';

export const createPengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { buku, dosenProdi, jumlah, pesanDosen } = req.body;

    await PengajuanBuku.create({
      buku,
      dosenProdi,
      jumlah,
      pesanDosen,
    });

    return res.send({
      success: true,
      data: null,
      message: 'Success create pengajuan buku',
    });
  } catch (e) {
    next(e);
  }
};

export const getListPengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await PengajuanBuku.find();

    return res.send({
      success: true,
      data: data,
      message: 'Success get list pengajuan buku',
    });
  } catch (e) {
    next(e);
  }
};

export const getListPengajuanBukuByDosenUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dosenProdi } = req.params;
    const data = await PengajuanBuku.find({
      dosenProdi: new mongoose.Types.ObjectId(dosenProdi),
    });

    return res.send({
      success: true,
      data: data,
      message: 'Success get list pengajuan buku by dosen prodi',
    });
  } catch (e) {
    next(e);
  }
};
export const updatePengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { buku, jumlah, pesanAdmin, pesanDosen, status, id } = req.body;
    const existData = await PengajuanBuku.findById(
      new mongoose.Types.ObjectId(id)
    );

    if (!existData) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Pengajuan buku tidak ditemukan',
      });
    }

    existData.buku = buku;
    existData.jumlah = jumlah;
    existData.pesanAdmin = pesanAdmin;
    existData.pesanDosen = pesanDosen;
    existData.status = status;

    await existData.save();

    return res.send({
      success: true,
      data: null,
      message: 'Success update pengajuan buku',
    });
  } catch (e) {
    next(e);
  }
};

export const deletePengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await PengajuanBuku.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    return res.send({
      success: true,
      data: null,
      message: 'Success delete pengajuan buku',
    });
  } catch (e) {
    next(e);
  }
};
