import uploadXls from '../../config/multer/xls';
import express from 'express';
import { asyncErrorHandler } from '../../middleware';
import {
  createBukuUseCase,
  deleteBukuUseCase,
  getListBukuUseCase,
  updateBukuUseCase,
  bulkBukuPerpusUseCase,
  getDetailBukuUseCase,
} from '../../usecase/Buku';

const bukuRouter = express.Router();

bukuRouter.post('/create', asyncErrorHandler(createBukuUseCase));
bukuRouter.get('/list', asyncErrorHandler(getListBukuUseCase));
bukuRouter.put('/update', asyncErrorHandler(updateBukuUseCase));
bukuRouter.delete('/delete/:id', asyncErrorHandler(deleteBukuUseCase));
bukuRouter.post(
  '/bulk-buku-perpus',
  uploadXls.single('file'),
  asyncErrorHandler(bulkBukuPerpusUseCase)
);
bukuRouter.post(
  '/bulk-buku-katalog',
  uploadXls.single('file'),
  asyncErrorHandler(bulkBukuPerpusUseCase)
);
bukuRouter.get('/detail/:id', asyncErrorHandler(getDetailBukuUseCase));
export default bukuRouter;
