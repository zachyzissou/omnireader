import pino from 'pino';
import { appConfig } from './config.js';
import { getRequestId } from './requestContext.js';

const level = process.env.LOG_LEVEL || (appConfig.env === 'production' ? 'info' : 'debug');

const baseLogger = pino({
  level,
  transport: appConfig.env === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          singleLine: true,
        },
      }
    : undefined,
});

export const logger = baseLogger;

export function getLogger() {
  const requestId = getRequestId();
  if (!requestId) {
    return baseLogger;
  }
  return baseLogger.child({ requestId });
}
