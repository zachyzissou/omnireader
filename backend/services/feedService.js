import { getLogger } from '../logger.js';
import { fetchWorkflowPreview } from '../adapters/workflowAdapter.js';

const cache = new Map();
const TTL_MS = 60 * 1000;

const WORKFLOW_TO_FEED = {
  music: 'music-fetcher',
  news: 'rss-ingestor',
  podcasts: 'podcast-tracker',
  videos: 'youtube-subscriptions',
};

function setCache(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + TTL_MS });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export async function getFeedSnapshot() {
  const cached = getCache('feeds');
  if (cached) {
    return cached;
  }

  const logger = getLogger();
  logger.debug('Aggregating workflow previews');

  const entries = await Promise.all(
    Object.entries(WORKFLOW_TO_FEED).map(async ([feedKey, workflow]) => {
      const items = await fetchWorkflowPreview(workflow);
      return [feedKey, items];
    }),
  );

  const payload = entries.reduce((acc, [key, items]) => {
    acc[key] = items;
    return acc;
  }, {
    music: [],
    news: [],
    podcasts: [],
    videos: [],
  });

  setCache('feeds', payload);
  return payload;
}

export async function getFeedByKey(key) {
  const snapshot = await getFeedSnapshot();
  return snapshot[key] ?? [];
}
