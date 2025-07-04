'use client';

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          タスク一覧 (0)
        </h2>
        <p className="text-gray-500 text-center py-8">
          まだタスクがありません。上のフォームから追加してください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        タスク一覧 ({tasks.length})
      </h2>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.text}
            </span>
            <span className="text-xs text-gray-500">
              {task.priority}
            </span>
            <button
              onClick={() => onDelete(task.id)}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}