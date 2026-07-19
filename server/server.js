import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from 'http';

// Database & Socket imports
import connectDB from "./config/db.js";
import { initializeSocket } from './socket/chatSocket.js';

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"; // Path fixed to /routes
import adminRoutes from './routes/adminRoutes.js';
import weatherRoutes from "./routes/weather.js";
import notificationRoutes from "./routes/notificationRoutes.js";
// Middleware Imports
import errorHandler from "./middleware/errorHandler.js";
import { compressionMiddleware } from "./middleware/compressionMiddleware.js";

const app = express();

// 1. Initial Middleware
app.use(compressionMiddleware);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
        "http://localhost:5001", "http://localhost:3000", "http://localhost:5000"
      ];
      const isAllowed = !origin || allowedOrigins.includes(origin) || 
                        origin.includes(".onrender.com") || 
                        origin.includes(".netlify.app") || 
                        origin.includes(".vercel.app");
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 3. Security & Parsing
app.use(helmet({ crossOriginResourcePolicy: false })); // Fixed for Cloudinary
app.use(morgan("combined"));
app.use(express.json({ limit: '10mb' })); // Increased limit for uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. API Routes
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "AgroChain API is running" });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
// 6. Error Handling
app.use(errorHandler);

// 7. Server Initialization
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const httpServer = createServer(app);
  initializeSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Database connected`);
    console.log(`💬 Real-time chat enabled`);
  });
}).catch(err => {
  console.error("❌ Failed to connect to MongoDB.", err.message);
  process.exit(1);
});