import express from 'express';
import { getStatistikSharedUseCase } from '../../usecase/Shared';
import { asyncErrorHandler } from '../../middleware';

const sharedRouter = express.Router();

sharedRouter.get(
  '/get-statistik',
  asyncErrorHandler(getStatistikSharedUseCase)
);

export default sharedRouter;
