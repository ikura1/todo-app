import { useState, useEffect } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task } from '@/types/task';

export interface UseDragAndDropReturn {
  tasks: Task[];
  activeId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

export function useDragAndDrop(
  initialTasks: Task[],
  onTasksChange?: (tasks: Task[]) => void
): UseDragAndDropReturn {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  // タスクが外部から変更された場合の同期
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex(task => task.id === active.id);
    const newIndex = tasks.findIndex(task => task.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
      onTasksChange?.(newTasks);
    }
  };

  return {
    tasks,
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}