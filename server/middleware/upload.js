const multer = require('multer');
const path = require('path');
const fs = require('fs');

const makeStorage = (folder) => {
  const dir = `uploads/${folder}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
};

const profilePicUpload = multer({ storage: makeStorage('profilePics'), limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit
const productImageUpload = multer({ storage: makeStorage('productImages'), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const govIdUpload = multer({ storage: makeStorage('govIds'), limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { profilePicUpload, productImageUpload, govIdUpload };
