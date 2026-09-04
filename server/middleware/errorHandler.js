// middleware/errorHandler.js

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  console.error('[CentralError]', err.message);
  res.status(500).json({ success: false, error: 'Server Error' });
};

// ✅ Default export for ES Module
export default errorHandler;
