'use client';

import { motion } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();

  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 1 }}
    >
      <motion.button
        onClick={installApp}
        className={`
          px-6 py-3 rounded-full shadow-lg text-white font-medium text-sm
          ${isOnline ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 cursor-not-allowed'}
          transition-colors duration-200 flex items-center gap-2
        `}
        disabled={!isOnline}
        whileHover={isOnline ? { scale: 1.05 } : {}}
        whileTap={isOnline ? { scale: 0.95 } : {}}
        transition={{ duration: 0.1 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        アプリをインストール
      </motion.button>

      {!isOnline && (
        <motion.div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          オフライン中
        </motion.div>
      )}
    </motion.div>
  );
}
