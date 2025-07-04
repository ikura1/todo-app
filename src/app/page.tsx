'use client';

import { useState } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { createTask } from '@/lib/task';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const newTask = createTask(text);
      setTasks(prev => [...prev, newTask]);
    } finally {
      setIsLoading(false);
    }
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            タスク一覧 ({tasks.length})
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              まだタスクがありません。上のフォームから追加してください。
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    readOnly
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.text}
                  </span>
                  <span className="text-xs text-gray-500">
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}