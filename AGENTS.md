# OmniFeed Agents

OmniFeed is powered by a set of autonomous agents and orchestrators that handle data ingestion, processing, and user interactions.

## Core Agents

### MusicFetcher

- Purpose: Fetch latest releases from Spotify and Apple Music, cross-reference with Plex library.
- Endpoint: `POST /api/workflows/music-fetcher`
- Workflow: Calls Spotify/Apple Music APIs, filters new releases, checks Plex via API.

### RSSIngestor

- Purpose: Ingest and categorize RSS feeds dynamically.
- Endpoint: `POST /api/workflows/rss-ingestor`
- Workflow: Fetch RSS items from registered feeds, categorize, trigger webhooks.

### PodcastTracker

- Purpose: Track podcasts via OPML import and webhook for new episodes.
- Endpoint: `POST /api/workflows/podcast-tracker`
- Workflow: Parse OPML, poll feeds, trigger latest-episode webhooks.

### YouTubeSubscriptions

- Purpose: Monitor YouTube subscriptions for new uploads, tag/bookmark.
- Endpoint: `POST /api/workflows/youtube-subscriptions`
- Workflow: Poll YouTube Data API, detect new videos, attach tags via webhook.

## Smart Filters

Smart Filters are user-defined rules managed via:

- `GET /api/filters`
- `POST /api/filters`
- `PUT /api/filters/:id`
- `DELETE /api/filters/:id`

These rules compile into dynamic n8n webhooks to tag or highlight incoming content.

## Plugin Architecture

### Plugin Lifecycle

1. **Registration**: Plugins call `register(app)` during startup.
2. **Permissions**: Defined in plugin metadata for UI and API.
3. **UI Schema**: Plugins can extend the dashboard with custom UI panels.

### Example Plugins

- **x.com**: Integrates with x.com feeds.
- **NewsAPI**: Fetches articles from NewsAPI.org.
- **Custom RSS**: Allows ad-hoc RSS feed integration.

