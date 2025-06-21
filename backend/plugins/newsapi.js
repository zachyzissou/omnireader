// NewsAPI plugin integration example

module.exports.meta = {
  name: 'NewsAPI',
  permissions: ['read']
};

module.exports.register = function(app) {
  app.get('/api/plugins/newsapi/articles', async (req, res) => {
    // TODO: Fetch articles from NewsAPI.org
    res.json({ articles: [] });
  });
};
