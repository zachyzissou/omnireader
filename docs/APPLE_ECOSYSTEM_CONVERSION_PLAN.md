# OmniFeed Apple Ecosystem Conversion Plan (macOS-first)

## Scope and goals

This document provides:

1. A practical code review of the current OmniFeed codebase from the perspective of a macOS-native rewrite.
2. A Swift/macOS architecture recommendation that uses as many Apple first-party technologies as possible.
3. A phased implementation plan to ship macOS first, then leverage shared components for iOS.

## 1) Current-state code review highlights

### Strengths to preserve

- Clean separation of frontend (`frontend/`) and backend (`backend/`) responsibilities.
- Existing backend API already fits a mobile/macOS client model:
  - Feed snapshot endpoint (`GET /api/feeds`)
  - Per-feed endpoint (`GET /api/feeds/:feedKey`)
  - Onboarding settings persistence (`GET/PUT /api/settings/:key`)
- Request-scoped logging and correlation IDs are already in place (`x-request-id`) for production debugging.
- The current onboarding flow and feed polling behavior are straightforward to map to SwiftUI state containers.

### Gaps that matter for Apple-native clients

1. **Frontend-only UI composition**
   - Current user experience is tightly coupled to React components and browser polling.
   - A native macOS app should shift this state orchestration into SwiftUI + observable models.

2. **Mock feed adapter still in backend**
   - `backend/adapters/workflowAdapter.js` returns placeholder data.
   - Before production Apple clients, this should be replaced with real workflow sources and stable contracts.

3. **No typed API contract package**
   - There is no shared OpenAPI/JSON-schema package for clients.
   - A Swift client benefits from generated models (`Codable`) and strict contract checks.

4. **Frontend lint debt exists right now**
   - `frontend/src/components/FilterBuilder.tsx` uses `any`, failing the project lint step.
   - This is low risk for the macOS migration itself, but signals type-discipline drift.

5. **Transport and caching strategy is web-centric**
   - 60s backend cache + periodic frontend polling works for web dashboards.
   - A native app should combine local persistence + structured background refresh behavior.

## 2) Apple-native target architecture (macOS first)

### Core stack (first-party heavy)

- **SwiftUI** for all app UI (window + sidebar + cards + settings).
- **Observation** (`@Observable`) for feature state and lightweight data flow.
- **SwiftData** for local/offline feed cache and user preferences.
- **URLSession** + async/await for API networking.
- **App Intents** for Siri/Spotlight/Shortcuts integrations (e.g., “Refresh feeds”, “Open podcasts feed”).
- **WidgetKit** for macOS widgets (optional in phase 2+).
- **UserNotifications** for digest/alert notifications.
- **Keychain Services** for secrets/tokens if user-auth integration is added.
- **OSLog/Logger** for structured logging matching backend request IDs.

### Architecture pattern

Use a feature-modular Swift package approach:

- `OmniApp` (macOS app target)
- `Features/Feeds`
- `Features/Filters`
- `Features/Onboarding`
- `Core/Networking`
- `Core/Persistence` (SwiftData)
- `Core/Telemetry`

Then share those feature/core modules with an iOS target later.

### Data model mapping

Map backend payloads to Swift models:

- `FeedSnapshotDTO` -> `[FeedKind: [FeedItemDTO]]`
- `OnboardingSettingsDTO` -> persisted SwiftData `OnboardingSettingsModel`
- `FilterDTO` -> SwiftData model + sync metadata (`updatedAt`, `dirty`)

### UX mapping (web -> macOS)

- React sidebar -> `NavigationSplitView`
- Dashboard cards -> SwiftUI `GroupBox`/custom card views
- Poll refresh button + timer -> pull-to-refresh/command menu + task scheduling
- Theme switcher -> system appearance + app accent options

## 3) macOS-first delivery roadmap

## Phase 0 — hardening backend for native clients (1-2 weeks)

- Add a formal API schema (OpenAPI recommended).
- Ensure stable error envelopes include `requestId` consistently.
- Replace mock workflow adapter output with production adapters or explicit feature flags.
- Add endpoint contract tests for feeds/settings/filter workflows.

**Exit criteria:** API is stable enough for generated/strict typed Swift clients.

## Phase 1 — macOS MVP (2-4 weeks)

- Create `OmniFeedMac` SwiftUI app target.
- Implement these screens:
  - Feed dashboard (music/news/podcasts/videos)
  - Filter list/create/update/delete
  - Onboarding wizard/settings
- Networking via `URLSession` async/await and DTO decoding.
- Local feed/settings persistence via SwiftData.
- Structured client logs via `Logger`.

**Exit criteria:** macOS app reaches feature parity with current dashboard essentials.

## Phase 2 — Apple platform integrations (1-2 weeks)

- Add App Intents:
  - Refresh all feeds
  - Open specific feed section
  - Trigger workflow endpoint safely
- Add WidgetKit summary widget for top feed cards.
- Add notifications (new content digest, workflow failures if surfaced).

**Exit criteria:** macOS app is deeply integrated with system experiences.

## Phase 3 — iOS expansion from shared modules (2-3 weeks)

- Add iOS target reusing shared Core + Features packages.
- Keep platform-specific shell and navigation differences only.
- Reuse App Intents where possible, adapt widget families per platform.

**Exit criteria:** iOS app launched with high shared-code percentage and minimal duplicate logic.

## 4) Swift implementation blueprint (initial)

### Networking and request correlation

- Include `x-request-id` in every request and log both request and response IDs.
- Standardize an `APIClient` with retry/backoff for transient failures.

### Persistence and sync behavior

- SwiftData models for feeds, filters, onboarding state, and refresh metadata.
- On launch:
  1. Render from local cache immediately.
  2. Refresh in background.
  3. Merge using timestamp + deterministic replacement strategy.

### Observability

- Use `Logger(subsystem: "com.omnifeed.app", category: ...)` categories:
  - `network`
  - `sync`
  - `ui`
  - `workflows`
- Propagate backend `requestId` through client logs to correlate incidents end-to-end.

## 5) Risks and mitigation

- **Risk: API drift during client build**  
  Mitigation: freeze API version for MVP and enforce OpenAPI contract tests in CI.

- **Risk: workflow adapter remains mock-like**  
  Mitigation: gate launch on real adapter readiness or explicitly communicate beta simulation mode.

- **Risk: frontend and native clients diverge in behavior**  
  Mitigation: codify product behavior in backend/API docs and shared acceptance tests.

## 6) Immediate next actions (recommended order)

1. Fix current frontend lint issue (`no-explicit-any`) to keep baseline quality green.
2. Add OpenAPI spec for feeds/settings/filters endpoints.
3. Scaffold `OmniFeedMac` SwiftUI app target and shared `Core/Networking` package.
4. Implement dashboard feed rendering with cached SwiftData + live refresh.
5. Implement onboarding + filters CRUD.
6. Add App Intents and one WidgetKit extension.

## 7) Apple references used for this plan

- App Intents overview: https://developer.apple.com/documentation/AppIntents/app-intents
- Creating first app intent: https://developer.apple.com/documentation/appintents/creating-your-first-app-intent
- SwiftData device sync: https://developer.apple.com/documentation/swiftdata/syncing-model-data-across-a-persons-devices
- WidgetKit overview: https://developer.apple.com/documentation/WidgetKit/
- Creating widget extension: https://developer.apple.com/documentation/widgetkit/creating-a-widget-extension/
