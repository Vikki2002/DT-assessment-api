import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storageConfig = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
      cb(null, `${uuidv4()}-${file.originalname}`)
    }
  });

export const upload = multer({storageConfig}).single('files[image]');
