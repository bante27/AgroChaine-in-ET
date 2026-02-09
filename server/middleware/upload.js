import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// ===================== CLOUDINARY CONFIG =====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
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

    // 1. Determine Resource Category
    let resourceType = "auto";
    let isDocument = false;

    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    } else if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
      resourceType = "video"; // Audio is handled as 'video' in Cloudinary
    } else if (
      file.mimetype.includes("pdf") ||
      file.mimetype.includes("msword") ||
      file.mimetype.includes("officedocument") ||
      file.mimetype.includes("powerpoint") ||
      file.mimetype.includes("excel") ||
      file.mimetype.includes("text/plain")
    ) {
      resourceType = "raw";
      isDocument = true;
    }

    // 2. Sanitize Filename & Preserve Extension
    const parts = file.originalname.split('.');
    const ext = parts.length > 1 ? parts.pop() : '';
    const nameWithoutExt = parts.join('.');
    const sanitizedName = nameWithoutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // 3. Construct Public ID
    const publicId = `${uniqueSuffix}-${sanitizedName}${ext ? '.' + ext : ''}`;

    const config = {
      folder: "uploads/contact",
      resource_type: resourceType,
      type: 'upload',
      access_mode: 'public',
      public_id: publicId,
    };

    // 4. Only force download for documents to prevent XML extraction issues
    if (isDocument) {
      config.flags = "attachment";
    }

    return config;
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
