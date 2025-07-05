import { useMemo } from 'react';
import { Task } from '@/types/task';

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  completedByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  categoryBreakdown: Record<string, number>;
  tasksCreatedToday: number;
  tasksCompletedToday: number;
  averageTasksPerDay: number;
  longestStreak: number;
  currentStreak: number;
  overdueTasksCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  tasksWithoutDueDate: number;
}

export function useTaskStatistics(tasks: Task[]): TaskStatistics {
  return useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 基本統計
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // 優先度別統計
    const priorityBreakdown = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };

    const completedByPriority = {
      high: tasks.filter(task => task.completed && task.priority === 'high').length,
      medium: tasks.filter(task => task.completed && task.priority === 'medium').length,
      low: tasks.filter(task => task.completed && task.priority === 'low').length,
    };

    // カテゴリ別統計
    const categoryBreakdown: Record<string, number> = {};
    tasks.forEach(task => {
      if (task.category) {
        categoryBreakdown[task.category] = (categoryBreakdown[task.category] || 0) + 1;
      }
    });

    // 今日の統計
    const tasksCreatedToday = tasks.filter(task => 
      task.createdAt >= today
    ).length;

    const tasksCompletedToday = tasks.filter(task => 
      task.completed && task.updatedAt >= today
    ).length;

    // 平均タスク数（過去30日間）
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentTasks = tasks.filter(task => task.createdAt >= thirtyDaysAgo);
    const averageTasksPerDay = recentTasks.length / 30;

    // 連続完了日数の計算
    const completedTasksByDate = new Map<string, number>();
    
    tasks.filter(task => task.completed).forEach(task => {
      const dateKey = task.updatedAt.toDateString();
      completedTasksByDate.set(dateKey, (completedTasksByDate.get(dateKey) || 0) + 1);
    });

    // 現在の連続日数
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateKey = checkDate.toDateString();
      if (completedTasksByDate.has(dateKey) && completedTasksByDate.get(dateKey)! > 0) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    // 最長連続日数
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Array.from(completedTasksByDate.keys())
      .map(dateKey => new Date(dateKey))
      .sort((a, b) => a.getTime() - b.getTime());

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = sortedDates[i - 1];
        const currentDate = sortedDates[i];
        const diffDays = (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // 期限関連の統計
    const overdueTasksCount = tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < today && 
      !task.completed
    ).length;

    const dueTodayCount = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      return dueDateOnly.getTime() === today.getTime() && !task.completed;
    }).length;

    const dueThisWeekCount = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);
      return dueDate <= weekFromNow && dueDate >= today && !task.completed;
    }).length;

    const tasksWithoutDueDate = tasks.filter(task => !task.dueDate && !task.completed).length;

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      priorityBreakdown,
      completedByPriority,
      categoryBreakdown,
      tasksCreatedToday,
      tasksCompletedToday,
      averageTasksPerDay,
      longestStreak,
      currentStreak,
      overdueTasksCount,
      dueTodayCount,
      dueThisWeekCount,
      tasksWithoutDueDate,
    };
  }, [tasks]);
}