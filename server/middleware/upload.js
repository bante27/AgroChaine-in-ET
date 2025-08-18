import multer from "multer";
import path from "path";
import fs from "fs";

// Helper to create storage for a folder
const makeStorage = (folder) => {
  const dir = `uploads/${folder}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
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
const contactStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/contact";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const contactUpload = multer({ storage: contactStorage }).fields([
  { name: "files", maxCount: 5 },
  { name: "voice", maxCount: 1 },
]);
