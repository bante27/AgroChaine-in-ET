import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// ===================== CLOUDINARY CONFIG =====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===================== GENERIC STORAGE MAKER =====================
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

const contactStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let resourceType = "auto"; // auto-detect images, pdfs, etc.

    // Cloudinary needs resource_type = "video" for audio files
    if (file.mimetype.startsWith("audio")) {
      resourceType = "video";
    }

    return {
      folder: "uploads/contact",
      resource_type: resourceType,
      public_id: uniqueSuffix + "-" + file.originalname,
    };
  },
});

export const contactUpload = multer({
  storage: contactStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // ✅ 20MB max per file
    files: 6, // 5 attachments + 1 voice
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
