# OmniReader Architecture

## Current State Analysis

### Overview
OmniReader (formerly OmniFeed) is transitioning from a simple content aggregation dashboard to a comprehensive, privacy-preserving personal media brain with advanced AI capabilities.

### Current Architecture

#### Frontend (`/frontend`)
- **Technology**: Vite + React 19 + TypeScript + Tailwind CSS 4.1
- **UI Style**: Glassmorphic design with collapsible sidebar
- **Components**: 
  - ConfigWizard for first-run setup
  - Sidebar navigation
  - FilterBuilder for Smart Filters
  - PluginPanel for dynamic plugin management
  - ThemeSwitcher for dark/light modes
- **State Management**: Local useState hooks
- **Build**: Vite with TypeScript compilation

#### Backend (`/backend`) 
- **Technology**: Express.js + Node.js (ES modules)
- **Database**: PostgreSQL with Knex.js migrations
- **Architecture**: Plugin-based with dynamic loading
- **Core Features**:
  - Smart Filters CRUD API (`/api/filters`)
  - Workflow triggers (`/api/workflows/*`)
  - Plugin management (`/api/plugins`)
  - AI suggestions (`/api/suggestions`)
- **Plugins**: CustomRSS, NewsAPI, x.com integration
- **Profiling**: Optional request duration logging

#### Database Schema (Current)
```sql
-- filters table
CREATE TABLE filters (
  id SERIAL PRIMARY KEY,
  field VARCHAR,
  operator VARCHAR,
  value VARCHAR
);
```

#### Infrastructure
- **Orchestration**: Docker Compose
- **Services**: frontend (port 3000), backend (port 4000), n8n (port 5678), PostgreSQL (port 5432)
- **n8n Integration**: Workflow automation for Music, RSS, Podcasts, YouTube
- **CI/CD**: GitHub Actions (basic linting/testing)

### Identified Gaps & Issues

1. **Data Architecture**: No centralized data ownership or embedding capabilities
2. **Search**: No semantic search or advanced ranking
3. **Authentication**: No proper auth system or user management
4. **Mobile Support**: No mobile application
5. **Monorepo**: Single-repo structure limits modularity
6. **TypeScript**: Inconsistent TypeScript usage across codebase
7. **Testing**: Minimal test coverage
8. **Security**: No proper secrets management or CSRF protection
9. **Scalability**: No job queue system for background processing
10. **Privacy**: No data export or GDPR compliance features

## Target Architecture

### Monorepo Structure (pnpm workspaces)
```
apps/
  web/              # Enhanced React frontend
  api/              # Gateway API (Express/TypeScript)
  mobile/           # React Native Expo application  
  brain/            # Local Brain service (core data owner)
packages/
  plugin-sdk/       # Type-safe plugin interface
  ui/               # Shared React components + Tailwind preset
  tsconfig/         # Shared TypeScript configurations
  eslint-config/    # Shared ESLint configurations
```

### Core Services

#### Local Brain Service (`apps/brain`)
**Purpose**: Centralized data ownership, embeddings, search, and content enrichment

**Technology Stack**:
- **Runtime**: Node.js 20 LTS + TypeScript (strict mode)
- **Database**: PostgreSQL 15+ with pgvector extension
- **ORM**: Prisma with migrations
- **Job Queue**: BullMQ + Redis for background processing
- **LLM Integration**: LiteLLM adapter (Ollama local + OpenAI fallback)
- **Search**: Hybrid BM25 (pg_trgm/pgroonga) + pgvector similarity

