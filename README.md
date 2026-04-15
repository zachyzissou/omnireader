> **License Notice**
> This repository is source-visible only. No copying, modification, redistribution, deployment, or commercial use is permitted without prior written permission from Zach Gonser. See `LICENSE` for details.

# OmniFeed

OmniFeed is an intelligent personal dashboard for aggregating and managing multimedia content.

## Features

- Minimalist Vite+React+Tailwind frontend with glassmorphic cards and collapsible sidebar
- Express backend with REST API for triggering n8n workflows and managing Smart Filters
- Dynamic plugin architecture with runtime module loading
- n8n workflows for Music, RSS, Podcasts, and YouTube
- Docker Compose setup for frontend, backend, n8n workflow engine, and Postgres storage
- CI/CD via GitHub Actions: linting, testing, and Docker image builds
- First-run configuration wizard for account linking, feed discovery, notifications, and advanced settings
  - Onboarding state persists via `/api/settings/onboarding`

## Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### Local Development

1. Copy the sample backend environment file and adjust credentials as needed:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Install dependencies and start services via VS Code Tasks:
   - **Install Frontend Dependencies**
   - **Start Frontend Dev**
   - **Install Backend Dependencies**
   - **Start Backend Dev**

3. Alternatively, use Docker Compose:

```bash
docker-compose up --build

Run database migrations with `npm run migrate` inside the backend directory.
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)
- n8n Editor: [http://localhost:5678](http://localhost:5678)

### Testing

- Backend: `cd backend && npm test` (defaults to an in-memory SQLite store when `NODE_ENV=test`). Ensure dependencies are installed (`npm install`) before running.
- Frontend: tests are not yet configured; coordinate with the team before introducing Vitest or similar tooling.

## Documentation

- [Agents](AGENTS.md)
- [Workflows](docs/WORKFLOWS.md)
- [Plugins](docs/PLUGINS.md)

## Contributing

Contributions are accepted only with prior written permission from Zach Gonser and are reviewed case-by-case.
If authorized to contribute, submit PRs against `main` and ensure linting/tests pass before review.
By submitting a contribution, you agree to the inbound contribution license terms in `LICENSE`.

## Performance Profiling

Start the backend with `PROFILING=true npm run dev` to log request durations.

### Operations

- Health check: `curl http://localhost:4000/healthz` (returns status, loaded plugins, timestamp).
- Feed preview: `curl http://localhost:4000/api/feeds` for the latest snapshot (`/api/feeds/music`, `/api/feeds/news`, etc. for specific streams).
- Logs: set `LOG_LEVEL=debug` to increase verbosity; request IDs are emitted via `x-request-id` headers and structured logs.
