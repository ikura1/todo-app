'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { DashboardButton } from '@/components/DashboardButton';
import { DragAndDropTaskList } from '@/components/DragAndDropTaskList';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { TaskDashboard } from '@/components/TaskDashboard';
import { TaskFilter } from '@/components/TaskFilter';
import { TaskForm } from '@/components/TaskForm';
import { type SortDirection, type SortOption, TaskSort } from '@/components/TaskSort';
import { loadTasksFromStorage, saveTasksToStorage } from '@/lib/storage';
import { createTask, toggleTaskComplete, updateTask } from '@/lib/task';
import { filterTasks, type TaskFilter as TaskFilterType } from '@/lib/taskFilter';
import { sortTasks } from '@/lib/taskSort';
import type { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<TaskFilterType>({ status: 'all' });
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // 初期化時にlocalStorageからタスクを読み込み
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
  }, []);

  // タスクが変更されるたびにlocalStorageに保存
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // フィルタリング＆ソートされたタスク
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filter);
    return sortTasks(filtered, sortBy, sortDirection);
  }, [tasks, filter, sortBy, sortDirection]);

  // タスク数の統計
  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    };
  }, [tasks]);

  // 利用可能なカテゴリ一覧
  const availableCategories = useMemo(() => {
    const categories = tasks
      .map((task) => task.category)
      .filter((category): category is string => Boolean(category));
    return Array.from(new Set(categories));
  }, [tasks]);

  const handleSubmit = useCallback(
    async (taskData: {
      text: string;
      priority: 'low' | 'medium' | 'high';
      category?: string;
      dueDate?: Date;
    }) => {
      setIsLoading(true);
      try {
        const newTask = createTask(taskData.text, {
          priority: taskData.priority,
          category: taskData.category,
          dueDate: taskData.dueDate,
        });
        setTasks((prev) => [...prev, newTask]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? toggleTaskComplete(task) : task)));
  }, []);

  const handleDelete = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const handleEdit = useCallback((taskId: string, newText: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updateTask(task, { text: newText }) : task))
    );
  }, []);

  const handleTasksReorder = useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  }, []);

  const handleSortChange = useCallback((newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8 transition-colors duration-300">
      <OfflineIndicator />
      <PWAInstallButton />
      <DashboardButton onClick={() => setIsDashboardOpen(true)} />
      <TaskDashboard
        tasks={tasks}
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
      <div className="max-w-2xl mx-auto px-4">
        <motion.header
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute top-0 right-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <DarkModeToggle />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            TODOアプリ
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            タスクを追加して生産性を向上させましょう
          </motion.p>
        </motion.header>

        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>

        <TaskFilter
          filter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
          availableCategories={availableCategories}
        />

        <TaskSort sortBy={sortBy} sortDirection={sortDirection} onSortChange={handleSortChange} />

        <DragAndDropTaskList
          tasks={filteredAndSortedTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onTasksReorder={handleTasksReorder}
        />
      </div>
    </div>
  );
}
