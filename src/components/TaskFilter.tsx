'use client';

import { motion } from 'framer-motion';
import { TaskFilter as TaskFilterType } from '@/lib/taskFilter';

interface TaskFilterProps {
  filter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function TaskFilter({ filter, onFilterChange, taskCounts }: TaskFilterProps) {
  const handleStatusChange = (status: 'all' | 'active' | 'completed') => {
    onFilterChange({ ...filter, status });
  };

  const handlePriorityChange = (priority: string) => {
    onFilterChange({ 
      ...filter, 
      priority: priority === 'all' ? undefined : priority as 'low' | 'medium' | 'high'
    });
  };

  const handleSearchChange = (searchText: string) => {
    onFilterChange({ 
      ...filter, 
      searchText: searchText.trim() === '' ? undefined : searchText
    });
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.h3 
        className="text-lg font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        フィルター
      </motion.h3>
      
      {/* ステータスフィルター */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ステータス
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: `すべて (${taskCounts.all})` },
            { key: 'active', label: `未完了 (${taskCounts.active})` },
            { key: 'completed', label: `完了済み (${taskCounts.completed})` },
          ].map(({ key, label }, index) => (
            <motion.button
              key={key}
              onClick={() => handleStatusChange(key as 'all' | 'active' | 'completed')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter.status === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 優先度フィルター */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          優先度
        </label>
        <select
          value={filter.priority || 'all'}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      {/* 検索フィルター */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          検索
        </label>
        <input
          type="text"
          value={filter.searchText || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </motion.div>
  );
}