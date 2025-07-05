'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Task } from '@/types/task';
import { useTaskEdit } from '@/hooks/useTaskEdit';

interface SortableTaskItemProps {
  task: Task;
  index: number;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
}

export function SortableTaskItem({ 
  task, 
  index, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}: SortableTaskItemProps) {
  const { 
    editingTaskId, 
    editingText, 
    startEditing, 
    setEditingText, 
    cancelEditing, 
    saveEditing, 
    isEditingTask 
  } = useTaskEdit();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isDragging ? 'opacity-50' : ''}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      layout
      whileHover={{ 
        scale: isDragging ? 1 : 1.02,
        transition: { duration: 0.1 }
      }}
    >
      {/* ドラッグハンドル */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* チェックボックス */}
      <motion.input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />

      {/* タスクテキスト */}
      {isEditingTask(task.id) ? (
        <motion.input
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveEditing(onEdit);
            } else if (e.key === 'Escape') {
              cancelEditing();
            }
          }}
          onBlur={() => saveEditing(onEdit)}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.span 
          className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}
          animate={{
            opacity: task.completed ? 0.6 : 1,
            scale: task.completed ? 0.98 : 1,
          }}
          transition={{ duration: 0.2 }}
          onClick={() => startEditing(task.id, task.text)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {task.text}
        </motion.span>
      )}

      {/* 優先度 */}
      <motion.span 
        className="text-xs text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.2 }}
      >
        {task.priority}
      </motion.span>

      {/* アクションボタン */}
      {isEditingTask(task.id) ? (
        <motion.div className="flex gap-2">
          <motion.button
            onClick={() => saveEditing(onEdit)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            保存
          </motion.button>
          <motion.button
            onClick={cancelEditing}
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            キャンセル
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "#fef2f2"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          削除
        </motion.button>
      )}
    </motion.li>
  );
}