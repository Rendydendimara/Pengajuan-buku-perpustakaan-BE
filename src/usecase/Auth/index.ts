import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_SECRET } from '../../config/jwt';
import Admin from '../../models/admin';
import DosenProdi from '../../models/dosenProdi';
import { createJWTToken } from '../../utils/jwt';

export const loginUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, email, password, nidn } = req.body;
    let user: any = undefined;
    if (type === 'admin') {
      user = await Admin.findOne({
        email: email,
      });
    } else if (type === 'prodi') {
      user = await DosenProdi.findOne({
        nidn: nidn,
      });
    }

    if (!user) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Email atau password salah',
      });
    }

    const validate: boolean = await user.isValidPassword(password);

    if (!validate) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Email atau password salah',
      });
    }

    const token = createJWTToken({
      id: String(user._id),
      type: type,
    });

    user.token = token;
    user.save(); // save after add user token, running on

    return res.send({
      success: true,
      data: user,
      message: 'Success login',
    });
  } catch (e) {
    next(e);
  }
};

export const chekUserLoginUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, type } = req.body;
  let user: any = undefined;

  if (type === 'admin') {
    user = await Admin.findOne({
      token: token,
    });
  } else if (type === 'prodi') {
    user = await DosenProdi.findOne({
      token: token,
    });
  }

  if (!user) {
    return res.status(400).send({
      success: false,
      data: null,
      message: 'Token tidak valid',
    });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    return res.status(200).send({
      success: true,
      data: user,
      message: 'Login success',
    });
  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Token kedaluwarsa',
      });
    }
    next(err);
  }
};

export const logoutUserUseCase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, type } = req.body;
  let user: any = undefined;

  if (type === 'admin') {
    user = await Admin.findById(new mongoose.Types.ObjectId(userId));
  } else if (type === 'prodi') {
    user = await DosenProdi.findById(new mongoose.Types.ObjectId(userId));
  }

  if (user) {
    user.token = '';
    user.save();
    return res.send({
      success: true,
      data: null,
      message: 'Success logout',
    });
  } else {
    return res.status(400).send({
      success: true,
      data: null,
      message: 'Error logout',
    });
  }
};
