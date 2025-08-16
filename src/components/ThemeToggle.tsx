'use client';

import React, { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

export default function ThemeToggle(): React.ReactElement {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ft_theme');
      const initial = (saved as ThemeMode | null) ?? getSystemTheme();
      setTheme(initial);
      applyTheme(initial);
    } catch {
      const initial = getSystemTheme();
      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  function toggle(): void {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem('ft_theme', next);
    } catch {
      // ignore
    }
  }

  return (
    <button
      className="h-9 px-3 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-sm"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}


