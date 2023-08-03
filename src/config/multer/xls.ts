import multer from 'multer';

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype.includes('application/vnd.ms-excel') |
    file.mimetype.includes(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  ) {
    cb(null, true);
  } else {
    cb('Harap unggah file tipe excell', false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString();
    const newFileName = `${timestamp}-${file.originalname
      .split(' ')
      .join('_')}`;
    cb(null, newFileName);
  },
});

const uploadXls = multer({
  storage: storage,
  limits: {
    fileSize: 22099999, //  20.099999 MB
  },
  fileFilter: fileFilter,
});

export default uploadXls;
