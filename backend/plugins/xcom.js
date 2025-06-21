// x.com plugin integration example

module.exports.meta = {
  name: 'x.com',
  permissions: ['read']
};

module.exports.register = function(app) {
  app.get('/api/plugins/xcom/feed', async (req, res) => {
    // TODO: Fetch and return x.com feed items
    res.json({ items: [] });
  });
};
