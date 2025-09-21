import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage();

export function runWithContext(context, fn) {
  storage.run(context, fn);
}

export function getContext() {
  return storage.getStore();
}

export function getRequestId() {
  return storage.getStore()?.requestId || null;
}
