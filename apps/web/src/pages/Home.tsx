import { Link } from 'react-router-dom';

export function HomePage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>Connect your sources to start seeing activity here</p>
            <Link
              to="/settings"
              className="mt-2 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              Configure Sources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}