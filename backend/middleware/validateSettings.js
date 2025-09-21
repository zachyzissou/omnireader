import { badRequest } from '../httpErrors.js';

const VALID_KEYS = ['onboarding'];

export function validateSettingKey(req, _res, next) {
  const { key } = req.params;
  if (!VALID_KEYS.includes(key)) {
    return next(badRequest('Invalid settings key'));
  }
  return next();
}

export function validateSettingsPayload(req, _res, next) {
  const { value } = req.body ?? {};
  if (typeof value !== 'object' || value === null) {
    return next(badRequest('value must be an object'));
  }
  return next();
}
