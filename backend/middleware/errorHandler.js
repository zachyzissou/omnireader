import { HttpError } from '../httpErrors.js';
import { getRequestId } from '../requestContext.js';
import { getLogger } from '../logger.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let status = 500;
  let message = 'Internal server error';
  let details;

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err.status) {
    status = err.status;
    message = err.message || message;
  }

  const payload = { message };
  if (details) {
    payload.details = details;
  }

  if (status === 500) {
    getLogger().error({ err, requestId: getRequestId() }, 'Unhandled error');
  }

  res.status(status).json({
    ...payload,
    requestId: getRequestId(),
  });
}
