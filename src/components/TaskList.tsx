'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          タスク一覧 (0)
        </h2>
        <motion.p 
          className="text-gray-500 text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          まだタスクがありません。上のフォームから追加してください。
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        タスク一覧 ({tasks.length})
      </motion.h2>
      <ul className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.li
              key={task.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              layout
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.1 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.span 
                className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                animate={{
                  opacity: task.completed ? 0.6 : 1,
                  scale: task.completed ? 0.98 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {task.text}
              </motion.span>
              <motion.span 
                className="text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                {task.priority}
              </motion.span>
              <motion.button
                onClick={() => onDelete(task.id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#fef2f2"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                削除
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}