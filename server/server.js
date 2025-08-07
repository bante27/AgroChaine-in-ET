// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Use mongoose directly instead of a wrapper function
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// --- Database Connection Function ---
// Let's use a simpler, more direct approach for connecting.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected to agrochain_ethiopia');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5174', // Specific origin for frontend
    credentials: true, // Allow cookies if needed
}));

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// --- Import Middleware and Routes ---
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');

// --- Routes ---
// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', productRoutes);

// Protected routes (require a valid token)
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/products', authMiddleware, productRoutes);
// You can add more protected routes as needed, e.g.,
// app.use('/api/orders', authMiddleware, orderRoutes);

// --- Start Server Function ---
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();