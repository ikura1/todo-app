'use client';

import { useState, useEffect, useMemo } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskFilter } from '@/components/TaskFilter';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TODOアプリ
          </h1>
          <p className="text-gray-600">
            タスクを追加して生産性を向上させましょう
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

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