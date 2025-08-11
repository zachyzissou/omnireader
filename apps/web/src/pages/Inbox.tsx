export function InboxPage() {
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
                  Unread Items
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  0 items
                </span>
              </div>
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg">Your inbox is empty</p>
                <p className="text-sm mt-2">
                  Connect your sources to start receiving content
                </p>
              </div>
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
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">
                  Mark All Read
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Clear all unread items
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">
                  Refresh Sources
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Check for new content
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}