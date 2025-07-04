import { Task } from '@/types/task';

export interface TaskFilter {
  status: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  searchText?: string;
  tags?: string[];
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter(task => {
    // ステータスフィルター
    if (filter.status === 'active' && task.completed) {
      return false;
    }
    if (filter.status === 'completed' && !task.completed) {
      return false;
    }

    // 優先度フィルター
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }

    // カテゴリフィルター
    if (filter.category && task.category !== filter.category) {
      return false;
    }

    // テキスト検索フィルター
    if (filter.searchText) {
      const searchText = filter.searchText.toLowerCase();
      if (!task.text.toLowerCase().includes(searchText)) {
        return false;
      }
    }

    // タグフィルター
    if (filter.tags && filter.tags.length > 0) {
      if (!task.tags || !filter.tags.some(filterTag => task.tags!.includes(filterTag))) {
        return false;
      }
    }

    return true;
  });
}