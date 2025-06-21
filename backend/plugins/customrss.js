// Custom RSS plugin integration example

module.exports.meta = {
  name: 'CustomRSS',
  permissions: ['read']
};

module.exports.register = function(app) {
  app.post('/api/plugins/customrss/register', async (req, res) => {
    // TODO: Register custom RSS feed URL
    res.json({ success: true });
  });
};
