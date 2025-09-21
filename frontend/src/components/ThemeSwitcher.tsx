import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

type ThemePreference = 'light' | 'dark';

const getPreferredTheme = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  const systemPrefersDark = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
  return systemPrefersDark ? 'dark' : 'light';
};

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<ThemePreference>(() => getPreferredTheme());

  const hasStoredPreference = useRef(
    typeof window !== 'undefined' && !!window.localStorage.getItem('theme'),
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasStoredPreference.current) {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const Icon = useMemo(() => (theme === 'dark' ? FaSun : FaMoon), [theme]);

  const toggleTheme = () => {
    const nextTheme: ThemePreference = theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', nextTheme);
    }
    hasStoredPreference.current = true;
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
      title={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <Icon />
    </button>
  );
};

export default ThemeSwitcher;
