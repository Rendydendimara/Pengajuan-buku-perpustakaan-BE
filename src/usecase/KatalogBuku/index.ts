import { NextFunction, Request, Response } from 'express';
import KatalogBuku from '../../models/katalogBuku';
import mongoose from 'mongoose';
import Buku from '../../models/buku';

export const createKatalogBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    await KatalogBuku.create({ name });
    return res.send({
      success: true,
      data: null,
      message: 'Success create katalog buku',
    });
  } catch (e) {
    next(e);
  }
};

export const getListKatalogBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await KatalogBuku.find();

    return res.send({
      success: true,
      data: data,
      message: 'Success get list katalog buku',
    });
  } catch (e) {
    next(e);
  }
};

export const updateKatalogBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, id } = req.body;
    const existData = await KatalogBuku.findById(
      new mongoose.Types.ObjectId(id)
    );

    if (!existData) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Katalog tidak ditemukan',
      });
    }

    existData.name = name;
    await existData.save();

    return res.send({
      success: true,
      data: null,
      message: 'Success update katalog buku',
    });
  } catch (e) {
    next(e);
  }
};

export const deleteKatalogBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await KatalogBuku.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    await Buku.deleteMany({ katalog: new mongoose.Types.ObjectId(id) });
    return res.send({
      success: true,
      data: null,
      message: 'Success delete katalog buku',
    });
  } catch (e) {
    next(e);
  }
};

export const getDetailKatalogBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existData = await KatalogBuku.findById(
      new mongoose.Types.ObjectId(id)
    );

    if (!existData) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Katalog tidak ditemukan',
      });
    }

    return res.send({
      success: true,
      data: existData,
      message: 'Success get detail katalog',
    });
  } catch (e) {
    next(e);
  }
};
