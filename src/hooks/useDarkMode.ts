import { useState, useEffect } from 'react';

interface UseDarkModeReturn {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function useDarkMode(): UseDarkModeReturn {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      const isDark = storedTheme === 'dark';
      setIsDarkMode(isDark);
      updateDocumentClass(isDark);
    } else {
      // システム設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      updateDocumentClass(prefersDark);
    }
  }, []);

  const updateDocumentClass = (isDark: boolean) => {
    if (typeof document === 'undefined') return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (typeof window !== 'undefined') {
      const theme = newDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    }
    updateDocumentClass(newDarkMode);
  };

  return {
    isDarkMode,
    toggleDarkMode,
  };
}