'use client';

import { motion } from 'framer-motion';
import React, { type FormEvent, useState } from 'react';
import { VoiceInputButton } from './VoiceInputButton';

interface TaskFormProps {
  onSubmit: (taskData: {
    text: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: Date;
  }) => void;
  isLoading?: boolean;
}

export const TaskForm = React.memo(function TaskForm({
  onSubmit,
  isLoading = false,
}: TaskFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (text.trim() === '') {
      return;
    }

    onSubmit({
      text: text.trim(),
      priority,
      category: category.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    setText('');
    setCategory('');
    setDueDate('');
    setPriority('medium');
    setShowAdvanced(false);
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript.trim()) {
      setText(transcript.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <motion.form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <motion.input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          whileFocus={{
            scale: 1.02,
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          }}
          transition={{ duration: 0.1 }}
          aria-label="新しいタスクのテキストを入力"
          aria-describedby="task-input-help"
        />

        <motion.button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={showAdvanced ? '詳細設定を閉じる' : '詳細設定を開く'}
          aria-expanded={showAdvanced}
          aria-controls="advanced-settings"
        >
          ⚙️
        </motion.button>

        <motion.button
          type="submit"
          disabled={isLoading || text.trim() === ''}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
          whileHover={{
            scale: 1.05,
            backgroundColor: '#2563eb',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          animate={
            isLoading
              ? {
                  scale: [1, 1.02, 1],
                  transition: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                    ease: 'easeInOut',
                  },
                }
              : {}
          }
        >
          <motion.span
            animate={
              isLoading
                ? {
                    opacity: [1, 0.5, 1],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      ease: 'easeInOut',
                    },
                  }
                : { opacity: 1 }
            }
          >
            {isLoading ? '追加中...' : '追加'}
          </motion.span>
        </motion.button>

        <VoiceInputButton onTranscript={handleVoiceInput} disabled={isLoading} />
      </motion.form>

      {/* 詳細設定パネル */}
      <motion.div
        initial={false}
        animate={{
          height: showAdvanced ? 'auto' : 0,
          opacity: showAdvanced ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
        id="advanced-settings"
        role="region"
        aria-labelledby="advanced-settings-title"
      >
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div id="task-input-help" className="sr-only">
            新しいタスクのテキストを入力してください。詳細設定ボタンで優先度、カテゴリ、期限を設定できます。
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 優先度選択 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="priority-select"
              >
                優先度
              </label>
              <select
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                aria-describedby="priority-help"
              >
                <option value="low">💙 低</option>
                <option value="medium">⚡ 中</option>
                <option value="high">🔥 高</option>
              </select>
            </motion.div>

            {/* カテゴリ入力 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="category-input"
              >
                カテゴリ
              </label>
              <input
                id="category-input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="仕事、個人など..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                aria-describedby="category-help"
              />
            </motion.div>

            {/* 期限設定 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="due-date-input"
              >
                期限
              </label>
              <input
                id="due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                aria-describedby="due-date-help"
              />
              <div id="priority-help" className="sr-only">
                タスクの重要度を選択してください
              </div>
              <div id="category-help" className="sr-only">
                タスクを分類するカテゴリを入力してください（任意）
              </div>
              <div id="due-date-help" className="sr-only">
                タスクの完了期限を設定してください（任意）
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
