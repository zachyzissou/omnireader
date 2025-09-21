# Observability Guide

## Logging
- Requests flow through `middleware/requestLogger.js`, emitting structured JSON via `pino-http`.
- `x-request-id` is attached/propagated by `middleware/requestContext.js` and echoed in responses.
- Use `import { getLogger } from '../logger.js'` in handlers/services to ensure contextual logs.
- Set `LOG_LEVEL=debug` in development for verbose output; production defaults to `info`.

## Metrics & Health
- Health endpoint: `GET /healthz` returns status, plugin list, and timestamp. The DB check runs `select 1` to ensure connectivity.
- Profiling middleware (`profiling.js`) activates when `PROFILING=true`, logging request durations.

## Tracing
- AsyncLocalStorage captures request-scoped context in `requestContext.js`. Extend the stored object (e.g., add `userId`) as needed.
- Include `requestId` in downstream service calls or job payloads to maintain traceability across systems.

## Future Enhancements
- Integrate OpenTelemetry SDK for distributed tracing and metrics export (Jaeger/OTLP).
- Emit structured workflow events (queue timings, success/failure counts) for agent monitoring.
- Add log shipping (e.g., Vector, Fluent Bit) in Docker Compose to centralize application logs.
