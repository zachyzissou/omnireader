import { badRequest } from '../httpErrors.js';

const ALLOWED_OPERATORS = ['equals', 'contains'];

export function validateFilterPayload(req, _res, next) {
  const { field, operator, value } = req.body ?? {};
  const errors = [];

  if (typeof field !== 'string' || !field.trim()) {
    errors.push('field is required');
  }

  if (!ALLOWED_OPERATORS.includes(operator)) {
    errors.push(`operator must be one of: ${ALLOWED_OPERATORS.join(', ')}`);
  }

  if (typeof value !== 'string') {
    errors.push('value must be a string');
  }

  if (errors.length) {
    return next(badRequest('Invalid filter payload', errors));
  }

  req.body = {
    field: field.trim(),
    operator,
    value: value.trim(),
  };

  return next();
}

export function validateFilterId(req, _res, next) {
  const { id } = req.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return next(badRequest('Invalid filter id'));
  }
  req.params.id = numericId;
  return next();
}
