import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Buku from '../../models/buku';

export const createBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { judul, penulis, katalog, tahunTerbit, bahasa, prodi } = req.body;
    const dataExist = await Buku.findOne({ judul: judul });

    if (dataExist) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Judul buku sudah ada didatabase',
      });
    }

    await Buku.create({
      judul,
      penulis,
      katalog,
      tahunTerbit,
      bahasa,
      prodi,
    });

    return res.send({
      success: true,
      data: null,
      message: 'Success create buku',
    });
  } catch (e) {
    next(e);
  }
};

export const getListBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Buku.find().populate({
      path: 'katalog',
      select: 'name',
    });

    return res.send({
      success: true,
      data: data,
      message: 'Success get list buku',
    });
  } catch (e) {
    next(e);
  }
};

export const updateBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { judul, penulis, katalog, tahunTerbit, bahasa, prodi, id } =
      req.body;
    const existData = await Buku.findById(new mongoose.Types.ObjectId(id));

    if (!existData) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Buku tidak ditemukan',
      });
    }

    existData.judul = judul;
    existData.penulis = penulis;
    existData.katalog = katalog;
    existData.tahunTerbit = tahunTerbit;
    existData.bahasa = bahasa;
    existData.prodi = prodi;

    await existData.save();

    return res.send({
      success: true,
      data: null,
      message: 'Success update buku',
    });
  } catch (e) {
    next(e);
  }
};

export const deleteBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Buku.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    return res.send({
      success: true,
      data: null,
      message: 'Success delete buku',
    });
  } catch (e) {
    next(e);
  }
};

export const bulkBukuPerpusUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.send({
      success: true,
      data: null,
      message: 'Success bulk buku perpus',
    });
  } catch (e) {
    next(e);
  }
};

export const bulkBukuKatalogUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.send({
      success: true,
      data: null,
      message: 'Success bulk buku katalog',
    });
  } catch (e) {
    next(e);
  }
};

export const getDetailBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existData = await Buku.findById(new mongoose.Types.ObjectId(id));

    if (!existData) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Buku tidak ditemukan',
      });
    }

    return res.send({
      success: true,
      data: existData,
      message: 'Success get detail buku',
    });
  } catch (e) {
    next(e);
  }
};