**Database Schema** (Prisma):
```prisma
model Source {
  id           String   @id @default(cuid())
  type         SourceType // rss, youtube, podcast, custom, n8n
  url          String?
  config       Json?
  status       SourceStatus
  lastFetchedAt DateTime?
  items        Item[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Item {
  id          String   @id @default(cuid())
  sourceId    String
  source      Source   @relation(fields: [sourceId], references: [id])
  title       String
  author      String?
  url         String?
  publishedAt DateTime
  content     String?  // extracted readable text
  media       Json?    // audio/video metadata
  hash        String   @unique // for deduplication
  raw         Json     // original payload
  annotations Annotation[]
  embeddings  Embedding[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([publishedAt])
  @@index([hash])
}

model Entity {
  id    String @id @default(cuid())
  name  String
  type  String // person, organization, location, etc.
  extra Json?
}

model Annotation {
  id        String       @id @default(cuid())
  itemId    String
  item      Item         @relation(fields: [itemId], references: [id])
  kind      AnnotationType // summary, tags, topics, highlights, note
  text      String?
  data      Json?
  createdBy String?      // user ID
  createdAt DateTime     @default(now())
}

model Embedding {
  id     String  @id @default(cuid())
  itemId String
  item   Item    @relation(fields: [itemId], references: [id])
  vector Float[] // pgvector array
  model  String  // embedding model used
  dim    Int     // vector dimensions
}

model Filter {
  id     String @id @default(cuid())
  name   String
  logic  Json   // JSON Logic DSL
  owner  String? // user ID
  active Boolean @default(true)
}

model User {
  id           String   @id @default(cuid())
  email        String?  @unique
  oidcSubject  String?  @unique
  roles        String[] // admin, user
  deviceTokens DeviceToken[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model DeviceToken {
  id       String @id @default(cuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id])
  token    String @unique
  platform String // ios, android, web
}

enum SourceType {
  RSS
  YOUTUBE
  PODCAST
  CUSTOM
  N8N
}

enum SourceStatus {
  ACTIVE
  PAUSED
  ERROR
}

enum AnnotationType {
  SUMMARY
  TAGS
  TOPICS
  HIGHLIGHTS
  NOTE
}
```

**APIs** (OpenAPI 3):
```yaml
# Core endpoints
POST   /ingest/webhook/{sourceId}     # n8n/connector push
GET    /sources                      # list sources
POST   /sources                      # create source
PATCH  /sources/{id}                 # update source
POST   /sources/{id}/refresh         # trigger fetch

GET    /items                        # paginated items with filters
GET    /items/{id}                   # single item detail
POST   /items/{id}/annotate          # add annotation

POST   /search                       # hybrid semantic + keyword search
GET    /search/similar/{itemId}      # find related items

GET    /filters                      # list smart filters
POST   /filters                      # create filter
PUT    /filters/{id}                 # update filter
DELETE /filters/{id}                 # delete filter

GET    /export                       # NDJSON data export
```

**Background Jobs**:
- **Ingestion**: Fetch RSS/podcast feeds, process webhooks
- **Embedding**: Generate vectors for new content
- **Enrichment**: Extract entities, generate summaries, tag content
- **Cleanup**: Archive old items, optimize indexes

#### API Gateway (`apps/api`)
**Purpose**: Thin authentication/routing layer between clients and Brain

**Responsibilities**:
- Request authentication and authorization
- Rate limiting and request logging
- Proxy to Local Brain service
- Transform external webhooks to Brain format
- API key management for automations
- Request validation with Zod schemas

#### Web Application (`apps/web`)
**Purpose**: Enhanced React frontend with modern state management

**Features**:
- **Home/Feeds**: Source overview with unread counts
- **Inbox**: All items sorted by recency/importance  
- **Search**: Hybrid semantic + keyword with faceted filtering
- **Item Detail**: Clean reader view with annotations
- **Filter Builder**: Visual Smart Filter configuration
- **Settings**: Source management, model configuration, privacy controls
- **First-run Wizard**: Source setup and Brain connectivity verification

**Technology**:
- Vite + React + TypeScript + Tailwind CSS
- TanStack Query for server state
- Zustand for client state  
- Headless UI + shadcn/ui components
- Zod for validation

#### Mobile Application (`apps/mobile`)
**Purpose**: React Native app for on-the-go content consumption

**Features**:
- Inbox, Search, Item Detail, Filters, Settings
- Offline cache with SQLite
- Push notifications (ntfy/FCM/APNs)
- Deep links (`omnireader://item/{id}`)
- Biometric authentication

### Plugin Architecture

