'use client';

import { motion } from 'framer-motion';
import { Task } from '@/types/task';
import { useTaskStatistics } from '@/hooks/useTaskStatistics';

interface TaskStatisticsProps {
  tasks: Task[];
}

export function TaskStatistics({ tasks }: TaskStatisticsProps) {
  const stats = useTaskStatistics(tasks);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'blue',
    delay = 0 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    delay?: number;
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
    };

    return (
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        </div>
        <div>
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.2 }}
          >
            {value}
          </motion.h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  const ProgressBar = ({ 
    label, 
    current, 
    total, 
    color = 'blue',
    delay = 0 
  }: {
    label: string;
    current: number;
    total: number;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    delay?: number;
  }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    };

    return (
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {current}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${colorClasses[color]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        📊 タスク統計
      </motion.h2>

      {/* 基本統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="総タスク数"
          value={stats.totalTasks}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="blue"
          delay={0}
        />
        
        <StatCard
          title="完了済み"
          value={stats.completedTasks}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          delay={0.1}
        />
        
        <StatCard
          title="未完了"
          value={stats.activeTasks}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
          delay={0.2}
        />
        
        <StatCard
          title="完了率"
          value={`${stats.completionRate.toFixed(1)}%`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="purple"
          delay={0.3}
        />
      </div>

      {/* 今日の統計 */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          📅 今日の活動
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3, type: "spring" }}
            >
              {stats.tasksCreatedToday}
            </motion.div>
            <div className="text-sm text-gray-600 dark:text-gray-400">作成したタスク</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-green-600 dark:text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3, type: "spring" }}
            >
              {stats.tasksCompletedToday}
            </motion.div>
            <div className="text-sm text-gray-600 dark:text-gray-400">完了したタスク</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-purple-600 dark:text-purple-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3, type: "spring" }}
            >
              {stats.averageTasksPerDay.toFixed(1)}
            </motion.div>
            <div className="text-sm text-gray-600 dark:text-gray-400">1日平均（30日間）</div>
          </div>
        </div>
      </motion.div>

      {/* 優先度別統計 */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          🎯 優先度別進捗
        </h3>
        <ProgressBar
          label="高優先度"
          current={stats.completedByPriority.high}
          total={stats.priorityBreakdown.high}
          color="red"
          delay={0.6}
        />
        <ProgressBar
          label="中優先度"
          current={stats.completedByPriority.medium}
          total={stats.priorityBreakdown.medium}
          color="orange"
          delay={0.7}
        />
        <ProgressBar
          label="低優先度"
          current={stats.completedByPriority.low}
          total={stats.priorityBreakdown.low}
          color="green"
          delay={0.8}
        />
      </motion.div>

      {/* 連続記録 */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          🔥 連続記録
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold text-orange-600 dark:text-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3, type: "spring" }}
            >
              {stats.currentStreak}
            </motion.div>
            <div className="text-sm text-gray-600 dark:text-gray-400">現在の連続日数</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold text-red-600 dark:text-red-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 0.3, type: "spring" }}
            >
              {stats.longestStreak}
            </motion.div>
            <div className="text-sm text-gray-600 dark:text-gray-400">最長連続日数</div>
          </div>
        </div>
      </motion.div>

      {/* カテゴリ別統計 */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📂 カテゴリ別タスク数
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([category, count], index) => (
              <motion.div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.2 }}
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  📂 {category}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 期限関連統計 */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          ⏰ 期限管理
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-red-600 dark:text-red-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 0.3, type: "spring" }}
            >
              {stats.overdueTasksCount}
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">期限切れ</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-orange-600 dark:text-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, duration: 0.3, type: "spring" }}
            >
              {stats.dueTodayCount}
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">今日期限</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, duration: 0.3, type: "spring" }}
            >
              {stats.dueThisWeekCount}
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">今週期限</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-gray-600 dark:text-gray-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3, type: "spring" }}
            >
              {stats.tasksWithoutDueDate}
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400">期限なし</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}