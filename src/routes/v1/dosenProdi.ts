import express from 'express';
import { asyncErrorHandler } from '../../middleware';
import {
  createDosenProdiUseCase,
  deleteDosenProdiUseCase,
  getListDosenProdiUseCase,
  updateDosenProdiUseCase,
} from '../../usecase/DosenProdi';

const dosenProdiRouter = express.Router();

dosenProdiRouter.post('/create', asyncErrorHandler(createDosenProdiUseCase));
dosenProdiRouter.get('/list', asyncErrorHandler(getListDosenProdiUseCase));
dosenProdiRouter.put('/update', asyncErrorHandler(updateDosenProdiUseCase));
dosenProdiRouter.delete(
  '/delete/:id',
  asyncErrorHandler(deleteDosenProdiUseCase)
);

export default dosenProdiRouter;
