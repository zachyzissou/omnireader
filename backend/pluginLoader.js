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
      const pluginPath = path.join(pluginsDir, file);
      try {
        const mod = await import(pluginPath);
        const plugin = mod.default || mod;
        if (!plugin || typeof plugin.register !== 'function') {
          console.warn(`Skipping plugin ${file}: missing register(app)`);
          continue;
        }

        try {
          await plugin.register(app);
        } catch (err) {
          console.error(`Plugin ${file} failed to register`, err);
          continue;
        }

        if (plugin.hooks && typeof plugin.hooks === 'object') {
          Object.entries(plugin.hooks).forEach(([type, fn]) => {
            if (typeof fn === 'function') {
              registerHook(type, fn);
            }
          });
        }

        const meta = plugin.meta && typeof plugin.meta === 'object'
          ? {
              name: plugin.meta.name || file.replace('.js', ''),
              permissions: Array.isArray(plugin.meta.permissions)
                ? plugin.meta.permissions
                : [],
            }
          : { name: file.replace('.js', ''), permissions: [] };

        loaded.push(meta);
      } catch (error) {
        console.error(`Failed to load plugin ${file}`, error);
      }
    }
  }
  return loaded;
}
