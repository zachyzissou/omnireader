import { Link } from 'react-router-dom';
import { useItems, useSources } from '../hooks/api';

export function HomePage() {
  const { data: recentItems, isLoading: itemsLoading } = useItems({ limit: 5 });
  const { data: sources, isLoading: sourcesLoading } = useSources();

  const activeSources = sources?.filter(s => s.status === 'ACTIVE') || [];
  const totalItems = sources?.reduce((acc, source) => acc + (source._count?.items || 0), 0) || 0;
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to OmniReader
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personal media brain - discover, organize, and consume content from all your sources
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {itemsLoading ? '...' : totalItems}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-2xl">📡</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {sourcesLoading ? '...' : activeSources.length}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Sources</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-2xl">📥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {itemsLoading ? '...' : recentItems?.items?.length || 0}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recent Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          to="/inbox"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-2xl">📥</span>
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
              Inbox
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            New content from all your sources waiting to be reviewed
          </p>
        </Link>

        <Link
          to="/search"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-2xl">🔍</span>
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
              Search
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Find content across all your connected sources and saved items
          </p>
        </Link>

        <Link
          to="/filters"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-2xl">🎯</span>
            </div>
            <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
              Smart Filters
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Automatically organize content based on your custom rules
          </p>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {itemsLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading recent activity...</p>
            </div>
          ) : !recentItems?.items?.length ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>No recent activity</p>
              <Link
                to="/settings"
                className="mt-2 inline-block text-blue-600 dark:text-blue-400 hover:underline"
              >
                Configure Sources
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {recentItems.items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/items/${item.id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        {item.author && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            by {item.author}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{item.source.type}</span>
                          <span>•</span>
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm">→</span>
                    </div>
                  </Link>
                ))}
              </div>
              {recentItems.items.length >= 5 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/inbox"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    View all items →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}