import express from 'express';
import { asyncErrorHandler } from '../../middleware';
import {
  chekUserLoginUseCase,
  loginUseCase,
  logoutUserUseCase,
} from '../../usecase/Auth';

const authRouter = express.Router();

authRouter.post('/login', asyncErrorHandler(loginUseCase));
authRouter.post('/check-login', asyncErrorHandler(chekUserLoginUseCase));
authRouter.post('/logout', asyncErrorHandler(logoutUserUseCase));

export default authRouter;
