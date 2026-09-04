import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim().replace(/^["']|["']$/g, ''),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim().replace(/^["']|["']$/g, ''),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim().replace(/^["']|["']$/g, ''),
});

// Verify configuration (without exposing secret)
const maskedSecret = process.env.CLOUDINARY_API_SECRET
    ? `***${process.env.CLOUDINARY_API_SECRET.trim().slice(-3)}`
    : 'MISSING';

console.log('☁️ Cloudinary Config Status:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'OK' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? `Present (***${process.env.CLOUDINARY_API_KEY.trim().slice(-4)})` : 'MISSING',
    api_secret: maskedSecret
});

export default cloudinary;
