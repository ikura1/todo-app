import { saveTasksToStorage, loadTasksFromStorage, STORAGE_KEY } from './storage';
import { createTask } from './task';
import { Task } from '@/types/task';

// localStorage のモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// global オブジェクトに localStorage を設定
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('saveTasksToStorage', () => {
    it('should save tasks to localStorage', () => {
      const tasks: Task[] = [
        createTask('テストタスク1'),
        createTask('テストタスク2'),
      ];

      saveTasksToStorage(tasks);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    });

    it('should save empty array to localStorage', () => {
      const tasks: Task[] = [];

      saveTasksToStorage(tasks);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    });

    it('should handle localStorage errors gracefully', () => {
      const tasks: Task[] = [createTask('テストタスク')];
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // エラーが投げられないことを確認
      expect(() => saveTasksToStorage(tasks)).not.toThrow();
    });
  });

  describe('loadTasksFromStorage', () => {
    it('should load tasks from localStorage', () => {
      const tasks: Task[] = [
        createTask('テストタスク1'),
        createTask('テストタスク2'),
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(tasks));

      const loadedTasks = loadTasksFromStorage();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(loadedTasks).toEqual(tasks);
    });

    it('should return empty array when no data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const loadedTasks = loadTasksFromStorage();

      expect(loadedTasks).toEqual([]);
    });

    it('should return empty array when localStorage data is invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const loadedTasks = loadTasksFromStorage();

      expect(loadedTasks).toEqual([]);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const loadedTasks = loadTasksFromStorage();

      expect(loadedTasks).toEqual([]);
    });

    it('should restore Date objects correctly', () => {
      const originalTask = createTask('テストタスク');
      const tasksWithDates = [originalTask];
      
      // JSON.stringify で Date が文字列になることをシミュレート
      const serializedTasks = JSON.stringify(tasksWithDates);
      localStorageMock.getItem.mockReturnValue(serializedTasks);

      const loadedTasks = loadTasksFromStorage();

      expect(loadedTasks[0].createdAt).toBeInstanceOf(Date);
      expect(loadedTasks[0].updatedAt).toBeInstanceOf(Date);
    });
  });
});