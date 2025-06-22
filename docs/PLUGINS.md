# Writing Plugins

Plugins extend the dashboard with new integrations. Each plugin exports `meta`, `register`, and optional `hooks`:

```js
module.exports.meta = { name: 'MyPlugin', permissions: ['read'] };
module.exports.hooks = { beforeFetch() { /* ... */ } };
module.exports.register = function(app) {
  app.get('/api/plugins/myplugin/action', async (req, res) => {
    res.json({ ok: true });
  });
};
```

Place plugin files in `backend/plugins/` and restart the backend to load them.
Unit tests can target plugin hooks using Jest.
