import { NextFunction, Request, Response } from 'express';
import PengajuanBuku from '../../models/pengajuanBuku';
import mongoose from 'mongoose';
import Buku from '../../models/buku';
import KatalogBuku from '../../models/katalogBuku';
import createRekapan from '../../utils/createRekapan';
import { IBukuRekapan } from '../../interface';
import moment from 'moment';
import { findIndex } from 'lodash';

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

    // existData.buku = buku;
    // existData.jumlah = jumlah;
    existData.pesanAdmin = pesanAdmin;
    existData.pesanDosen = pesanDosen;
    // existData.status = status;

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
    const { tahun, prodi } = req.query;
    let filterTahun: any = {
      $ne: null
    }

    if (tahun) {
      filterTahun = {
        $gte: new Date(Number(tahun), 0, 31),
        $lt: new Date(Number(tahun), 12, 31),
      }
    }

    const data = await PengajuanBuku.find({ deletedAt: null, createdAt: filterTahun })
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
      if (prodi) {
        if (prodi === dosenProdi.programStudi) {
          dataResult.push({
            _id,
            buku,
            bukuLink,
            dosenProdi,
            createdAt,
            prodi: dt.dosenProdi.programStudi,
          });
        }
      } else {
        dataResult.push({
          _id,
          buku,
          bukuLink,
          dosenProdi,
          createdAt,
          prodi: dt.dosenProdi.programStudi,
        });
      }
    });
    let singleData: IBukuRekapan[] = []
    let pbi: IBukuRekapan[] = []
    let man: IBukuRekapan[] = []
    let ekm: IBukuRekapan[] = []
    let pmt: IBukuRekapan[] = []
    let ptk: IBukuRekapan[] = []
    let agt: IBukuRekapan[] = []
    let agb: IBukuRekapan[] = []
    let thp: IBukuRekapan[] = []
    let hkm: IBukuRekapan[] = []
    let tif: IBukuRekapan[] = []
    if (prodi) {
      singleData = filterData(prodi, dataResult);
    } else {
      pbi = filterData('pbi', dataResult);
      man = filterData('man', dataResult);
      ekm = filterData('ekm', dataResult);
      pmt = filterData('pmt', dataResult);
      ptk = filterData('ptk', dataResult);
      agt = filterData('agt', dataResult);
      agb = filterData('agb', dataResult);
      thp = filterData('thp', dataResult);
      hkm = filterData('hkm', dataResult);
      tif = filterData('tif', dataResult);
    }

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
      singleData,
      invoicePath,
      prodi ? 'single' : 'multiple',
      prodi
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

export const changeStatusItemBukuPengajuanUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, pengajuanId, bukuId } = req.body;
    const data = await PengajuanBuku.findById(new mongoose.Types.ObjectId(pengajuanId));
    if (!data) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Pengajuan buku tidak ditemukan',
      });
    }

    let dataBukuUpdate = data.buku;
    const bukuIdObjectId = new mongoose.Types.ObjectId(bukuId)

    const index = findIndex(dataBukuUpdate, ['_id', bukuIdObjectId]);
    if (index != -1) {
      dataBukuUpdate = [
        ...dataBukuUpdate.slice(0, index),
        {
          ...dataBukuUpdate[index],
          status: status
        },
        ...dataBukuUpdate.slice(index + 1, dataBukuUpdate.length),
      ];
    }

    // console.log('dataBukuUpdate', dataBukuUpdate)
    // data.status = status;
    data.buku = dataBukuUpdate; //[] // pesan;
    await data.save();

    return res.send({
      success: true,
      data: null,
      message: 'Success change status',
    });
  } catch (e) {
    next(e);
  }
};

export const changeAllStatusItemBukuPengajuanUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, pengajuanId } = req.body;
    const data = await PengajuanBuku.findById(new mongoose.Types.ObjectId(pengajuanId));
    if (!data) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Pengajuan buku tidak ditemukan',
      });
    }

    let dataBukuUpdate = data.buku.map((dt) => {
      return {
        ...dt,
        status: status
      }
    });

    data.buku = dataBukuUpdate; //[] // pesan;
    await data.save();

    return res.send({
      success: true,
      data: null,
      message: 'Success change status',
    });
  } catch (e) {
    next(e);
  }
};