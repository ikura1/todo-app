import { createTask, validateTask } from './task';
import { Task } from '@/types/task';

describe('Task Model', () => {
  describe('createTask', () => {
    it('should create a task with required fields', () => {
      // Red: 失敗するテストを書く
      const taskText = 'テストタスク';
      const task = createTask(taskText);

      expect(task.id).toBeDefined();
      expect(task.text).toBe(taskText);
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(task.priority).toBe('medium');
    });

    it('should create a task with custom priority', () => {
      const taskText = 'テストタスク';
      const priority = 'high';
      const task = createTask(taskText, { priority });

      expect(task.priority).toBe(priority);
    });

    it('should create a task with category and tags', () => {
      const taskText = 'テストタスク';
      const category = 'work';
      const tags = ['urgent', 'important'];
      const task = createTask(taskText, { category, tags });

      expect(task.category).toBe(category);
      expect(task.tags).toEqual(tags);
    });

    it('should generate unique IDs for different tasks', () => {
      const task1 = createTask('タスク1');
      const task2 = createTask('タスク2');

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('validateTask', () => {
    it('should validate a valid task', () => {
      const validTask: Task = {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      expect(validateTask(validTask)).toBe(true);
    });

    it('should reject task with empty text', () => {
      const invalidTask: Task = {
        id: '1',
        text: '',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      expect(validateTask(invalidTask)).toBe(false);
    });

    it('should reject task with invalid priority', () => {
      const invalidTask = {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'invalid'
      } as unknown as Task;

      expect(validateTask(invalidTask)).toBe(false);
    });
  });
});