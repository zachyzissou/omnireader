import pinoHttp from 'pino-http';
import { logger } from '../logger.js';

export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/healthz',
  },
  genReqId: (req) => req.id,
});
