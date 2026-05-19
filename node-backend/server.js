const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/auth', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./src/routes/auth');
const notificationRoutes = require('./src/routes/notifications');
const chatRoutes = require('./src/routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Extract user from token for proxy
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Ignore token errors here, Laravel will reject if auth is required
    }
  }
  next();
});

// Proxy to Laravel API for business logic
const laravelProxy = createProxyMiddleware({
  target: process.env.LARAVEL_API_URL,
  changeOrigin: true,
  pathFilter: [
    '/api/listings', 
    '/api/bookings', 
    '/api/reviews', 
    '/api/payments', 
    '/api/admin', 
    '/api/fraud'
  ],
  on: {
    proxyReq: (proxyReq, req) => {
      // Forward the auth header to Laravel
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
      // Forward user info from JWT middleware
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Email', req.user.email);
        proxyReq.setHeader('X-User-Role', req.user.role);
      }
    },
  },
});

app.use(laravelProxy);

// Socket.io handlers
const { setupSocketHandlers } = require('./src/sockets/handlers');
setupSocketHandlers(io);

// Make io accessible to routes
app.set('io', io);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'node-gateway', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Node.js Gateway running on port ${PORT}`);
});
