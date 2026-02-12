import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim().replace(/^["']|["']$/g, ''),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim().replace(/^["']|["']$/g, ''),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim().replace(/^["']|["']$/g, ''),
});

// Verify configuration (without exposing secret)
console.log('☁️ Cloudinary Config Status:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'OK (Configured)' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Present (***' + process.env.CLOUDINARY_API_KEY.trim().slice(-4) + ')' : 'MISSING',
    has_secret: !!process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
