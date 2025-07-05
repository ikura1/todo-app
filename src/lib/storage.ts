import type { Task } from '@/types/task';

export const STORAGE_KEY = 'todo-app-tasks';

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (_error) {}
}

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const tasks = JSON.parse(storedData) as Task[];

    // Date オブジェクトを復元
    return tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  } catch (_error) {
    return [];
  }
}
