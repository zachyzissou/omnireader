import { getLogger } from '../logger.js';

// Placeholder adapter simulating calls to the respective n8n workflows or external services.
const MOCK_DATA = {
  'music-fetcher': () => [
    {
      id: 'music-adapter-1',
      title: 'Tame Impala – Midnight Lines',
      subtitle: 'Spotify • 1h ago',
      meta: 'Workflow: MusicFetcher',
    },
  ],
  'rss-ingestor': () => [
    {
      id: 'rss-adapter-1',
      title: 'AI curates your daily briefing',
      subtitle: 'RSS • 15m ago',
      meta: 'Workflow: RSSIngestor',
    },
  ],
  'podcast-tracker': () => [
    {
      id: 'podcast-adapter-1',
      title: 'Creator Chats – Ep 120',
      subtitle: 'Podcast API • 3h ago',
      meta: 'Workflow: PodcastTracker',
    },
  ],
  'youtube-subscriptions': () => [
    {
      id: 'youtube-adapter-1',
      title: 'LevelUp Coding – Building Agents with n8n',
      subtitle: 'YouTube • 25m ago',
      meta: 'Workflow: YouTubeSubscriptions',
    },
  ],
};

export async function fetchWorkflowPreview(workflowName) {
  const logger = getLogger();
  logger.debug({ workflowName }, 'Fetching workflow preview');
  const generator = MOCK_DATA[workflowName];
  if (!generator) {
    return [];
  }
  await new Promise((resolve) => setTimeout(resolve, 10));
  return generator();
}
