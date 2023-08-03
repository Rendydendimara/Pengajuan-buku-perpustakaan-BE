import express from 'express';
import authRouter from './auth';
import bukuRouter from './buku';
import dosenProdiRouter from './dosenProdi';
import katalogBukuRouter from './katalogBuku';
import pengajuanBukuRouter from './pengajuanBuku';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/katalog-buku', katalogBukuRouter);
router.use('/buku', bukuRouter);
router.use('/dosen-prodi', dosenProdiRouter);
router.use('/pengajuan-buku', pengajuanBukuRouter);

export default router;
