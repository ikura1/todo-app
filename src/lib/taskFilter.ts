import { Task } from '@/types/task';

export interface TaskFilter {
  status: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  searchText?: string;
  tags?: string[];
  dueDateFilter?: 'overdue' | 'today' | 'thisWeek';
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

    // 期限フィルター
    if (filter.dueDateFilter && task.dueDate) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const taskDueDate = new Date(task.dueDate);
      const taskDueDateOnly = new Date(taskDueDate.getFullYear(), taskDueDate.getMonth(), taskDueDate.getDate());

      switch (filter.dueDateFilter) {
        case 'overdue':
          if (taskDueDateOnly >= today || task.completed) {
            return false;
          }
          break;
        case 'today':
          if (taskDueDateOnly > today) {
            return false;
          }
          break;
        case 'thisWeek':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          if (taskDueDateOnly > weekFromNow) {
            return false;
          }
          break;
      }
    } else if (filter.dueDateFilter) {
      // 期限フィルターが設定されているが、タスクに期限がない場合は除外
      return false;
    }

    return true;
  });
}