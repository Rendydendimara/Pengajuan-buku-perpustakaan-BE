import express from 'express';
import { asyncErrorHandler } from '../../middleware';
import {
  changeStatusPengajuanBukuUseCase,
  createPengajuanBukuUseCase,
  deletePengajuanBukuUseCase,
  getDetailPengajuanBukuUseCase,
  getListPengajuanBukuByDosenUseCase,
  getListPengajuanBukuUseCase,
  getRekapanPengajuanBukuUseCase,
  updatePengajuanBukuUseCase,
  cetakRekapanBukuUseCase,
  changeStatusItemBukuPengajuanUseCase,
  changeAllStatusItemBukuPengajuanUseCase,
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
pengajuanBukuRouter.get(
  '/detail/:id',
  asyncErrorHandler(getDetailPengajuanBukuUseCase)
);
pengajuanBukuRouter.post(
  '/change-status',
  asyncErrorHandler(changeStatusPengajuanBukuUseCase)
);
pengajuanBukuRouter.get(
  '/get-rekapan',
  asyncErrorHandler(getRekapanPengajuanBukuUseCase)
);
pengajuanBukuRouter.get(
  '/cetak-rekapan',
  asyncErrorHandler(cetakRekapanBukuUseCase)
);
pengajuanBukuRouter.post(
  '/change-status-item-buku',
  asyncErrorHandler(changeStatusItemBukuPengajuanUseCase)
);
pengajuanBukuRouter.post(
  '/change-all-status-item-buku',
  asyncErrorHandler(changeAllStatusItemBukuPengajuanUseCase)
);



export default pengajuanBukuRouter;

