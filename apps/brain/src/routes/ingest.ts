import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { ingestQueue } from '../queues/index.js';

const router = express.Router();

const IngestItemSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  publishedAt: z.string().datetime(),
  content: z.string().optional(),
  media: z.record(z.any()).optional(),
  raw: z.record(z.any()),
});

const IngestWebhookSchema = z.object({
  items: z.array(IngestItemSchema),
});

export function createIngestRoutes(prisma: PrismaClient): express.Router {
  // Webhook endpoint for n8n and other systems to push normalized items
  router.post('/webhook/:sourceId', async (req, res) => {
    try {
      const { sourceId } = req.params;
      const { items } = IngestWebhookSchema.parse(req.body);

      // Verify source exists
      const source = await prisma.source.findUnique({ where: { id: sourceId } });
      if (!source) {
        res.status(404).json({ error: 'Source not found' });
        return;
      }

      // Queue ingestion job
      await ingestQueue.add('process-items', {
        sourceId,
        items,
      });

      res.status(202).json({
        message: 'Items queued for ingestion',
        sourceId,
        itemCount: items.length,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      logger.error('Error processing ingest webhook:', error);
      res.status(500).json({ error: 'Failed to process ingestion' });
    }
  });

  return router;
}