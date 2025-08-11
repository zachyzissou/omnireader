import { useParams, Navigate, Link } from 'react-router-dom';
import { useItem, useSimilarItems, useAddAnnotation } from '../hooks/api';
import { useState } from 'react';

export function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  
  const { data: item, isLoading, error } = useItem(id!);
  const { data: similarItems } = useSimilarItems(id!);
  const addAnnotationMutation = useAddAnnotation();
  
  if (!id) {
    return <Navigate to="/" replace />;
  }

  const handleAddAnnotation = async () => {
    if (!annotationText.trim() || !item) return;
    
    try {
      await addAnnotationMutation.mutateAsync({
        itemId: item.id,
        annotation: {
          kind: 'NOTE',
          text: annotationText,
        }
      });
      setAnnotationText('');
      setShowAnnotationForm(false);
    } catch (error) {
      console.error('Failed to add annotation:', error);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to load item: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Item not found</p>
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
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
                {item.source.type}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {item.author && `by ${item.author} • `}
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {item.title}
            </h1>
            
            {item.url && (
              <div className="mb-4">
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  View Original →
                </a>
              </div>
            )}
            
            <div className="mb-6">
              {item.content ? (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No content available
                </p>
              )}
            </div>

            {/* Annotations */}
            {item.annotations?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Annotations
                </h3>
                <div className="space-y-3">
                  {item.annotations.map((annotation) => (
                    <div 
                      key={annotation.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                          {annotation.kind}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(annotation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {annotation.text && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {annotation.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => console.log('Save functionality to be implemented')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <span>🔖</span>
                    Save
                  </button>
                  
                  {item.url && (
                    <button 
                      onClick={() => navigator.share?.({ title: item.title, url: item.url! }) || navigator.clipboard.writeText(item.url!)}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>📤</span>
                      Share
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setShowAnnotationForm(!showAnnotationForm)}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span>✏️</span>
                    Annotate
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Annotation form */}
              {showAnnotationForm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <textarea
                    value={annotationText}
                    onChange={(e) => setAnnotationText(e.target.value)}
                    placeholder="Add your note..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddAnnotation}
                      disabled={!annotationText.trim() || addAnnotationMutation.isPending}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {addAnnotationMutation.isPending ? 'Adding...' : 'Add Note'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAnnotationForm(false);
                        setAnnotationText('');
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Items
          </h2>
          {similarItems?.results?.length ? (
            <div className="space-y-3">
              {similarItems.results.slice(0, 5).map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/items/${relatedItem.id}`}
                  className="block p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {relatedItem.title}
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {relatedItem.source.type} • {new Date(relatedItem.publishedAt).toLocaleDateString()}
                    • {(relatedItem.score * 100).toFixed(0)}% similar
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No related items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}