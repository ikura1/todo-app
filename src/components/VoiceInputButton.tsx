'use client';

import { motion } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useEffect } from 'react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInputButton({ onTranscript, disabled = false }: VoiceInputButtonProps) {
  const {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // 音声認識結果をコールバックに渡す
  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative p-3 rounded-full border-2 transition-all duration-200 flex items-center justify-center
          ${isListening 
            ? 'bg-red-500 border-red-500 text-white shadow-lg' 
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        `}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{ duration: 0.1 }}
        animate={isListening ? {
          scale: [1, 1.1, 1],
          transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }
        } : {}}
        aria-label={isListening ? '音声入力を停止' : '音声入力を開始'}
      >
        {isListening ? (
          <motion.svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </motion.svg>
        ) : (
          <motion.svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
          </motion.svg>
        )}

        {/* 音声波形のアニメーション */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* トランスクリプト表示 */}
      {transcript && isListening && (
        <motion.div
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-48 text-center whitespace-nowrap overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          &quot;{transcript}&quot;
        </motion.div>
      )}

      {/* エラー表示 */}
      {error && (
        <motion.div
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-48 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          エラー: {error}
        </motion.div>
      )}

      {/* 使い方のヒント */}
      {!isListening && !error && (
        <motion.div
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          クリックして音声入力
        </motion.div>
      )}
    </div>
  );
}