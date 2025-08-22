// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ⏳ 15 minutes (correct value, your old one was way too big)
  max: 100,
  message: { success: false, error: "Too many requests, please try later." },
});

export default limiter;
