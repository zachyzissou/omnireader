import FilterBuilder from '../components/FilterBuilder';

export function FiltersPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Smart Filters
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Automatically organize content based on custom rules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Filters
                </h2>
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Filter
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Tech News
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        content contains "AI" OR "machine learning"
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        Active
                      </span>
                      <button className="text-gray-400 hover:text-red-600">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Music Releases
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        source is "spotify" AND type is "album"
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        Active
                      </span>
                      <button className="text-gray-400 hover:text-red-600">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter Statistics
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    2
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Filters
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    147
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Items Processed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Filter
              </h3>
            </div>
            <div className="p-4">
              <FilterBuilder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}