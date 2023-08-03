import express from 'express';
import { asyncErrorHandler } from '../../middleware';
import {
  createKatalogBukuUseCase,
  deleteKatalogBukuUseCase,
  getListKatalogBukuUseCase,
  updateKatalogBukuUseCase,
} from '../../usecase/KatalogBuku';

const katalogBukuRouter = express.Router();

katalogBukuRouter.post('/create', asyncErrorHandler(createKatalogBukuUseCase));
katalogBukuRouter.get('/list', asyncErrorHandler(getListKatalogBukuUseCase));
katalogBukuRouter.put('/update', asyncErrorHandler(updateKatalogBukuUseCase));
katalogBukuRouter.delete(
  '/delete/:id',
  asyncErrorHandler(deleteKatalogBukuUseCase)
);

export default katalogBukuRouter;
