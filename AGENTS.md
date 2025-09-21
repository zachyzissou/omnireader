# Repository Guidelines

## Project Structure & Module Organization
OmniFeed keeps responsibilities split between `frontend/` (Vite + React UI), `backend/` (Express API, plugin runtime, and workflow triggers), and `docs/` (n8n workflow and plugin references). Backend migrations live in `backend/migrations/` with database access via `backend/db.js`; workflow stubs and agent hooks sit under `backend/workflows/` and `backend/plugins/`, while reusable data helpers live in `backend/services/`. Static assets and Tailwind styles are in `frontend/public/` and `frontend/src/index.css` respectively, while shared UI primitives stay in `frontend/src/components/`.

## Build, Test, and Development Commands
- `cd frontend && npm run dev` – start the Vite dev server at http://localhost:3000 with hot reload.
- `cd backend && npm run dev` – launch the Express API with Nodemon on port 4000.
- `cd backend && npm run migrate` – apply the latest Knex migrations before working with Smart Filters or agent metadata.
- `docker-compose up --build` – bring up the full stack (frontend, backend, Postgres, n8n) for end-to-end validation.

## Coding Style & Naming Conventions
Use 2-space indentation and semicolons in backend `.js` files; prefer `const` and ESM `import` statements. React components should be PascalCase, hooks camelCase, and shared types colocated near usage. Run `cd frontend && npm run lint` to apply the ESLint + TypeScript rules; match existing Tailwind utility ordering, keep base styles in `frontend/src/index.css`, and stash configuration secrets in `.env.local` files ignored by Git.

## Testing Guidelines
Backend unit tests live in `backend/__tests__/` and follow the `*.test.js` suffix. Execute `cd backend && npm test` to run the Jest suite (Node 18 with `--experimental-vm-modules`). Add fixtures around workflow handlers with lightweight mocks instead of real API calls. Frontend does not yet ship with a test runner—align with the team before introducing Vitest or component snapshot coverage.

## Commit & Pull Request Guidelines
Commit history favors Conventional Commits (`feat:`, `fix:`, `chore:`). Keep scopes narrow and mention the impacted area, e.g., `feat(agents): expand PodcastTracker webhooks`. Every PR should include a concise summary, linked issue (if any), verification steps or screenshots for UI changes, and confirmation that linting/tests pass. Coordinate schema tweaks with backend owners and flag migrations in the PR description.

## Agent & Workflow Notes
Each core agent (MusicFetcher, RSSIngestor, PodcastTracker, YouTubeSubscriptions) maps to Express workflow endpoints wired up in `backend/app.js`; keep these idempotent and document payload assumptions in PRs. Smart Filter rules are compiled into n8n webhooks—update `docs/` when adding filter fields. Plugin modules register through `register(app)`; declare permissions in metadata and avoid blocking calls during registration to keep startup responsive. The onboarding wizard persists preferences through `/api/settings/onboarding`; update the corresponding service when adding new setup steps.

Feed previews are exposed via `/api/feeds` and `/api/feeds/:feedKey`, powered by lightweight workflow adapters under `backend/adapters/`. Replace the mock generators in `workflowAdapter.js` with real n8n or external integrations, and keep responses trimmed for dashboard summaries.

## Logging & Tracing
The backend uses `pino` + `pino-http` for structured logs with `x-request-id` correlation. Each request receives/returns a `requestId`, and `getLogger()` attaches it automatically—route custom logs through it instead of `console.log`. Filter noisy endpoints with `autoLogging.ignore` in `middleware/requestLogger.js`, and surface warnings/errors with meaningful context (payload ids, workflow names) to keep observability actionable.
