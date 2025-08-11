import express from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Validation schemas for different webhook types
const N8nWebhookSchema = z.object({
  sourceId: z.string(),
  items: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.string().url().optional(),
    publishedAt: z.string().datetime(),
    content: z.string().optional(),
    media: z.record(z.any()).optional(),
    raw: z.record(z.any()),
  }))
});

export function createWebhookRoutes() {
  // n8n webhook endpoint - transforms and forwards to Brain
  router.post('/n8n/:sourceId', async (req, res) => {
    try {
      const { sourceId } = req.params;
      const payload = N8nWebhookSchema.parse(req.body);
      
      // Forward to Brain service
      const brainResponse = await fetch(`${process.env.BRAIN_URL}/api/ingest/webhook/${sourceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!brainResponse.ok) {
        throw new Error(`Brain service responded with ${brainResponse.status}`);
      }
      
      const result = await brainResponse.json();
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      
      logger.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  });

  // Generic webhook endpoint for other services
  router.post('/generic/:sourceId', async (req, res) => {
    try {
      const { sourceId } = req.params;
      
      // Transform generic webhook to normalized format
      const normalizedPayload = {
        sourceId,
        items: [
          {
            title: req.body.title || 'Untitled',
            author: req.body.author,
            url: req.body.url,
            publishedAt: req.body.publishedAt || new Date().toISOString(),
            content: req.body.content,
            media: req.body.media,
            raw: req.body,
          }
        ]
      };
      
      // Forward to Brain service
      const brainResponse = await fetch(`${process.env.BRAIN_URL}/api/ingest/webhook/${sourceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedPayload),
      });
      
      if (!brainResponse.ok) {
        throw new Error(`Brain service responded with ${brainResponse.status}`);
      }
      
      const result = await brainResponse.json();
      res.json(result);
    } catch (error) {
      logger.error('Generic webhook processing error:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  });

  return router;
}