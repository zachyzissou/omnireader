import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

const SearchRequestSchema = z.object({
  query: z.string(),
  topK: z.number().min(1).max(100).default(20),
  rerank: z.boolean().default(false),
});

export function createSearchRoutes(prisma: PrismaClient): express.Router {
  // Hybrid search endpoint
  router.post('/', async (req, res) => {
    try {
      const { query, topK, rerank } = SearchRequestSchema.parse(req.body);

      // For now, implement basic text search
      // TODO: Implement vector similarity + BM25 hybrid search
      const items = await prisma.item.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ]
        },
        include: {
          source: true,
          annotations: {
            where: {
              kind: { in: ['SUMMARY', 'TAGS'] }
            }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: topK,
      });

      res.json({
        query,
        results: items.map((item: Item & { source: Source, annotations: Annotation[] }) => ({
          ...item,
          score: 1.0, // TODO: Calculate relevance score
        })),
        reranked: rerank,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      logger.error('Error performing search:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Find similar items
  router.get('/similar/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      // Verify item exists
      const item = await prisma.item.findUnique({ where: { id: itemId } });
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      // TODO: Implement vector similarity search
      // For now, find items from same source or with similar titles
      const similarItems = await prisma.item.findMany({
        where: {
          AND: [
            { id: { not: itemId } },
            {
              OR: [
                { sourceId: item.sourceId },
                { title: { contains: item.title.split(' ')[0], mode: 'insensitive' } },
              ]
            }
          ]
        },
        include: {
          source: true,
          annotations: {
            where: { kind: 'TAGS' }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      res.json({
        itemId,
        similar: similarItems.map((item: any) => ({
          ...item,
          similarity: 0.8, // TODO: Calculate actual similarity score
        })),
      });
    } catch (error) {
      logger.error('Error finding similar items:', error);
      res.status(500).json({ error: 'Failed to find similar items' });
    }
  });

  return router;
}