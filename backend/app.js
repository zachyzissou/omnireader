import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { loadPlugins } from './pluginLoader.js';
import { suggest } from './ai/suggestions.js';
import db from './db.js';
import { profileMiddleware } from './profiling.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import {
  validateFilterPayload,
  validateFilterId,
} from './middleware/validateFilter.js';
import { validateSuggestionsPayload } from './middleware/validateSuggestions.js';
import { appConfig } from './config.js';
import { triggerWorkflow } from './workflowExecutor.js';
import { validateSettingKey, validateSettingsPayload } from './middleware/validateSettings.js';
import { getSetting, upsertSetting } from './services/settingsService.js';
import { requestLogger } from './middleware/requestLogger.js';
import { logger } from './logger.js';
import { requestContextMiddleware } from './middleware/requestContext.js';
import { createHealthRouter } from './routes/health.js';
import { createFeedsRouter } from './routes/feeds.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use(requestContextMiddleware);
  app.use(requestLogger);

  if (appConfig.profiling) {
    app.use(profileMiddleware);
  }

  const isSQLite = appConfig.database.client === 'sqlite3';
  const fetchFilterById = async (id) => db('filters').where({ id }).first();

  const loadedPlugins = await loadPlugins(app);
  logger.info({ plugins: loadedPlugins.map((plugin) => plugin.name) }, 'Plugins loaded');

  app.use(createHealthRouter({ db, plugins: loadedPlugins }));
  app.use(createFeedsRouter());
  app.get('/api/plugins', (req, res) => res.json(loadedPlugins));

  app.post('/api/workflows/music-fetcher', asyncHandler(async (req, res) => {
    const result = await triggerWorkflow('music-fetcher', req.body);
    res.status(202).json(result);
  }));
  app.post('/api/workflows/rss-ingestor', asyncHandler(async (req, res) => {
    const result = await triggerWorkflow('rss-ingestor', req.body);
    res.status(202).json(result);
  }));
  app.post('/api/workflows/podcast-tracker', asyncHandler(async (req, res) => {
    const result = await triggerWorkflow('podcast-tracker', req.body);
    res.status(202).json(result);
  }));
  app.post('/api/workflows/youtube-subscriptions', asyncHandler(async (req, res) => {
    const result = await triggerWorkflow('youtube-subscriptions', req.body);
    res.status(202).json(result);
  }));

  app.post(
    '/api/suggestions',
    validateSuggestionsPayload,
    (req, res) => {
      const suggestions = suggest(req.body.items || []);
      res.json({ suggestions });
    },
  );

  app.get('/api/filters', asyncHandler(async (_req, res) => {
    const filters = await db('filters').select();
    res.json(filters);
  }));

  app.post(
    '/api/filters',
    validateFilterPayload,
    asyncHandler(async (req, res) => {
      let filter;

      if (isSQLite) {
        const [id] = await db('filters').insert(req.body);
        filter = await fetchFilterById(id);
      } else {
        [filter] = await db('filters')
          .insert(req.body)
          .returning('*');
      }
      res.status(201).json(filter);
    }),
  );

  app.put(
    '/api/filters/:id',
    validateFilterId,
    validateFilterPayload,
    asyncHandler(async (req, res) => {
      const payload = {
        ...req.body,
        updated_at: db.fn.now(),
      };

      let filter;

      if (isSQLite) {
        const updated = await db('filters')
          .where({ id: req.params.id })
          .update(payload);

        if (!updated) {
          return res.status(404).json({ message: 'Filter not found' });
        }

        filter = await fetchFilterById(req.params.id);
      } else {
        const [updatedFilter] = await db('filters')
          .where({ id: req.params.id })
          .update(payload)
          .returning('*');

        if (!updatedFilter) {
          return res.status(404).json({ message: 'Filter not found' });
        }

        filter = updatedFilter;
      }

      res.json(filter);
    }),
  );

  app.delete(
    '/api/filters/:id',
    validateFilterId,
    asyncHandler(async (req, res) => {
      const deleted = await db('filters')
        .where({ id: req.params.id })
        .del();

      if (!deleted) {
        return res.status(404).json({ message: 'Filter not found' });
      }

      res.status(204).send();
    }),
  );

  app.get(
    '/api/settings/:key',
    validateSettingKey,
    asyncHandler(async (req, res) => {
      const record = await getSetting(req.params.key);
      if (!record) {
        return res.status(404).json({ message: 'Setting not found' });
      }
      res.json(record);
    }),
  );

  app.put(
    '/api/settings/:key',
    validateSettingKey,
    validateSettingsPayload,
    asyncHandler(async (req, res) => {
      const record = await upsertSetting(req.params.key, req.body.value);
      res.json(record);
    }),
  );

  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.use(errorHandler);

  return { app, loadedPlugins };
}
