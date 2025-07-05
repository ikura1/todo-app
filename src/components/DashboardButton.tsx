'use client';

import { motion } from 'framer-motion';

interface DashboardButtonProps {
  onClick: () => void;
}

export function DashboardButton({ onClick }: DashboardButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-4 left-4 z-40 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 1.2 }}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="ダッシュボードを開く"
    >
      <motion.svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </motion.svg>

      {/* パルスエフェクト */}
      <motion.div
        className="absolute inset-0 rounded-full bg-purple-400 opacity-75"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
