
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agrochain',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
  },
});

const upload = multer({ storage: storage });

export const productImageUpload = upload;
export const contactUpload = upload.none();
export const uploadImages = upload.fields([
    { name: 'govIdFront', maxCount: 1 },
    { name: 'govIdBack', maxCount: 1 },
    { name: 'govIdSelfie', maxCount: 1 }
]);

export default upload;
