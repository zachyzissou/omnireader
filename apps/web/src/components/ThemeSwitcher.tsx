import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAppStore } from '../store/app';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useAppStore();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {theme === 'dark' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-600" />}
    </button>
  );
};

export default ThemeSwitcher;
