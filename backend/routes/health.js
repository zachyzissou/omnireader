import express from 'express';

export function createHealthRouter({ db, plugins }) {
  const router = express.Router();

  router.get('/healthz', async (_req, res) => {
    try {
      await db.select(db.raw('1'));
    } catch (error) {
      return res.status(503).json({ status: 'unhealthy', reason: 'database unreachable' });
    }

    res.json({
      status: 'ok',
      plugins: plugins.map((plugin) => plugin.name),
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
