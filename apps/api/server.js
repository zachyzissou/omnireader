import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { z } from 'zod';
import { logger } from './src/utils/logger.js';
import { setupRoutes } from './src/routes/index.js';

const app = express();
const port = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Brain service proxy (authenticated requests)
const brainProxy = createProxyMiddleware({
  target: process.env.BRAIN_URL || 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/brain': '/api',
  },
  onError: (err, req, res) => {
    logger.error('Brain proxy error:', err);
    res.status(503).json({ error: 'Brain service unavailable' });
  },
});

app.use('/api/brain', brainProxy);

// API routes (authentication, webhooks, etc.)
setupRoutes(app);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(port, () => {
  logger.info(`API Gateway running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Smart Filters CRUD
app.get('/api/filters', async (req, res) => {
  const filters = await db('filters').select();
  res.json(filters);
});
app.post('/api/filters', async (req, res) => {
  const [filter] = await db('filters').insert(req.body).returning('*');
  res.json(filter);
});
app.put('/api/filters/:id', async (req, res) => {
  const [filter] = await db('filters').where({ id: req.params.id }).update(req.body).returning('*');
  res.json(filter);
});
app.delete('/api/filters/:id', async (req, res) => {
  await db('filters').where({ id: req.params.id }).del();
  res.json({ deleted: Number(req.params.id) });
});

// Serve static
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
