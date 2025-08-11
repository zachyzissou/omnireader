import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Validation schemas
const SourceCreateSchema = z.object({
  type: z.enum(['RSS', 'YOUTUBE', 'PODCAST', 'CUSTOM', 'N8N']),
  url: z.string().url().optional(),
  config: z.record(z.any()).optional(),
});

const SourceUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED', 'ERROR']).optional(),
  config: z.record(z.any()).optional(),
});

export function createSourceRoutes(prisma: PrismaClient): express.Router {
  // List sources
  router.get('/', async (req, res) => {
    try {
      const sources = await prisma.source.findMany({
        include: {
          _count: {
            select: { items: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(sources);
    } catch (error) {
      logger.error('Error fetching sources:', error);
      res.status(500).json({ error: 'Failed to fetch sources' });
    }
  });

  // Create source
  router.post('/', async (req, res) => {
    try {
      const data = SourceCreateSchema.parse(req.body);
      const source = await prisma.source.create({
        data,
      });
      res.status(201).json(source);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      logger.error('Error creating source:', error);
      res.status(500).json({ error: 'Failed to create source' });
    }
  });

  // Update source
  router.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = SourceUpdateSchema.parse(req.body);
      
      const source = await prisma.source.update({
        where: { id },
        data,
      });
      res.json(source);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      logger.error('Error updating source:', error);
      res.status(500).json({ error: 'Failed to update source' });
    }
  });

  // Delete source
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.source.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting source:', error);
      res.status(500).json({ error: 'Failed to delete source' });
    }
  });

  // Trigger source refresh
  router.post('/:id/refresh', async (req, res) => {
    try {
      const { id } = req.params;
      // TODO: Queue refresh job
      res.json({ message: 'Refresh queued', sourceId: id });
    } catch (error) {
      logger.error('Error queuing refresh:', error);
      res.status(500).json({ error: 'Failed to queue refresh' });
    }
  });

  return router;
}