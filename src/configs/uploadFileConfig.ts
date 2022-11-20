import multer from 'multer';

/* A middleware that is used to upload files. */
export const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5, // limit 5MB
  },
  /* Checking the file type. */
  fileFilter(_, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|JPG|PNG)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true); // call back function to check any error
  },
});

