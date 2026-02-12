import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Import ES Module versions of all files
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.js";

// === NEW: Import Weather Route ===
import weatherRoutes from "./routes/weather.js";

const app = express();

// Connect to MongoDB (Will be called at the end to start server)


// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5001",
        "http://localhost:3000",
        "http://localhost:5000"
      ];

      const isAllowed = !origin ||
        allowedOrigins.includes(origin) ||
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


app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (fallback for local storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === NEW: Weather Route ===
app.use("/api/weather", weatherRoutes);

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "AgroChain API is running" });
});

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

// Start server with Socket.io support
const PORT = process.env.PORT || 5000;

// Import Socket.io initialization
import { createServer } from 'http';
import { initializeSocket } from './socket/chatSocket.js';

connectDB().then(() => {
  // Create HTTP server (required for Socket.io)
  const httpServer = createServer(app);

  // Initialize Socket.io for real-time chat
  initializeSocket(httpServer);

  // Start listening
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Database connected`);
    console.log(`💬 Real-time chat enabled`);
    console.log(`📡 WebSocket server ready`);
  });
}).catch(err => {
  console.error("❌ Failed to connect to MongoDB. Server not started.", err);
  process.exit(1);
});