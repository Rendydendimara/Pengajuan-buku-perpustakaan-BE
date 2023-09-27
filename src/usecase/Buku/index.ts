import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Buku from '../../models/buku';
import config from '../../config';
import xlsx from 'node-xlsx';

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
      tipeBuku: 'byKatalog',
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
    const { type } = req.query;
    const data = await Buku.find({ tipeBuku: type }).populate({
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
    const { uploadDate, prodi } = req.body;
    if (req.file) {
      const workSheetsFromFile = xlsx.parse(`${req.file.path}`);
      const resultImport = await importBulkPerpusToDB(
        workSheetsFromFile,
        uploadDate,
        prodi
      );
      return res.send({
        success: true,
        data: resultImport,
        message: 'Success bulk buku perpus',
      });
    } else {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'File tidak ditemukan',
      });
    }
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
    const { uploadDate, catalogId, prodi } = req.body;
    if (req.file) {
      const workSheetsFromFile = xlsx.parse(`${req.file.path}`);
      const resultImport = await importBulkCatalogToDB(
        workSheetsFromFile,
        uploadDate,
        catalogId,
        prodi
      );
      return res.send({
        success: true,
        data: resultImport,
        message: 'Success bulk buku catalog',
      });
    } else {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'File tidak ditemukan',
      });
    }
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

export const countTypeBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalBukuKatalog = await Buku.countDocuments({
      tipeBuku: 'byKatalog',
    });
    const totalBukuPerpus = await Buku.countDocuments({ tipeBuku: 'byPerpus' });

    return res.send({
      success: true,
      data: {
        totalBukuKatalog,
        totalBukuPerpus,
      },
      message: 'Success delete buku',
    });
  } catch (e) {
    next(e);
  }
};

const importBulkCatalogToDB = (
  excell: any,
  uploadDate: any,
  catalogId: any,
  prodi: any
) =>
  new Promise(async (resolve, reject) => {
    const errorDuplicate: any = [];
    const errorUpload: any = [];
    const successUpload: any = [];
    if (excell) {
      for (let i = 0; i < excell.length; i++) {
        for (let j = 0; j < excell[i].data.length; j++) {
          if (typeof excell[i].data[j][0] === 'number') {
            let dataBuku = {
              judul: excell[i].data[j][1],
              penulis: excell[i].data[j][2],
              katalog: catalogId,
              tahunTerbit: excell[i].data[j][6],
              bahasa: excell[i].data[j][9],
              prodi: prodi,
              harga: excell[i].data[j][3],
              tanggalUpload: uploadDate,
              tipeBuku: 'byKatalog',
            };
            try {
              await Buku.create(dataBuku);
              successUpload.push(dataBuku);
            } catch (err) {
              console.log(err.code);
              if (err.code === 11000) {
                errorDuplicate.push(dataBuku);
              } else {
                errorUpload.push(dataBuku);
              }
            }
          }
        }
      }
    }
    resolve({
      errorDuplicate,
      errorUpload,
      successUpload,
    });
  });

const importBulkPerpusToDB = (excell: any, uploadDate: any, prodi: any) =>
  new Promise(async (resolve, reject) => {
    const errorDuplicate: any = [];
    const errorUpload: any = [];
    const successUpload: any = [];
    if (excell) {
      for (let i = 0; i < excell.length; i++) {
        for (let j = 0; j < excell[i].data.length; j++) {
          if (typeof excell[i].data[j][0] === 'number') {
            let dataBuku = {
              judul: excell[i].data[j][1],
              penulis: excell[i].data[j][2],
              tahunTerbit: excell[i].data[j][6],
              bahasa: excell[i].data[j][9],
              prodi: prodi,
              harga: excell[i].data[j][3],
              tanggalUpload: uploadDate,
              tipeBuku: 'byPerpus',
            };
            try {
              await Buku.create(dataBuku);
              successUpload.push(dataBuku);
            } catch (err) {
              console.log(err.code);
              if (err.code === 11000) {
                errorDuplicate.push(dataBuku);
              } else {
                errorUpload.push(dataBuku);
              }
            }
          }
        }
      }
    }
    resolve({
      errorDuplicate,
      errorUpload,
      successUpload,
    });
  });
