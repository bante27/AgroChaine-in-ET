import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../config/cloudinary.js';

// ===================== GENERIC STORAGE MAKER =====================
const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `uploads/${folder}`,
      resource_type: "auto",
      // Removed manual public_id to ensure Cloudinary's auto-signing works perfectly
      // and to avoid signature mismatch errors in production.
    },
  });

// ===================== SPECIFIC UPLOADS =====================

// Profile Picture (2MB max)
export const profilePicUpload = multer({
  storage: makeStorage("profilePics"),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Product Image (5MB max)
export const productImageUpload = multer({
  storage: makeStorage("productImages"),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Government ID (5MB max)
export const govIdUpload = multer({
  storage: makeStorage("govIds"),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ===================== CONTACT UPLOADS (FIXED) =====================

// ===================== CONTACT UPLOADS (FIXED) =====================
const contactStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/contact",
    resource_type: "auto",
  }
});


export const contactUpload = multer({
  storage: contactStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max
    files: 6,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/plain",
      "audio/webm",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "application/zip",
      "application/x-zip-compressed",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type: " + file.mimetype), false);
    }
  },
}).fields([
  { name: "files", maxCount: 5 },
  { name: "voice", maxCount: 1 },
]);
