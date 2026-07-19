import compression from 'compression';

// ይህ ሚድልዌር ዳታው ከ 10KB በላይ ከሆነ ብቻ እንዲጭምቅ ያደርጋል
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false; // ተጠቃሚው እንዳይጨመቅ ከፈለገ
  }
  return compression.filter(req, res);
};

export const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024, // 10KB
});