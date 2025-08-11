import { useItems, useRefreshSource, useSources } from '../hooks/api';
import { useState } from 'react';

export function InboxPage() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: items, isLoading, error, refetch } = useItems({ 
    limit: 50 
  });
  const { data: sources } = useSources();
  const refreshSourceMutation = useRefreshSource();

  const handleRefreshSources = async () => {
    if (!sources?.length) return;
    
    setRefreshing(true);
    try {
      // Refresh all active sources
      const activeSources = sources.filter(s => s.status === 'ACTIVE');
      await Promise.all(
        activeSources.map(source => 
          refreshSourceMutation.mutateAsync(source.id)
        )
      );
      // Refetch items after refreshing sources
      await refetch();
    } catch (error) {
      console.error('Failed to refresh sources:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAllRead = () => {
    // TODO: Implement mark all as read functionality
    console.log('Mark all read - to be implemented');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to load inbox: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Inbox
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          New content from all your sources
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Items
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isLoading ? 'Loading...' : `${items?.items?.length || 0} items`}
                </span>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Loading content...</p>
                </div>
              ) : !items?.items?.length ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-lg">Your inbox is empty</p>
                  <p className="text-sm mt-2">
                    Connect your sources to start receiving content
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.items.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <button 
                onClick={handleMarkAllRead}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  Mark All Read
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Clear all unread items
                </div>
              </button>
              
              <button 
                onClick={handleRefreshSources}
                disabled={refreshing}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {refreshing ? 'Refreshing...' : 'Refresh Sources'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Check for new content
                </div>
              </button>
            </div>
          </div>

          {/* Sources status */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Sources Status
              </h3>
            </div>
            <div className="p-4">
              {sources?.length ? (
                <div className="space-y-2">
                  {sources.slice(0, 5).map((source) => (
                    <div key={source.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {source.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        source.status === 'ACTIVE' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : source.status === 'ERROR'
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {source.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No sources configured
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}