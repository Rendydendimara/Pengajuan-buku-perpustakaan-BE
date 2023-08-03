import express from 'express';
import { asyncErrorHandler } from '../../middleware';
import {
  createPengajuanBukuUseCase,
  deletePengajuanBukuUseCase,
  getListPengajuanBukuByDosenUseCase,
  getListPengajuanBukuUseCase,
  updatePengajuanBukuUseCase,
} from '../../usecase/PengajuanBuku';

const pengajuanBukuRouter = express.Router();

pengajuanBukuRouter.post(
  '/create',
  asyncErrorHandler(createPengajuanBukuUseCase)
);
pengajuanBukuRouter.get(
  '/list',
  asyncErrorHandler(getListPengajuanBukuUseCase)
);
pengajuanBukuRouter.get(
  '/list-by-dosen/:dosenProdi',
  asyncErrorHandler(getListPengajuanBukuByDosenUseCase)
);
pengajuanBukuRouter.put(
  '/update',
  asyncErrorHandler(updatePengajuanBukuUseCase)
);
pengajuanBukuRouter.delete(
  '/delete/:id',
  asyncErrorHandler(deletePengajuanBukuUseCase)
);

export default pengajuanBukuRouter;
