import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskEdit } from './useTaskEdit';

describe('useTaskEdit', () => {
  test('should initialize with no task being edited', () => {
    const { result } = renderHook(() => useTaskEdit());
    
    expect(result.current.editingTaskId).toBe(null);
    expect(result.current.editingText).toBe('');
    expect(result.current.isEditing).toBe(false);
  });

  test('should start editing a task', () => {
    const { result } = renderHook(() => useTaskEdit());
    
    act(() => {
      result.current.startEditing('task-1', 'タスクのテキスト');
    });
    
    expect(result.current.editingTaskId).toBe('task-1');
    expect(result.current.editingText).toBe('タスクのテキスト');
    expect(result.current.isEditing).toBe(true);
  });

  test('should update editing text', () => {
    const { result } = renderHook(() => useTaskEdit());
    
    act(() => {
      result.current.startEditing('task-1', 'タスクのテキスト');
    });
    
    act(() => {
      result.current.setEditingText('更新されたテキスト');
    });
    
    expect(result.current.editingText).toBe('更新されたテキスト');
  });

  test('should cancel editing', () => {
    const { result } = renderHook(() => useTaskEdit());
    
    act(() => {
      result.current.startEditing('task-1', 'タスクのテキスト');
    });
    
    act(() => {
      result.current.cancelEditing();
    });
    
    expect(result.current.editingTaskId).toBe(null);
    expect(result.current.editingText).toBe('');
    expect(result.current.isEditing).toBe(false);
  });

  test('should save editing with callback', () => {
    const mockOnSave = vi.fn();
    const { result } = renderHook(() => useTaskEdit());
    
    act(() => {
      result.current.startEditing('task-1', 'タスクのテキスト');
    });
    
    act(() => {
      result.current.setEditingText('更新されたテキスト');
    });
    
    act(() => {
      result.current.saveEditing(mockOnSave);
    });
    
    expect(mockOnSave).toHaveBeenCalledWith('task-1', '更新されたテキスト');
    expect(result.current.editingTaskId).toBe(null);
    expect(result.current.editingText).toBe('');
    expect(result.current.isEditing).toBe(false);
  });

  test('should not save if text is empty', () => {
    const mockOnSave = vi.fn();
    const { result } = renderHook(() => useTaskEdit());
    
    act(() => {
      result.current.startEditing('task-1', 'タスクのテキスト');
    });
    
    act(() => {
      result.current.setEditingText('   ');
    });
    
    act(() => {
      result.current.saveEditing(mockOnSave);
    });
    
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(true);
  });

  test('should check if specific task is being edited', () => {
    const { result } = renderHook(() => useTaskEdit());
    
    act(() => {
      result.current.startEditing('task-1', 'タスクのテキスト');
    });
    
    expect(result.current.isEditingTask('task-1')).toBe(true);
    expect(result.current.isEditingTask('task-2')).toBe(false);
  });
});