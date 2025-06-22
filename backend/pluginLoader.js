import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerHook } from './pluginHooks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadPlugins(app) {
  const pluginsDir = path.join(__dirname, 'plugins');
  const loaded = [];
  for (const file of fs.readdirSync(pluginsDir)) {
    if (file.endsWith('.js')) {
      const mod = await import(path.join(pluginsDir, file));
      const plugin = mod.default || mod;
      if (plugin && typeof plugin.register === 'function') {
        plugin.register(app);
        if (plugin.hooks) {
          Object.entries(plugin.hooks).forEach(([type, fn]) => registerHook(type, fn));
        }
        loaded.push(plugin.meta || { name: file.replace('.js', '') });
      }
    }
  }
  return loaded;
}
