import type { Task } from '@/types/task';

export function createTask(
  text: string,
  options: {
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    tags?: string[];
    dueDate?: Date;
  } = {}
): Task {
  const now = new Date();

  return {
    id: Math.random().toString(36).substring(2, 9),
    text,
    completed: false,
    createdAt: now,
    updatedAt: now,
    priority: options.priority || 'medium',
    category: options.category,
    tags: options.tags,
    dueDate: options.dueDate,
  };
}

export function validateTask(task: Task): boolean {
  if (!task.text || task.text.trim() === '') {
    return false;
  }

  if (!['low', 'medium', 'high'].includes(task.priority)) {
    return false;
  }

  return true;
}

export function toggleTaskComplete(task: Task): Task {
  return {
    ...task,
    completed: !task.completed,
    updatedAt: new Date(),
  };
}

export function updateTask(
  task: Task,
  updates: Partial<Pick<Task, 'text' | 'priority' | 'category' | 'tags' | 'dueDate'>>
): Task {
  return {
    ...task,
    ...updates,
    updatedAt: new Date(),
  };
}
