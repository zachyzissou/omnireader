import FilterBuilder from '../components/FilterBuilder';
import { useFilters, useDeleteFilter, useUpdateFilter } from '../hooks/api';
import { useState } from 'react';

export function FiltersPage() {
  const { data: filters, isLoading, error } = useFilters();
  const deleteFilterMutation = useDeleteFilter();
  const updateFilterMutation = useUpdateFilter();
  const [showBuilder, setShowBuilder] = useState(false);

  const handleDeleteFilter = async (id: string) => {
    if (confirm('Are you sure you want to delete this filter?')) {
      try {
        await deleteFilterMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete filter:', error);
      }
    }
  };

  const handleToggleFilter = async (id: string, active: boolean) => {
    try {
      await updateFilterMutation.mutateAsync({
        id,
        filter: { active: !active }
      });
    } catch (error) {
      console.error('Failed to update filter:', error);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to load filters: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
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
                <button 
                  onClick={() => setShowBuilder(!showBuilder)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showBuilder ? 'Hide Builder' : 'Add Filter'}
                </button>
              </div>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading filters...</p>
                </div>
              ) : !filters?.length ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No filters configured</p>
                  <button 
                    onClick={() => setShowBuilder(true)}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Create your first filter
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filters.map((filter) => (
                    <div key={filter.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {filter.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {/* Simplified display of filter logic */}
                            {JSON.stringify(filter.logic)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFilter(filter.id, filter.active)}
                            disabled={updateFilterMutation.isPending}
                            className={`px-2 py-1 text-xs rounded ${
                              filter.active
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                            } disabled:opacity-50`}
                          >
                            {filter.active ? 'Active' : 'Inactive'}
                          </button>
                          <button 
                            onClick={() => handleDeleteFilter(filter.id)}
                            disabled={deleteFilterMutation.isPending}
                            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    {filters?.filter(f => f.active).length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Filters
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {filters?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Filters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {showBuilder && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Filter
                </h3>
              </div>
              <div className="p-4">
                <FilterBuilder onClose={() => setShowBuilder(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}