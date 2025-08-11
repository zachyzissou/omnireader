import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Validation schemas
const ItemsQuerySchema = z.object({
  query: z.string().optional(),
  tags: z.string().optional(),
  sourceId: z.string().optional(),
  after: z.string().datetime().optional(),
  before: z.string().datetime().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

const AnnotationCreateSchema = z.object({
  kind: z.enum(['SUMMARY', 'TAGS', 'TOPICS', 'HIGHLIGHTS', 'NOTE']),
  text: z.string().optional(),
  data: z.record(z.any()).optional(),
  createdBy: z.string().optional(),
});

export function createItemRoutes(prisma: PrismaClient): express.Router {
  // List items with filtering
  router.get('/', async (req, res) => {
    try {
      const query = ItemsQuerySchema.parse(req.query);
      
      const where: any = {};
      
      if (query.sourceId) {
        where.sourceId = query.sourceId;
      }
      
      if (query.after || query.before) {
        where.publishedAt = {};
        if (query.after) where.publishedAt.gte = new Date(query.after);
        if (query.before) where.publishedAt.lte = new Date(query.before);
      }

      // Text search (basic implementation)
      if (query.query) {
        where.OR = [
          { title: { contains: query.query, mode: 'insensitive' } },
          { content: { contains: query.query, mode: 'insensitive' } },
        ];
      }

      const items = await prisma.item.findMany({
        where,
        include: {
          source: true,
          annotations: true,
          _count: {
            select: { embeddings: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: query.limit,
        ...(query.cursor && {
          skip: 1,
          cursor: { id: query.cursor }
        })
      });

      res.json({
        items,
        nextCursor: items.length === query.limit ? items[items.length - 1].id : null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      logger.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  });

  // Get single item
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const item = await prisma.item.findUnique({
        where: { id },
        include: {
          source: true,
          annotations: {
            orderBy: { createdAt: 'desc' }
          },
          embeddings: true
        }
      });

      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      res.json(item);
    } catch (error) {
      logger.error('Error fetching item:', error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  });

  // Add annotation to item
  router.post('/:id/annotate', async (req, res) => {
    try {
      const { id } = req.params;
      const data = AnnotationCreateSchema.parse(req.body);

      // Verify item exists
      const item = await prisma.item.findUnique({ where: { id } });
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      const annotation = await prisma.annotation.create({
        data: {
          itemId: id,
          ...data,
        },
      });

      res.status(201).json(annotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      logger.error('Error creating annotation:', error);
      res.status(500).json({ error: 'Failed to create annotation' });
    }
  });

  return router;
}