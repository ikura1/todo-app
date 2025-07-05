'use client';

import { motion } from 'framer-motion';

export type SortOption = 'createdAt' | 'updatedAt' | 'priority' | 'dueDate' | 'alphabetical';
export type SortDirection = 'asc' | 'desc';

interface TaskSortProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
}

export function TaskSort({ sortBy, sortDirection, onSortChange }: TaskSortProps) {
  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'createdAt', label: '作成日時', icon: '📅' },
    { value: 'updatedAt', label: '更新日時', icon: '⏰' },
    { value: 'priority', label: '優先度', icon: '🎯' },
    { value: 'dueDate', label: '期限', icon: '⏱️' },
    { value: 'alphabetical', label: 'アルファベット順', icon: '🔤' },
  ];

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      // 同じソート項目の場合は方向を切り替え
      onSortChange(newSortBy, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 新しいソート項目の場合はデフォルトの方向
      const defaultDirection = newSortBy === 'alphabetical' ? 'asc' : 'desc';
      onSortChange(newSortBy, defaultDirection);
    }
  };

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.h3
        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        並び替え
      </motion.h3>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === option.value
                ? 'bg-blue-500 text-white dark:bg-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
            {sortBy === option.value && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="ml-1"
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
