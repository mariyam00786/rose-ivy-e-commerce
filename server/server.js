const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();

// Security middleware - Helmet configuration
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP in development for easy loading of Unsplash/Stripe scripts
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration with Credentials support for httpOnly cookies
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://rose-ivy-e-commerce.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Request Logger
app.use(morgan('dev'));

// Cookie Parser
app.use(cookieParser());

// Rate Limiter for Authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { message: 'Too many auth requests from this IP. Please try again after 15 minutes.' }
});

// JSON & URL Body Parsers (Note: Payment routes require raw body parsing for Stripe Webhooks, which is configured inside paymentRoutes.js)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => res.status(200).json({ ok: true, message: 'Server is healthy' }));

// Route Mounts
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Kept for backwards compatibility
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/bespoke-enquiry', require('./routes/bespokeRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/giftcards', require('./routes/giftCardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve Bespoke reference file uploads statically
const uploadsPath = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Production bundle serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Centralized Error Middleware
app.use(require('./middleware/errorMiddleware'));

// Export for Serverless (Vercel)
module.exports = app;

// Start server locally or on traditional hosts
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
