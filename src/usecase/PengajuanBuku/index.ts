import { NextFunction, Request, Response } from 'express';
import PengajuanBuku from '../../models/pengajuanBuku';
import mongoose from 'mongoose';
import Buku from '../../models/buku';
import KatalogBuku from '../../models/katalogBuku';
import createRekapan from '../../utils/createRekapan';
import { IBukuRekapan } from '../../interface';
import moment from 'moment';

export const createPengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dataBuku, dosenProdi, pesanDosen, bukuLink } = req.body;
    const dataBukuJSONParse = JSON.parse(dataBuku);
    const bukuLinkJSONParse = JSON.parse(bukuLink);
    const createdAt = new Date();
    await PengajuanBuku.create({
      buku: dataBukuJSONParse,
      bukuLink: bukuLinkJSONParse,
      dosenProdi: new mongoose.Types.ObjectId(dosenProdi),
      pesanDosen: pesanDosen,
      createdAt: createdAt,
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
    const data = await PengajuanBuku.find()
      .populate({
        path: 'dosenProdi',
        select: 'namaLengkap programStudi',
      })
      .populate({
        path: 'buku._id',
        select: 'judul prodi katalog',
      });
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
    }).populate({
      path: 'buku._id',
      select: 'judul prodi katalog',
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
    // existData.jumlah = jumlah;
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

export const getDetailPengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await PengajuanBuku.findById(
      new mongoose.Types.ObjectId(id)
    ).populate({
      path: 'buku._id',
      select: 'judul prodi katalog',
      populate: {
        path: 'katalog',
        select: 'name',
      },
    });

    if (data) {
      return res.send({
        success: true,
        data: data,
        message: 'Success get detail pengajuan buku',
      });
    } else {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Pengajuan tidak ditemukan',
      });
    }
  } catch (e) {
    next(e);
  }
};

export const changeStatusPengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, pesan, id } = req.body;
    const data = await PengajuanBuku.findById(new mongoose.Types.ObjectId(id));
    if (!data) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Pengajuan buku tidak ditemukan',
      });
    }
    data.status = status;
    data.pesanAdmin = pesan;
    await data.save();

    return res.send({
      success: true,
      data: null,
      message: 'Success change status pengajuan buku',
    });
  } catch (e) {
    next(e);
  }
};

export const getRekapanPengajuanBukuUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await PengajuanBuku.find({ deletedAt: null })
      .select('buku bukuLink createdAt dosenProdi')
      .populate({
        path: 'buku._id',
        select: 'judul prodi katalog penulis tahunTerbit',
        populate: {
          path: 'katalog',
          select: 'name',
        },
      })
      .populate({
        path: 'dosenProdi',
        select: 'programStudi',
      });

    return res.send({
      success: true,
      data: data,
      message: 'Success get rekapan pengajuan buku',
    });
  } catch (e) {
    next(e);
  }
};

export const cetakRekapanBukuUseCase = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await PengajuanBuku.find({ deletedAt: null })
      .select('buku bukuLink createdAt dosenProdi')
      .populate({
        path: 'buku._id',
        select: 'judul prodi katalog penulis tahunTerbit',
        populate: {
          path: 'katalog',
          select: 'name',
        },
      })
      .populate({
        path: 'dosenProdi',
        select: 'programStudi',
      });

    let dataResult: any = [];

    data.forEach((dt: any) => {
      const { _id, buku, bukuLink, dosenProdi, createdAt } = dt;
      dataResult.push({
        _id,
        buku,
        bukuLink,
        dosenProdi,
        createdAt,
        prodi: dt.dosenProdi.programStudi,
      });
    });

    let pbi: IBukuRekapan[] = filterData('pbi', dataResult);
    let man: IBukuRekapan[] = filterData('man', dataResult);
    let ekm: IBukuRekapan[] = filterData('ekm', dataResult);
    let pmt: IBukuRekapan[] = filterData('pmt', dataResult);
    let ptk: IBukuRekapan[] = filterData('ptk', dataResult);
    let agt: IBukuRekapan[] = filterData('agt', dataResult);
    let agb: IBukuRekapan[] = filterData('agb', dataResult);
    let thp: IBukuRekapan[] = filterData('thp', dataResult);
    let hkm: IBukuRekapan[] = filterData('hkm', dataResult);
    let tif: IBukuRekapan[] = filterData('tif', dataResult);

    const invoicePath = `uploads/${new Date()
      .getTime()
      .toString()}-cetak-rekapan.pdf`;
    createRekapan(
      {
        pbi,
        man,
        ekm,
        pmt,
        ptk,
        agt,
        agb,
        thp,
        hkm,
        tif,
      },
      invoicePath
    );
    await delay(5000);

    return res.download(invoicePath); // Set disposition and send it.
  } catch (err) {
    console.log('err', err);
    next(err);
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const filterData = (
  prodi:
    | 'hkm'
    | 'pbi'
    | 'man'
    | 'ekm'
    | 'pmt'
    | 'ptk'
    | 'agt'
    | 'agb'
    | 'thp'
    | 'tif',
  dataSource: any[]
) => {
  // console.log('dataSource', dataSource);
  let result: IBukuRekapan[] = [];
  dataSource
    .filter((dt: any) => dt.prodi === prodi)
    .map((dt: any) => {
      dt.buku.forEach((buku: any) => {
        if (buku._id) {
          result.push({
            judulBuku: buku._id.judul,
            penulis: buku._id.penulis,
            penerbit: buku._id.katalog.name,
            tahunBuku: buku._id.tahunTerbit,
            diBuat: moment(dt.createdAt).format('L'),
          });
        }
      });
    });
  return result;
};
