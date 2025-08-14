require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const transactionRoutes = require('./routes/transactionRoutes');
const chatRoutes = require('./routes/chatRoutes');


const app = express();
connectDB();

// ✅ Allow cross-origin from your frontend (Vite is usually on port 5174)
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
}));

app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads statically with CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // ✅ important for images
  }
}));


// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(express.json());
app.use('/api/chat', chatRoutes); 
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
