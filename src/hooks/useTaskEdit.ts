import { useCallback, useState } from 'react';

export interface UseTaskEditReturn {
  editingTaskId: string | null;
  editingText: string;
  isEditing: boolean;
  startEditing: (taskId: string, text: string) => void;
  setEditingText: (text: string) => void;
  cancelEditing: () => void;
  saveEditing: (onSave: (taskId: string, text: string) => void) => void;
  isEditingTask: (taskId: string) => boolean;
}

export function useTaskEdit(): UseTaskEditReturn {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const startEditing = useCallback((taskId: string, text: string) => {
    setEditingTaskId(taskId);
    setEditingText(text);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingTaskId(null);
    setEditingText('');
  }, []);

  const saveEditing = useCallback(
    (onSave: (taskId: string, text: string) => void) => {
      if (editingTaskId && editingText.trim()) {
        onSave(editingTaskId, editingText.trim());
        setEditingTaskId(null);
        setEditingText('');
      }
    },
    [editingTaskId, editingText]
  );

  const isEditingTask = useCallback(
    (taskId: string) => {
      return editingTaskId === taskId;
    },
    [editingTaskId]
  );

  return {
    editingTaskId,
    editingText,
    isEditing: editingTaskId !== null,
    startEditing,
    setEditingText,
    cancelEditing,
    saveEditing,
    isEditingTask,
  };
}
