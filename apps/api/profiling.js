import { performance } from 'perf_hooks';

export function profileMiddleware(req, res, next) {
  const start = performance.now();
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[PROFILE] ${req.method} ${req.url} ${duration.toFixed(2)}ms`);
  });
  next();
}
