import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { loadPlugins } from './pluginLoader.js';
import { suggest } from './ai/suggestions.js';
import db from './db.js';
import { profileMiddleware } from './profiling.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.json());

if (process.env.PROFILING === 'true') {
  app.use(profileMiddleware);
}

// Load plugins
const loadedPlugins = await loadPlugins(app);
app.get('/api/plugins', (req, res) => res.json(loadedPlugins));

// Workflow endpoints
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

// AI suggestions endpoint
app.post('/api/suggestions', (req, res) => {
  const suggestions = suggest(req.body.items || []);
  res.json({ suggestions });
});

// Smart Filters CRUD
app.get('/api/filters', async (req, res) => {
  const filters = await db('filters').select();
  res.json(filters);
});
app.post('/api/filters', async (req, res) => {
  const [filter] = await db('filters').insert(req.body).returning('*');
  res.json(filter);
});
app.put('/api/filters/:id', async (req, res) => {
  const [filter] = await db('filters').where({ id: req.params.id }).update(req.body).returning('*');
  res.json(filter);
});
app.delete('/api/filters/:id', async (req, res) => {
  await db('filters').where({ id: req.params.id }).del();
  res.json({ deleted: Number(req.params.id) });
});

// Serve static
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
