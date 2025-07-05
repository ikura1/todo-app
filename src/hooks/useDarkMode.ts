import { useEffect, useState } from 'react';

interface UseDarkModeReturn {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isInitialized: boolean;
}

export function useDarkMode(): UseDarkModeReturn {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 初期化: localStorageまたはシステム設定から値を取得
    const storedTheme = localStorage.getItem('theme');
    let initialDarkMode = false;

    if (storedTheme) {
      initialDarkMode = storedTheme === 'dark';
    } else {
      // システム設定を確認
      initialDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDarkMode(initialDarkMode);
    updateDocumentClass(initialDarkMode);
    setIsInitialized(true);

    // メディアクエリの変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // ユーザーが手動で設定していない場合のみ、システム設定に従う
      const currentStoredTheme = localStorage.getItem('theme');
      if (!currentStoredTheme) {
        setIsDarkMode(e.matches);
        updateDocumentClass(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [updateDocumentClass]);

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
    isInitialized,
  };
}
