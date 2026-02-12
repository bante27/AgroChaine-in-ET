import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../config/cloudinary.js';

// Helper to create Cloudinary storage for a folder
const makeStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `uploads/${folder}`,
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return uniqueSuffix + "-" + file.originalname;
      },
    },
  });
};

// Specific uploads
export const profilePicUpload = multer({
  storage: makeStorage("profilePics"),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const productImageUpload = multer({
  storage: makeStorage("productImages"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const govIdUpload = multer({
  storage: makeStorage("govIds"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// General contact uploads (files + voice)
const contactStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads/contact",
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

export const contactUpload = multer({ storage: contactStorage }).fields([
  { name: "files", maxCount: 5 },
  { name: "voice", maxCount: 1 },
]);