'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import React from 'react';
import { useTaskEdit } from '@/hooks/useTaskEdit';
import type { Task } from '@/types/task';

interface SortableTaskItemProps {
  task: Task;
  index: number;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
}

export const SortableTaskItem = React.memo(function SortableTaskItem({
  task,
  index,
  onToggleComplete,
  onDelete,
  onEdit,
}: SortableTaskItemProps) {
  const { editingText, startEditing, setEditingText, cancelEditing, saveEditing, isEditingTask } =
    useTaskEdit();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

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
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      layout
      whileHover={{
        scale: isDragging ? 1 : 1.02,
        transition: { duration: 0.1 },
      }}
    >
      {/* ドラッグハンドル */}
      <motion.div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        tabIndex={0}
        role="button"
        aria-label={`タスク「${task.text}」をドラッグして並び替える`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // ドラッグ操作のキーボード代替としてフォーカス移動のヒントを提供
          }
        }}
      >
        <svg
          className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </motion.div>

      {/* チェックボックス */}
      <motion.input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`タスク「${task.text}」を${task.completed ? '未完了' : '完了'}にする`}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              startEditing(task.id, task.text);
            }
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          tabIndex={0}
          role="button"
          aria-label={`タスク「${task.text}」を編集する`}
        >
          {task.text}
        </motion.span>
      )}

      {/* メタデータエリア */}
      <div className="flex flex-col gap-1 items-end">
        {/* 期限 */}
        {task.dueDate && (
          <motion.div
            className={`px-2 py-1 rounded text-xs font-medium ${
              new Date(task.dueDate) < new Date() && !task.completed
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) &&
                    !task.completed
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            📅{' '}
            {new Date(task.dueDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
          </motion.div>
        )}

        {/* カテゴリ */}
        {task.category && (
          <motion.div
            className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            📂 {task.category}
          </motion.div>
        )}

        {/* 優先度 */}
        <motion.div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              : task.priority === 'medium'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          {task.priority === 'high' ? '🔥 高' : task.priority === 'medium' ? '⚡ 中' : '💙 低'}
        </motion.div>
      </div>

      {/* アクションボタン */}
      {isEditingTask(task.id) ? (
        <motion.div className="flex gap-2">
          <motion.button
            onClick={() => saveEditing(onEdit)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            aria-label={`タスク「${task.text}」の編集を保存`}
          >
            保存
          </motion.button>
          <motion.button
            onClick={cancelEditing}
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            aria-label={`タスク「${task.text}」の編集をキャンセル`}
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
            backgroundColor: '#fef2f2',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          aria-label={`タスク「${task.text}」を削除`}
        >
          削除
        </motion.button>
      )}
    </motion.li>
  );
});
