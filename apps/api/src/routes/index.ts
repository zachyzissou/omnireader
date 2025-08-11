import express from 'express';
import { createWebhookRoutes } from './webhooks.js';
import { createAuthRoutes } from './auth.js';

export function setupRoutes(app: express.Application) {
  // Authentication routes
  app.use('/api/auth', createAuthRoutes());
  
  // Webhook endpoints for external services
  app.use('/api/webhooks', createWebhookRoutes());
  
  // Legacy workflow endpoints (for n8n compatibility)
  app.post('/api/workflows/music-fetcher', (req, res) => {
    res.status(200).json({ message: 'MusicFetcher workflow triggered', data: req.body });
  });
  
  app.post('/api/workflows/rss-ingestor', (req, res) => {
    res.status(200).json({ message: 'RSSIngestor workflow triggered', data: req.body });
  });
  
  app.post('/api/workflows/podcast-tracker', (req, res) => {
    res.status(200).json({ message: 'PodcastTracker workflow triggered', data: req.body });
  });
  
  app.post('/api/workflows/youtube-subscriptions', (req, res) => {
    res.status(200).json({ message: 'YouTubeSubscriptions workflow triggered', data: req.body });
  });
}