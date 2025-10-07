import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to create Cloudinary storage for a folder
const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `uploads/${folder}`,
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return uniqueSuffix + "-" + file.originalname;
      },
    },
  });

// ===================== SPECIFIC UPLOADS =====================

// Profile Picture (2MB max)
export const profilePicUpload = multer({
  storage: makeStorage("profilePics"),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Product Image (5MB max)
export const productImageUpload = multer({
  storage: makeStorage("productImages"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Government ID (5MB max)
export const govIdUpload = multer({
  storage: makeStorage("govIds"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ===================== CONTACT UPLOADS =====================

// General contact uploads (files + voice)
const contactStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/contact",
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return uniqueSuffix + "-" + file.originalname;
    },
  },
});

export const contactUpload = multer({
  storage: contactStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // ✅ 15MB per file
    files: 6, // max 5 attachments + 1 voice
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "audio/webm",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
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
