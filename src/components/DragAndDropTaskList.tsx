'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import type { Task } from '@/types/task';
import { SortableTaskItem } from './SortableTaskItem';

interface DragAndDropTaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  onTasksReorder: (tasks: Task[]) => void;
}

export function DragAndDropTaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onTasksReorder,
}: DragAndDropTaskListProps) {
  const {
    tasks: sortedTasks,
    activeId,
    handleDragStart,
    handleDragEnd,
  } = useDragAndDrop(tasks, onTasksReorder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (sortedTasks.length === 0) {
    return (
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          タスク一覧 (0)
        </h2>
        <motion.p
          className="text-gray-500 dark:text-gray-400 text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          まだタスクがありません。上のフォームから追加してください。
        </motion.p>
      </motion.div>
    );
  }

  const activeTask = sortedTasks.find((task) => task.id === activeId);

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        タスク一覧 ({sortedTasks.length})
      </motion.h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {sortedTasks.map((task, index) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                index={index}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </ul>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <motion.div
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg opacity-90"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="flex-1 text-gray-900 dark:text-gray-100">{activeTask.text}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activeTask.priority}
              </span>
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}
