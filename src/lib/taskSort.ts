import { Task } from '@/types/task';
import { SortOption, SortDirection } from '@/components/TaskSort';

export function sortTasks(tasks: Task[], sortBy: SortOption, direction: SortDirection): Task[] {
  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      
      case 'updatedAt':
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      
      case 'priority':
        // 優先度の重み付け: high=3, medium=2, low=1
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
        break;
      
      case 'dueDate':
        // 期限がないタスクは最後に配置
        if (!a.dueDate && !b.dueDate) {
          comparison = 0;
        } else if (!a.dueDate) {
          comparison = 1;
        } else if (!b.dueDate) {
          comparison = -1;
        } else {
          comparison = a.dueDate.getTime() - b.dueDate.getTime();
        }
        break;
      
      case 'alphabetical':
        comparison = a.text.localeCompare(b.text, 'ja-JP');
        break;
      
      default:
        comparison = 0;
    }

    // 完了済みタスクは常に最後に配置
    if (a.completed && !b.completed) {
      return 1;
    }
    if (!a.completed && b.completed) {
      return -1;
    }

    // ソート方向に応じて結果を調整
    return direction === 'asc' ? comparison : -comparison;
  });

  return sortedTasks;
}