import { useParams, Navigate } from 'react-router-dom';

export function ItemPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            ← Back
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Article
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                from Example Source • 2 hours ago
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Example Article Title (Item {id})
            </h1>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                This is a placeholder for the actual content item. In a real implementation,
                this would fetch the item details from the Brain service and display the
                full content, metadata, and any annotations or highlights.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                technology
              </span>
              <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                programming
              </span>
              <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                javascript
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <span>🔖</span>
                    Save
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span>📤</span>
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span>✏️</span>
                    Annotate
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: 2 hours ago
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Items
          </h2>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No related items found</p>
          </div>
        </div>
      </div>
    </div>
  );
}