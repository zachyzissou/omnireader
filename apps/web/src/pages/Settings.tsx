import ThemeSwitcher from '../components/ThemeSwitcher';
import { useSources, useCreateSource, useDeleteSource, useUpdateSource } from '../hooks/api';
import { useAppStore } from '../store/app';
import { useState } from 'react';
import type { Source } from '../types';

export function SettingsPage() {
  const { user, logout } = useAppStore();
  const { data: sources, isLoading: sourcesLoading } = useSources();
  const createSourceMutation = useCreateSource();
  const deleteSourceMutation = useDeleteSource();
  const updateSourceMutation = useUpdateSource();
  
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState({
    type: 'RSS' as Source['type'],
    url: '',
  });

  const handleAddSource = async () => {
    if (!newSource.url.trim()) return;
    
    try {
      await createSourceMutation.mutateAsync({
        type: newSource.type,
        url: newSource.url,
        status: 'ACTIVE'
      });
      setNewSource({ type: 'RSS', url: '' });
      setShowAddSource(false);
    } catch (error) {
      console.error('Failed to add source:', error);
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (confirm('Are you sure you want to delete this source?')) {
      try {
        await deleteSourceMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete source:', error);
      }
    }
  };

  const handleToggleSource = async (source: Source) => {
    try {
      await updateSourceMutation.mutateAsync({
        id: source.id,
        data: {
          status: source.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
        }
      });
    } catch (error) {
      console.error('Failed to update source:', error);
    }
  };

  const handleSignOut = () => {
    logout();
  };
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your OmniReader experience
        </p>
      </div>

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Theme
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred color scheme
                  </p>
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sources
                </h2>
                <button
                  onClick={() => setShowAddSource(!showAddSource)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Source
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {showAddSource && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Add New Source</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Source Type
                      </label>
                      <select
                        value={newSource.type}
                        onChange={(e) => setNewSource({ ...newSource, type: e.target.value as Source['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="RSS">RSS Feed</option>
                        <option value="YOUTUBE">YouTube</option>
                        <option value="PODCAST">Podcast</option>
                        <option value="CUSTOM">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={newSource.url}
                        onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                        placeholder="https://example.com/feed.xml"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSource}
                        disabled={!newSource.url.trim() || createSourceMutation.isPending}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {createSourceMutation.isPending ? 'Adding...' : 'Add Source'}
                      </button>
                      <button
                        onClick={() => setShowAddSource(false)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {sourcesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading sources...</p>
                </div>
              ) : !sources?.length ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No sources configured</p>
                  <button
                    onClick={() => setShowAddSource(true)}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Add your first source
                  </button>
                </div>
              ) : (
                sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">
                        {source.type === 'RSS' && '📡'}
                        {source.type === 'YOUTUBE' && '📺'}
                        {source.type === 'PODCAST' && '🎧'}
                        {source.type === 'CUSTOM' && '🔗'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {source.type}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {source.url}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {source._count?.items || 0} items • 
                          {source.lastFetchedAt ? 
                            ` Last: ${new Date(source.lastFetchedAt).toLocaleDateString()}` : 
                            ' Never fetched'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSource(source)}
                        disabled={updateSourceMutation.isPending}
                        className={`px-2 py-1 text-xs rounded ${
                          source.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : source.status === 'ERROR'
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        } disabled:opacity-50`}
                      >
                        {source.status}
                      </button>
                      <button
                        onClick={() => handleDeleteSource(source.id)}
                        disabled={deleteSourceMutation.isPending}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Browser notifications for new content
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Daily Digest
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Summary of daily activity
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || 'user@example.com'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}