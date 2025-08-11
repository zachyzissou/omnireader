import express from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
const router = express.Router();
const FilterCreateSchema = z.object({
    name: z.string().min(1),
    logic: z.record(z.any()), // JSON Logic DSL
    owner: z.string().optional(),
    active: z.boolean().default(true),
});
const FilterUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    logic: z.record(z.any()).optional(),
    active: z.boolean().optional(),
});
export function createFilterRoutes(prisma) {
    // List filters
    router.get('/', async (req, res) => {
        try {
            const owner = req.query.owner;
            const filters = await prisma.filter.findMany({
                where: owner ? { owner } : {},
                orderBy: { name: 'asc' }
            });
            res.json(filters);
        }
        catch (error) {
            logger.error('Error fetching filters:', error);
            res.status(500).json({ error: 'Failed to fetch filters' });
        }
    });
    // Create filter
    router.post('/', async (req, res) => {
        try {
            const data = FilterCreateSchema.parse(req.body);
            const filter = await prisma.filter.create({
                data,
            });
            res.status(201).json(filter);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation error', details: error.errors });
                return;
            }
            logger.error('Error creating filter:', error);
            res.status(500).json({ error: 'Failed to create filter' });
        }
    });
    // Update filter
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = FilterUpdateSchema.parse(req.body);
            const filter = await prisma.filter.update({
                where: { id },
                data,
            });
            res.json(filter);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: 'Validation error', details: error.errors });
                return;
            }
            logger.error('Error updating filter:', error);
            res.status(500).json({ error: 'Failed to update filter' });
        }
    });
    // Delete filter
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.filter.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch (error) {
            logger.error('Error deleting filter:', error);
            res.status(500).json({ error: 'Failed to delete filter' });
        }
    });
    return router;
}
//# sourceMappingURL=filters.js.map