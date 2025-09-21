import React from 'react';

import type { FeedListItem } from '../types/feeds';

interface FeedPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  items: FeedListItem[];
  emptyCopy?: string;
}

const FeedPlaceholder: React.FC<FeedPlaceholderProps> = ({ icon, title, items, emptyCopy }) => {
  return (
    <div>
      <header className="flex items-center space-x-2 mb-3">
        <span className="text-2xl text-indigo-500">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </header>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {emptyCopy ?? 'Nothing new yet. Connect a source to start seeing updates.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2">
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
              {item.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
              )}
              {item.meta && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.meta}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedPlaceholder;
