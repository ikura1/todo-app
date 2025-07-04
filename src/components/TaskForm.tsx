'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, isLoading = false }: TaskFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === '') {
      return;
    }

    onSubmit(text.trim());
    setText('');
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="flex gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを入力..."
        disabled={isLoading}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        whileFocus={{ 
          scale: 1.02,
          borderColor: "#3b82f6",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
        }}
        transition={{ duration: 0.1 }}
      />
      <motion.button
        type="submit"
        disabled={isLoading || text.trim() === ''}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ 
          scale: 1.05,
          backgroundColor: "#2563eb",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        animate={isLoading ? { 
          scale: [1, 1.02, 1],
          transition: { 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }
        } : {}}
      >
        <motion.span
          animate={isLoading ? {
            opacity: [1, 0.5, 1],
            transition: {
              repeat: Infinity,
              duration: 1,
              ease: "easeInOut"
            }
          } : { opacity: 1 }}
        >
          {isLoading ? '追加中...' : '追加'}
        </motion.span>
      </motion.button>
    </motion.form>
  );
}