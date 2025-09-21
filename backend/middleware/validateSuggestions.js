import { badRequest } from '../httpErrors.js';

export function validateSuggestionsPayload(req, _res, next) {
  const { items } = req.body ?? {};
  if (!Array.isArray(items)) {
    return next(badRequest('items must be an array'));
  }

  const normalized = items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      title: typeof item.title === 'string' ? item.title : '',
    }));

  req.body.items = normalized;
  return next();
}
