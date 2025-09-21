import { randomUUID } from 'crypto';
import { runWithContext } from '../requestContext.js';

export function requestContextMiddleware(req, res, next) {
  const headerId = typeof req.headers['x-request-id'] === 'string' ? req.headers['x-request-id'] : null;
  const requestId = headerId && headerId.trim() ? headerId : randomUUID();
  res.setHeader('x-request-id', requestId);
  req.id = requestId;
  runWithContext({ requestId }, () => next());
}
