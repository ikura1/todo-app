'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskFilter } from '@/components/TaskFilter';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { createTask, toggleTaskComplete, updateTask } from '@/lib/task';
import { saveTasksToStorage, loadTasksFromStorage } from '@/lib/storage';
import { filterTasks, TaskFilter as TaskFilterType } from '@/lib/taskFilter';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<TaskFilterType>({ status: 'all' });

  // 初期化時にlocalStorageからタスクを読み込み
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
  }, []);

  // タスクが変更されるたびにlocalStorageに保存
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // フィルタリングされたタスク
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filter);
  }, [tasks, filter]);

  // タスク数の統計
  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter(task => !task.completed).length,
      completed: tasks.filter(task => task.completed).length,
    };
  }, [tasks]);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const newTask = createTask(text);
      setTasks(prev => [...prev, newTask]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? toggleTaskComplete(task) : task
      )
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleEdit = (taskId: string, newText: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? updateTask(task, { text: newText }) : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4">
        <motion.header 
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
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
        />

        <TaskList 
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}