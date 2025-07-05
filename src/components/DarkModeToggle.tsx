'use client';

import { motion } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode, isInitialized } = useDarkMode();

  // 初期化完了まで何も表示しない（ハイドレーション問題回避）
  if (!isInitialized) {
    return <div className="h-8 w-14 bg-gray-200 rounded-full animate-pulse"></div>;
  }

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        ${isDarkMode ? 'bg-blue-600 focus:ring-blue-500' : 'bg-gray-200 focus:ring-blue-500'}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      <motion.span
        className={`
          pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-lg ring-0 
          transition duration-200 ease-in-out flex items-center justify-center text-xs
          ${isDarkMode ? 'translate-x-6 bg-gray-900' : 'translate-x-0 bg-white'}
        `}
        initial={false}
        animate={{
          x: isDarkMode ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.span
          initial={false}
          animate={{
            scale: isDarkMode ? 1 : 0,
            opacity: isDarkMode ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          🌙
        </motion.span>
        <motion.span
          initial={false}
          animate={{
            scale: !isDarkMode ? 1 : 0,
            opacity: !isDarkMode ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          ☀️
        </motion.span>
      </motion.span>
    </motion.button>
  );
}
