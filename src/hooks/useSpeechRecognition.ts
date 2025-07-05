import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Web Speech API の型定義
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
  addEventListener(type: 'start', listener: () => void): void;
  addEventListener(type: 'end', listener: () => void): void;
  removeEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  removeEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
  removeEventListener(type: 'start', listener: () => void): void;
  removeEventListener(type: 'end', listener: () => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ブラウザサポートの確認
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Speech Recognition の初期化
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';

    const handleResult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    const handleStart = () => {
      setIsListening(true);
      setError(null);
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('start', handleStart);
    recognition.addEventListener('end', handleEnd);

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.removeEventListener('result', handleResult);
        recognitionRef.current.removeEventListener('error', handleError);
        recognitionRef.current.removeEventListener('start', handleStart);
        recognitionRef.current.removeEventListener('end', handleEnd);
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('音声認識の開始に失敗しました');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      setError('音声認識の停止に失敗しました');
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}