#### Plugin SDK (`packages/plugin-sdk`)
```typescript
export interface OmniPlugin {
  id: string;
  kind: 'source' | 'enricher' | 'action';
  
  setup(config: Record<string, any>): Promise<void>;
  
  // Source plugins
  discover?(): Promise<SourceCandidate[]>;
  fetch?(since?: Date): Promise<NormalizedItem[]>;
  
  // Enricher plugins  
  enrich?(item: NormalizedItem): Promise<Partial<Annotation>>;
  
  // Action plugins
  action?(input: any): Promise<any>;
}

export interface NormalizedItem {
  title: string;
  author?: string;
  url?: string;
  publishedAt: Date;
  content?: string;
  media?: MediaMetadata;
  tags?: string[];
}
```

#### Built-in Plugins
- **rss-source**: RSS/Atom feed processing
- **podcast-source**: Podcast RSS with enclosure handling
- **youtube-source**: YouTube Data API integration
- **webpage-source**: Manual URL addition with Readability
- **transcribe-enricher**: Audio/video transcription (optional)
- **summary-enricher**: Content summarization
- **ner-enricher**: Named entity recognition

### Security Model

#### Authentication & Authorization
- **Default**: Passwordless magic link + optional TOTP
- **External**: OIDC integration (Authelia, Auth0, etc.)
- **Tokens**: Short-lived access tokens, rotating refresh tokens
- **CSRF**: Protection for web requests
- **API Keys**: For automation integrations

#### Secrets Management
- Environment variables for configuration
- Docker secrets support for production
- Documented environment variables in `docs/ENV.md`
- No secrets in repository or containers

#### Privacy Features
- Local-first data storage
- Encrypted at rest (optional PostgreSQL TDE)
- GDPR-compliant data export
- User data redaction capabilities
- Anonymous telemetry (opt-in only)

### Data Flow

#### Content Ingestion
1. **Sources** → configured RSS feeds, API connections, webhooks
2. **Fetch Jobs** → BullMQ background jobs pull content
3. **Normalization** → extract readable text, standardize format
4. **Deduplication** → content hashing to prevent duplicates
5. **Storage** → persist to PostgreSQL via Prisma

#### Enrichment Pipeline
1. **Embedding** → generate vector representations
2. **Entity Extraction** → identify people, places, organizations
3. **Summarization** → create short/long summaries
4. **Tagging** → automatic topic classification
5. **Smart Filters** → apply user-defined rules

#### Search & Discovery
1. **Hybrid Search** → combine BM25 keyword + vector similarity
2. **Reranking** → optional ML-based result optimization
3. **Faceted Filtering** → by source, date, tags, entities
4. **Related Items** → vector similarity for discovery

### Deployment Architecture

#### Docker Compose (Development)
```yaml
services:
  postgres:     # PostgreSQL 15 with pgvector
  redis:        # Redis for job queues
  brain:        # Local Brain service
  api:          # API Gateway  
  web:          # React frontend
  n8n:          # Workflow automation (optional)
```

#### Production (Homelab/Unraid)
- Multi-stage Dockerfiles for optimized images
- GHCR.io registry for container distribution
- Unraid template XML for easy deployment
- Health checks and proper service dependencies
- Volume mounts for data persistence
- Environment-based configuration

### Migration Strategy

#### Phase Implementation
1. **Monorepo Setup** → pnpm workspaces, shared configs
2. **Brain Service** → Prisma schema, basic APIs, job queues
3. **API Gateway** → authentication, proxying, validation
4. **Frontend Refactor** → modern state management, new features
5. **Mobile App** → React Native implementation
6. **Plugin System** → SDK and built-in plugins
7. **Search Enhancement** → hybrid search, embeddings
8. **Production Ready** → Docker, security, monitoring

#### Data Migration
- Migrate existing filter data to new schema
- Preserve plugin configurations
- Backup/restore procedures for PostgreSQL
- Export utilities for data portability

## Conclusion

This architecture transformation will evolve OmniReader from a simple dashboard into a comprehensive, privacy-first personal knowledge system. The Local Brain service becomes the authoritative data owner, while the API Gateway provides secure access for multiple client applications. The plugin system ensures extensibility, and the homelab-friendly deployment supports self-hosted privacy.

The phased approach ensures steady progress while maintaining system stability throughout the transformation.