import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechRecognition } from './useSpeechRecognition';

// Mock Speech Recognition
const mockSpeechRecognition = {
  continuous: false,
  interimResults: false,
  lang: '',
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockSpeechRecognitionClass = vi.fn(() => mockSpeechRecognition);

describe('useSpeechRecognition', () => {
  let originalWindow: any;

  beforeEach(() => {
    originalWindow = global.window;
    
    Object.defineProperty(global, 'window', {
      value: {
        SpeechRecognition: mockSpeechRecognitionClass,
        webkitSpeechRecognition: undefined,
      },
      configurable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      configurable: true,
    });
  });

  test('should initialize with default values when supported', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    expect(result.current.isListening).toBe(false);
    expect(result.current.isSupported).toBe(true);
    expect(result.current.transcript).toBe('');
    expect(result.current.error).toBe(null);
  });

  test('should detect when speech recognition is not supported', () => {
    Object.defineProperty(global, 'window', {
      value: {},
      configurable: true,
    });

    const { result } = renderHook(() => useSpeechRecognition());
    
    expect(result.current.isSupported).toBe(false);
  });

  test('should setup speech recognition with correct configuration', () => {
    renderHook(() => useSpeechRecognition());
    
    expect(mockSpeechRecognitionClass).toHaveBeenCalled();
    expect(mockSpeechRecognition.continuous).toBe(true);
    expect(mockSpeechRecognition.interimResults).toBe(true);
    expect(mockSpeechRecognition.lang).toBe('ja-JP');
  });

  test('should add event listeners', () => {
    renderHook(() => useSpeechRecognition());
    
    expect(mockSpeechRecognition.addEventListener).toHaveBeenCalledWith('result', expect.any(Function));
    expect(mockSpeechRecognition.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockSpeechRecognition.addEventListener).toHaveBeenCalledWith('start', expect.any(Function));
    expect(mockSpeechRecognition.addEventListener).toHaveBeenCalledWith('end', expect.any(Function));
  });

  test('should start listening', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    act(() => {
      result.current.startListening();
    });
    
    expect(mockSpeechRecognition.start).toHaveBeenCalled();
  });

  test('should stop listening', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    // First start listening
    act(() => {
      result.current.startListening();
    });

    // Simulate start event
    const startHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'start'
    )[1];
    act(() => {
      startHandler();
    });
    
    // Then stop listening
    act(() => {
      result.current.stopListening();
    });
    
    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
  });

  test('should handle speech recognition results', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    const resultHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'result'
    )[1];
    
    const mockEvent = {
      resultIndex: 0,
      results: [{
        0: { transcript: 'テストメッセージ' },
        isFinal: true,
        length: 1,
      }],
      length: 1,
    };
    
    act(() => {
      resultHandler(mockEvent);
    });
    
    expect(result.current.transcript).toBe('テストメッセージ');
  });

  test('should handle interim results', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    const resultHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'result'
    )[1];
    
    const mockEvent = {
      resultIndex: 0,
      results: [{
        0: { transcript: '仮のテキスト' },
        isFinal: false,
        length: 1,
      }],
      length: 1,
    };
    
    act(() => {
      resultHandler(mockEvent);
    });
    
    expect(result.current.transcript).toBe('仮のテキスト');
  });

  test('should handle speech recognition errors', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    const errorHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'error'
    )[1];
    
    const mockErrorEvent = {
      error: 'no-speech',
      message: 'No speech detected',
    };
    
    act(() => {
      errorHandler(mockErrorEvent);
    });
    
    expect(result.current.error).toBe('no-speech');
    expect(result.current.isListening).toBe(false);
  });

  test('should handle start event', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    const startHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'start'
    )[1];
    
    act(() => {
      startHandler();
    });
    
    expect(result.current.isListening).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test('should handle end event', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    const endHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'end'
    )[1];
    
    act(() => {
      endHandler();
    });
    
    expect(result.current.isListening).toBe(false);
  });

  test('should reset transcript', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    // First set some transcript and error
    const resultHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'result'
    )[1];
    
    const mockEvent = {
      resultIndex: 0,
      results: [{
        0: { transcript: 'テストメッセージ' },
        isFinal: true,
        length: 1,
      }],
      length: 1,
    };
    
    act(() => {
      resultHandler(mockEvent);
    });
    
    // Then reset
    act(() => {
      result.current.resetTranscript();
    });
    
    expect(result.current.transcript).toBe('');
    expect(result.current.error).toBe(null);
  });

  test('should not start listening when already listening', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    // Start listening first
    act(() => {
      result.current.startListening();
    });

    // Simulate start event
    const startHandler = mockSpeechRecognition.addEventListener.mock.calls.find(
      call => call[0] === 'start'
    )[1];
    act(() => {
      startHandler();
    });
    
    // Clear the mock to count calls
    mockSpeechRecognition.start.mockClear();
    
    // Try to start again
    act(() => {
      result.current.startListening();
    });
    
    expect(mockSpeechRecognition.start).not.toHaveBeenCalled();
  });

  test('should not stop listening when not listening', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    
    act(() => {
      result.current.stopListening();
    });
    
    expect(mockSpeechRecognition.stop).not.toHaveBeenCalled();
  });

  test('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useSpeechRecognition());
    
    unmount();
    
    expect(mockSpeechRecognition.removeEventListener).toHaveBeenCalledWith('result', expect.any(Function));
    expect(mockSpeechRecognition.removeEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockSpeechRecognition.removeEventListener).toHaveBeenCalledWith('start', expect.any(Function));
    expect(mockSpeechRecognition.removeEventListener).toHaveBeenCalledWith('end', expect.any(Function));
  });
});