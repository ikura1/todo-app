import { filterTasks, TaskFilter } from './taskFilter';
import { createTask } from './task';
import { Task } from '@/types/task';

describe('Task Filter', () => {
  let sampleTasks: Task[];

  beforeEach(() => {
    sampleTasks = [
      createTask('完了済みタスク'),
      createTask('未完了タスク1', { priority: 'high' }),
      createTask('未完了タスク2', { priority: 'low', category: 'work' }),
      createTask('検索対象タスク', { tags: ['important'] }),
    ];
    
    // 最初のタスクを完了状態にする
    sampleTasks[0] = { ...sampleTasks[0], completed: true };
  });

  describe('filterTasks', () => {
    it('should return all tasks when filter is "all"', () => {
      const filter: TaskFilter = { status: 'all' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(4);
      expect(result).toEqual(sampleTasks);
    });

    it('should return only completed tasks when filter is "completed"', () => {
      const filter: TaskFilter = { status: 'completed' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
      expect(result[0].text).toBe('完了済みタスク');
    });

    it('should return only incomplete tasks when filter is "active"', () => {
      const filter: TaskFilter = { status: 'active' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(3);
      result.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });

    it('should filter by priority', () => {
      const filter: TaskFilter = { status: 'all', priority: 'high' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('high');
      expect(result[0].text).toBe('未完了タスク1');
    });

    it('should filter by category', () => {
      const filter: TaskFilter = { status: 'all', category: 'work' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('work');
      expect(result[0].text).toBe('未完了タスク2');
    });

    it('should filter by search text', () => {
      const filter: TaskFilter = { status: 'all', searchText: '検索対象' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('検索対象タスク');
    });

    it('should filter by search text case insensitive', () => {
      const filter: TaskFilter = { status: 'all', searchText: '検索対象' };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
    });

    it('should filter by tags', () => {
      const filter: TaskFilter = { status: 'all', tags: ['important'] };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('important');
    });

    it('should apply multiple filters', () => {
      const filter: TaskFilter = { 
        status: 'active', 
        priority: 'high',
        searchText: '未完了'
      };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
      expect(result[0].priority).toBe('high');
      expect(result[0].text).toContain('未完了');
    });

    it('should return empty array when no tasks match filter', () => {
      const filter: TaskFilter = { 
        status: 'completed',
        priority: 'high' 
      };
      const result = filterTasks(sampleTasks, filter);

      expect(result).toHaveLength(0);
    });

    it('should handle empty tasks array', () => {
      const filter: TaskFilter = { status: 'all' };
      const result = filterTasks([], filter);

      expect(result).toHaveLength(0);
    });

    it('should handle tasks without optional fields', () => {
      const simpleTasks: Task[] = [
        {
          id: '1',
          text: 'シンプルタスク',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'medium'
        }
      ];

      const filter: TaskFilter = { status: 'all', category: 'work' };
      const result = filterTasks(simpleTasks, filter);

      expect(result).toHaveLength(0);
    });
  });
});