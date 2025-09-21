import { runHooks } from './pluginHooks.js';

const WORKFLOW_LABELS = {
  'music-fetcher': 'MusicFetcher',
  'rss-ingestor': 'RSSIngestor',
  'podcast-tracker': 'PodcastTracker',
  'youtube-subscriptions': 'YouTubeSubscriptions',
};

export async function triggerWorkflow(name, payload = {}) {
  const displayName = WORKFLOW_LABELS[name] ?? name;
  const context = {
    workflow: name,
    displayName,
    payload,
  };

  await runHooks('beforeFetch', context);

  // TODO: invoke n8n or other orchestration here.
  const result = {
    message: `${displayName} workflow accepted`,
    data: payload,
  };

  await runHooks('afterFetch', {
    ...context,
    result,
  });

  return result;
}
