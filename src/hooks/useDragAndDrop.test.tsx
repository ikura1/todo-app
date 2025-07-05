import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from './useDragAndDrop';
import { Task } from '@/types/task';
import { createTask } from '@/lib/task';

describe('useDragAndDrop', () => {
  const mockTasks: Task[] = [
    createTask('タスク1', { priority: 'high' }),
    createTask('タスク2', { priority: 'medium' }),
    createTask('タスク3', { priority: 'low' }),
  ];

  test('should initialize with provided tasks', () => {
    const { result } = renderHook(() => useDragAndDrop(mockTasks));
    
    expect(result.current.tasks).toEqual(mockTasks);
  });

  test('should handle drag end with reordering', () => {
    const mockOnTasksChange = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(mockTasks, mockOnTasksChange));
    
    const dragEndEvent = {
      active: { id: mockTasks[0].id },
      over: { id: mockTasks[2].id },
    };
    
    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });
    
    expect(mockOnTasksChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ text: 'タスク2' }),
        expect.objectContaining({ text: 'タスク3' }),
        expect.objectContaining({ text: 'タスク1' }),
      ])
    );
  });

  test('should not reorder if dropped on same position', () => {
    const mockOnTasksChange = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(mockTasks, mockOnTasksChange));
    
    const dragEndEvent = {
      active: { id: mockTasks[0].id },
      over: { id: mockTasks[0].id },
    };
    
    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });
    
    expect(mockOnTasksChange).not.toHaveBeenCalled();
  });

  test('should not reorder if no drop target', () => {
    const mockOnTasksChange = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(mockTasks, mockOnTasksChange));
    
    const dragEndEvent = {
      active: { id: mockTasks[0].id },
      over: null,
    };
    
    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });
    
    expect(mockOnTasksChange).not.toHaveBeenCalled();
  });

  test('should handle drag start', () => {
    const { result } = renderHook(() => useDragAndDrop(mockTasks));
    
    const dragStartEvent = {
      active: { id: mockTasks[0].id },
    };
    
    act(() => {
      result.current.handleDragStart(dragStartEvent);
    });
    
    expect(result.current.activeId).toBe(mockTasks[0].id);
  });

  test('should clear active id on drag end', () => {
    const { result } = renderHook(() => useDragAndDrop(mockTasks));
    
    const dragStartEvent = {
      active: { id: mockTasks[0].id },
    };
    
    act(() => {
      result.current.handleDragStart(dragStartEvent);
    });
    
    expect(result.current.activeId).toBe(mockTasks[0].id);
    
    const dragEndEvent = {
      active: { id: mockTasks[0].id },
      over: null,
    };
    
    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });
    
    expect(result.current.activeId).toBe(null);
  });

  test('should update tasks when props change', () => {
    const { result, rerender } = renderHook(
      (props) => useDragAndDrop(props.tasks, props.onTasksChange),
      {
        initialProps: { tasks: mockTasks, onTasksChange: vi.fn() }
      }
    );
    
    const newTasks = [createTask('新しいタスク')];
    
    rerender({ tasks: newTasks, onTasksChange: vi.fn() });
    
    expect(result.current.tasks).toEqual(newTasks);
  });

  test('should correctly reorder tasks from different positions', () => {
    const mockOnTasksChange = vi.fn();
    const { result } = renderHook(() => useDragAndDrop(mockTasks, mockOnTasksChange));
    
    // Move first task to middle
    const dragEndEvent = {
      active: { id: mockTasks[0].id },
      over: { id: mockTasks[1].id },
    };
    
    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });
    
    expect(mockOnTasksChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ text: 'タスク2' }),
        expect.objectContaining({ text: 'タスク1' }),
        expect.objectContaining({ text: 'タスク3' }),
      ])
    );
  });
});