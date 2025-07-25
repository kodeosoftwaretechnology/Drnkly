const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

const cartRoutes = require('./routes/cartRoutes');
const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressesRoutes=require('./routes/addressRoutes');
const couponRoutes = require('./routes/couponRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();         // ✅ Load environment variables
connectDB();             // ✅ Connect to MongoDB

const app = express();

// ✅ Parse JSON and URL-encoded bodies BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use OTP Routes
// ✅ Enable CORS before routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://peghouse.in'],
  credentials: true
}));

// ✅ Static file handling
// Static folder for public image access
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads/issues', express.static(path.join(__dirname, 'uploads/issues')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);         // General route (like /api/orders)
app.use('/api/issues', issueRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/coupons', couponRoutes);  // ✅ This enables GET /api/coupons/:code
// ✅ Mount your upload route
app.use('/api/uploads', uploadRoutes);  // <--- This is required

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ API is working on port 5000!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
