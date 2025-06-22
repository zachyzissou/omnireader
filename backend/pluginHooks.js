const hooks = {
  beforeFetch: [],
  afterFetch: [],
};

export function registerHook(type, fn) {
  if (hooks[type]) {
    hooks[type].push(fn);
  }
}

export async function runHooks(type, ...args) {
  for (const fn of hooks[type] || []) {
    await fn(...args);
  }
}
