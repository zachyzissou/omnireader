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

## Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### Local Development

1. Install dependencies and start services via VS Code Tasks:
   - **Install Frontend Dependencies**
   - **Start Frontend Dev**
   - **Install Backend Dependencies**
   - **Start Backend Dev**

2. Alternatively, use Docker Compose:

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)
- n8n Editor: [http://localhost:5678](http://localhost:5678)

## Documentation

- [Agents](AGENTS.md)

## Contributing

Please submit PRs against `main`. Ensure linting and tests pass before merging.
