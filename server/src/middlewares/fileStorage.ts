import multer from 'multer';

const fileStorageEngine = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, './uploads/avatars')
  },
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}--${file.originalname}`)
  }
})

const upload = multer({storage: fileStorageEngine});

export default upload;