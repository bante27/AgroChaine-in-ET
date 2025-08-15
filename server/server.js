// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();
connectDB();

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(helmet());
app.use(morgan("combined"));
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
