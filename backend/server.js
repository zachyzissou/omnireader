import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Runtime plugin loader
const pluginsDir = path.join(__dirname, 'plugins');
fs.readdirSync(pluginsDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const plugin = require(path.join(pluginsDir, file));
    if (plugin && plugin.register) {
      plugin.register(app);
    }
  }
});

// Workflow endpoints
app.post('/api/workflows/music-fetcher', (req, res) => {
  //Proxy to n8n webhook for MusicFetcher
  res.status(200).json({message:'MusicFetcher workflow triggered', data:req.body});
});
app.post('/api/workflows/rss-ingestor', (req, res) => {
  res.status(200).json({message:'RSSIngestor workflow triggered', data:req.body});
});
app.post('/api/workflows/podcast-tracker', (req, res) => {
  res.status(200).json({message:'PodcastTracker workflow triggered', data:req.body});
});
app.post('/api/workflows/youtube-subscriptions', (req, res) => {
  res.status(200).json({message:'YouTubeSubscriptions workflow triggered', data:req.body});
});

// Smart Filters CRUD
let filters = [];
app.get('/api/filters', (req, res) => res.json(filters));
app.post('/api/filters', (req, res) => {
  const filter = {...req.body, id:Date.now()};
  filters.push(filter);
  res.json(filter);
});
app.put('/api/filters/:id', (req, res) => {
  const id = Number(req.params.id);
  filters = filters.map(f => f.id===id?{...f,...req.body}:f);
  res.json(filters.find(f=>f.id===id));
});
app.delete('/api/filters/:id', (req, res) => {
  const id = Number(req.params.id);
  filters = filters.filter(f=>f.id!==id);
  res.json({deleted:id});
});

// Plugin manager endpoint
/**
 * @typedef {Object} PluginInfo
 * @property {string} name
 * @property {string[]} permissions
 */
/** @type {PluginInfo[]} */
let loadedPlugins = [];
app.get('/api/plugins', (req,res)=>res.json(loadedPlugins));

// Load plugin metadata
defaultPlugins();
function defaultPlugins() {
  fs.readdirSync(pluginsDir).forEach((file) => {
    if (file.endsWith('.js')) {
      const meta = require(path.join(pluginsDir, file)).meta;
      if (meta) loadedPlugins.push(meta);
    }
  });
}

// Serve static
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
