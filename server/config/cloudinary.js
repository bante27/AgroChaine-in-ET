import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration (without exposing secret)
console.log('☁️ Cloudinary Configuration Loaded:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? 'Present (***' + process.env.CLOUDINARY_API_KEY.slice(-4) + ')' : 'MISSING',
    has_secret: !!process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
