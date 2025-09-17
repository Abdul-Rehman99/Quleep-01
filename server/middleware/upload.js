import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'model/gltf-binary' || 
        file.mimetype === 'model/gltf+json' ||
        file.originalname.endsWith('.glb') ||
        file.originalname.endsWith('.gltf')) {
      cb(null, true);
    } else {
      cb(new Error('Only GLB and GLTF files are allowed'), false);
    }
  },
});

export default upload;