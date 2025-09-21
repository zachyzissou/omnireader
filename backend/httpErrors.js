export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) {
      this.details = details;
    }
  }
}

export function badRequest(message, details) {
  return new HttpError(400, message, details);
}

export function notFound(message = 'Resource not found') {
  return new HttpError(404, message);
}

export function internalError(message = 'Internal server error') {
  return new HttpError(500, message);
}
