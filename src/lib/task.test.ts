import { createTask, validateTask, toggleTaskComplete, updateTask } from './task';
import { Task } from '@/types/task';

describe('Task Model', () => {
  describe('createTask', () => {
    it('should create a task with required fields', () => {
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

  describe('toggleTaskComplete', () => {
    it('should toggle task from incomplete to complete', async () => {
      const originalTask: Task = {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      // 時間差を確保するため少し待つ
      await new Promise(resolve => setTimeout(resolve, 10));
      const updatedTask = toggleTaskComplete(originalTask);

      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalTask.updatedAt.getTime());
      expect(updatedTask.id).toBe(originalTask.id);
      expect(updatedTask.text).toBe(originalTask.text);
    });

    it('should toggle task from complete to incomplete', async () => {
      const originalTask: Task = {
        id: '1',
        text: 'テストタスク',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      // 時間差を確保するため少し待つ
      await new Promise(resolve => setTimeout(resolve, 10));
      const updatedTask = toggleTaskComplete(originalTask);

      expect(updatedTask.completed).toBe(false);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalTask.updatedAt.getTime());
    });

    it('should not mutate original task', () => {
      const originalTask: Task = {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      const updatedTask = toggleTaskComplete(originalTask);

      expect(originalTask.completed).toBe(false);
      expect(updatedTask).not.toBe(originalTask);
    });
  });

  describe('updateTask', () => {
    it('should update task text', async () => {
      const originalTask: Task = {
        id: '1',
        text: '元のタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      // 時間差を確保するため少し待つ
      await new Promise(resolve => setTimeout(resolve, 10));
      const newText = '更新されたタスク';
      const updatedTask = updateTask(originalTask, { text: newText });

      expect(updatedTask.text).toBe(newText);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalTask.updatedAt.getTime());
      expect(updatedTask.id).toBe(originalTask.id);
    });

    it('should update task priority', async () => {
      const originalTask: Task = {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      // 時間差を確保するため少し待つ
      await new Promise(resolve => setTimeout(resolve, 10));
      const newPriority = 'high';
      const updatedTask = updateTask(originalTask, { priority: newPriority });

      expect(updatedTask.priority).toBe(newPriority);
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalTask.updatedAt.getTime());
    });

    it('should not mutate original task', () => {
      const originalTask: Task = {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium'
      };

      const updatedTask = updateTask(originalTask, { text: '新しいテキスト' });

      expect(originalTask.text).toBe('テストタスク');
      expect(updatedTask).not.toBe(originalTask);
    });
  });
});