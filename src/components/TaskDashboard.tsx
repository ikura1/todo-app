'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import { TaskStatistics } from './TaskStatistics';

interface TaskDashboardProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDashboard({ tasks, isOpen, onClose }: TaskDashboardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* ダッシュボードパネル */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
          >
            <div className="p-6">
              {/* ヘッダー */}
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  📊 ダッシュボード
                </h1>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              {/* 統計コンポーネント */}
              <TaskStatistics tasks={tasks} />

              {/* 最近のアクティビティ */}
              <motion.div
                className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  📝 最近のタスク
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {tasks
                    .slice()
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .slice(0, 10)
                    .map((task, index) => (
                      <motion.div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.05, duration: 0.2 }}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          task.completed 
                            ? 'bg-green-500' 
                            : task.priority === 'high'
                            ? 'bg-red-500'
                            : task.priority === 'medium'
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${
                            task.completed 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {task.text}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.updatedAt.toLocaleDateString('ja-JP')} - {task.priority}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {task.completed ? '完了' : '進行中'}
                        </div>
                      </motion.div>
                    ))}
                  
                  {tasks.length === 0 && (
                    <motion.div
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                    >
                      まだタスクがありません
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* フッター */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  あなたの生産性を向上させましょう！ 🚀
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}