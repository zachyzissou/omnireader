import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'light'|'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="p-2 focus:outline-none"
    >
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeSwitcher;
