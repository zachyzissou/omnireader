import express from 'express';
import { getFeedSnapshot, getFeedByKey } from '../services/feedService.js';

const VALID_FEEDS = new Set(['music', 'news', 'podcasts', 'videos']);

export function createFeedsRouter() {
  const router = express.Router();

  router.get('/api/feeds', async (req, res, next) => {
    try {
      const snapshot = await getFeedSnapshot();
      res.json(snapshot);
    } catch (error) {
      next(error);
    }
  });

  router.get('/api/feeds/:feedKey', async (req, res, next) => {
    try {
      const { feedKey } = req.params;
      if (!VALID_FEEDS.has(feedKey)) {
        return res.status(404).json({ message: 'Feed not found', requestId: req.id });
      }
      const items = await getFeedByKey(feedKey);
      res.json({ feed: feedKey, items });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
