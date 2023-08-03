import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { hashingPassword } from '../../service/password';
import DosenProdi from '../../models/dosenProdi';

export const createDosenProdiUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nidn, kelamin, password, namaLengkap, noTelfon, programStudi } =
      req.body;
    const dataExist = await DosenProdi.findOne({ nidn: nidn });

    if (!dataExist) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Nomor NIDN sudah digunakan',
      });
    }
    const hashPass: any = await hashingPassword(password);
    await DosenProdi.create({
      nidn,
      kelamin,
      password: hashPass,
      namaLengkap,
      noTelfon,
      programStudi,
    });

    return res.send({
      success: true,
      data: null,
      message: 'Success create dosen prodi',
    });
  } catch (e) {
    next(e);
  }
};

export const getListDosenProdiUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await DosenProdi.find();

    return res.send({
      success: true,
      data: data,
      message: 'Success get list dosen prodi',
    });
  } catch (e) {
    next(e);
  }
};

export const updateDosenProdiUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nidn, kelamin, password, namaLengkap, noTelfon, programStudi, id } =
      req.body;
    const existData = await DosenProdi.findById(
      new mongoose.Types.ObjectId(id)
    );

    if (!existData) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Dosen prodi tidak ditemukan',
      });
    }

    const dataNidnExist = await DosenProdi.findOne({ nidn: nidn });

    if (!dataNidnExist) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Nomor NIDN sudah digunakan',
      });
    }

    existData.nidn = nidn;
    existData.kelamin = kelamin;
    // existData.password = password;
    existData.namaLengkap = namaLengkap;
    existData.noTelfon = noTelfon;
    existData.programStudi = programStudi;

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

export const deleteDosenProdiUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await DosenProdi.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    return res.send({
      success: true,
      data: null,
      message: 'Success delete dosen prodi',
    });
  } catch (e) {
    next(e);
  }
};
