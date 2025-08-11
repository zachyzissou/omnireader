import { createSourceRoutes } from './sources.js';
import { createItemRoutes } from './items.js';
import { createSearchRoutes } from './search.js';
import { createFilterRoutes } from './filters.js';
import { createIngestRoutes } from './ingest.js';
export function setupRoutes(app, prisma) {
    // API routes
    app.use('/api/sources', createSourceRoutes(prisma));
    app.use('/api/items', createItemRoutes(prisma));
    app.use('/api/search', createSearchRoutes(prisma));
    app.use('/api/filters', createFilterRoutes(prisma));
    app.use('/api/ingest', createIngestRoutes(prisma));
    // Admin routes
    app.get('/admin', (req, res) => {
        res.send(`
      <html>
        <head><title>Brain Admin</title></head>
        <body>
          <h1>Brain Service Admin</h1>
          <ul>
            <li><a href="/admin/queues">Queue Dashboard</a></li>
            <li><a href="/api/sources">Sources API</a></li>
            <li><a href="/api/items">Items API</a></li>
          </ul>
        </body>
      </html>
    `);
    });
}
//# sourceMappingURL=index.js.map