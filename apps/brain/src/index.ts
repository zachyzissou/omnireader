import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { ingestQueue, embeddingQueue, enrichmentQueue } from './queues/index.js';
import { setupRoutes } from './routes/index.js';
import { logger } from './utils/logger.js';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Bull Board for queue monitoring
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullMQAdapter(ingestQueue),
    new BullMQAdapter(embeddingQueue),
    new BullMQAdapter(enrichmentQueue),
  ],
  serverAdapter,
});
serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
setupRoutes(app, prisma);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  logger.info(`Brain service running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});