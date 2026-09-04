import compression from "compression";

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false; 
  }
  return compression.filter(req, res);
};

export const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024,
});
