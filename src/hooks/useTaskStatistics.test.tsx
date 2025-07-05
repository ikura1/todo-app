import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { createTask } from '@/lib/task';
import type { Task } from '@/types/task';
import { useTaskStatistics } from './useTaskStatistics';

describe('useTaskStatistics', () => {
  const createTaskWithDate = (
    text: string,
    completed: boolean,
    priority: 'high' | 'medium' | 'low',
    daysAgo: number = 0
  ): Task => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      ...createTask(text, { priority }),
      completed,
      createdAt: date,
      updatedAt: date,
    };
  };

  test('should calculate basic statistics correctly', () => {
    const tasks: Task[] = [
      createTaskWithDate('Task 1', true, 'high'),
      createTaskWithDate('Task 2', false, 'medium'),
      createTaskWithDate('Task 3', true, 'low'),
      createTaskWithDate('Task 4', false, 'high'),
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.totalTasks).toBe(4);
    expect(result.current.completedTasks).toBe(2);
    expect(result.current.activeTasks).toBe(2);
    expect(result.current.completionRate).toBe(50);
  });

  test('should calculate priority breakdown correctly', () => {
    const tasks: Task[] = [
      createTaskWithDate('Task 1', true, 'high'),
      createTaskWithDate('Task 2', false, 'high'),
      createTaskWithDate('Task 3', true, 'medium'),
      createTaskWithDate('Task 4', false, 'medium'),
      createTaskWithDate('Task 5', true, 'low'),
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.priorityBreakdown).toEqual({
      high: 2,
      medium: 2,
      low: 1,
    });

    expect(result.current.completedByPriority).toEqual({
      high: 1,
      medium: 1,
      low: 1,
    });
  });

  test('should calculate today statistics correctly', () => {
    const tasks: Task[] = [
      createTaskWithDate('Today task 1', true, 'high', 0), // Today
      createTaskWithDate('Today task 2', false, 'medium', 0), // Today
      createTaskWithDate('Yesterday task', true, 'low', 1), // Yesterday
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.tasksCreatedToday).toBe(2);
    expect(result.current.tasksCompletedToday).toBe(1);
  });

  test('should calculate average tasks per day correctly', () => {
    const tasks: Task[] = [
      createTaskWithDate('Task 1', false, 'high', 0),
      createTaskWithDate('Task 2', false, 'medium', 5),
      createTaskWithDate('Task 3', false, 'low', 10),
      createTaskWithDate('Task 4', false, 'high', 40), // Outside 30-day window
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    // 3 tasks in 30 days = 0.1 tasks per day
    expect(result.current.averageTasksPerDay).toBeCloseTo(0.1, 1);
  });

  test('should handle empty task list', () => {
    const tasks: Task[] = [];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.totalTasks).toBe(0);
    expect(result.current.completedTasks).toBe(0);
    expect(result.current.activeTasks).toBe(0);
    expect(result.current.completionRate).toBe(0);
    expect(result.current.tasksCreatedToday).toBe(0);
    expect(result.current.tasksCompletedToday).toBe(0);
    expect(result.current.averageTasksPerDay).toBe(0);
    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
  });

  test('should calculate current streak correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const tasks: Task[] = [
      {
        ...createTask('Today task', { priority: 'high' }),
        completed: true,
        createdAt: today,
        updatedAt: today,
      },
      {
        ...createTask('Yesterday task', { priority: 'medium' }),
        completed: true,
        createdAt: yesterday,
        updatedAt: yesterday,
      },
      {
        ...createTask('Two days ago task', { priority: 'low' }),
        completed: true,
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },
      // Skip day 3
      {
        ...createTask('Four days ago task', { priority: 'high' }),
        completed: true,
        createdAt: fourDaysAgo,
        updatedAt: fourDaysAgo,
      },
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    // Current streak should be 3 (today, yesterday, two days ago)
    expect(result.current.currentStreak).toBe(3);
  });

  test('should calculate longest streak correctly', () => {
    const createTaskOnDate = (daysAgo: number): Task => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return {
        ...createTask(`Task ${daysAgo} days ago`, { priority: 'medium' }),
        completed: true,
        createdAt: date,
        updatedAt: date,
      };
    };

    const tasks: Task[] = [
      // Streak 1: 3 consecutive days (days 0, 1, 2)
      createTaskOnDate(0),
      createTaskOnDate(1),
      createTaskOnDate(2),
      // Gap (day 3)
      // Streak 2: 4 consecutive days (days 4, 5, 6, 7) - longest
      createTaskOnDate(4),
      createTaskOnDate(5),
      createTaskOnDate(6),
      createTaskOnDate(7),
      // Gap (day 8)
      // Streak 3: 2 consecutive days (days 9, 10)
      createTaskOnDate(9),
      createTaskOnDate(10),
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.longestStreak).toBe(4);
    expect(result.current.currentStreak).toBe(3); // Current streak from today
  });

  test('should handle streak calculation with no completed tasks', () => {
    const tasks: Task[] = [
      createTaskWithDate('Incomplete task 1', false, 'high'),
      createTaskWithDate('Incomplete task 2', false, 'medium'),
    ];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
  });

  test('should handle single day completion', () => {
    const tasks: Task[] = [createTaskWithDate('Single completed task', true, 'high')];

    const { result } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.currentStreak).toBe(1);
    expect(result.current.longestStreak).toBe(1);
  });

  test('should update statistics when tasks change', () => {
    let tasks: Task[] = [createTaskWithDate('Task 1', false, 'high')];

    const { result, rerender } = renderHook(() => useTaskStatistics(tasks));

    expect(result.current.totalTasks).toBe(1);
    expect(result.current.completedTasks).toBe(0);

    // Add a completed task
    tasks = [...tasks, createTaskWithDate('Task 2', true, 'medium')];

    rerender();

    expect(result.current.totalTasks).toBe(2);
    expect(result.current.completedTasks).toBe(1);
    expect(result.current.completionRate).toBe(50);
  });
});
