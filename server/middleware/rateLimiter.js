import rateLimit from 'express-rate-limit';

// General API Limiter - Now set to 1 minute
export const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 1 Minute window
    max: 11, // Limit each IP to 20 requests per minute
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after a minute."
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

// Strict Login Limiter - 5 attempts per minute
export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minute window
    max: 5, // Only 5 login attempts allowed per minute
    message: {
        success: false,
        message: "Too many login attempts. Please wait 1 minute before trying again."
    },
    standardHeaders: true,
    legacyHeaders: false,
});