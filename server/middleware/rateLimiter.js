const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 100000000000000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, please try later.' },
});

module.exports = limiter;
