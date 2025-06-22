import express from 'express';
import { loadPlugins } from '../pluginLoader.js';

test('loadPlugins returns plugin metadata', async () => {
  const app = express();
  const plugins = await loadPlugins(app);
  expect(Array.isArray(plugins)).toBe(true);
  expect(plugins.length).toBeGreaterThan(0);
  expect(plugins[0]).toHaveProperty('name');
});
