import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VoiceInputButton } from './VoiceInputButton';

// Mock the useSpeechRecognition hook
const mockUseSpeechRecognition = {
  isListening: false,
  isSupported: true,
  transcript: '',
  error: null,
  startListening: vi.fn(),
  stopListening: vi.fn(),
  resetTranscript: vi.fn(),
};

vi.mock('../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => mockUseSpeechRecognition,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, disabled, ...props }: any) => (
      <button className={className} onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    svg: ({ children, className, viewBox, ...props }: any) => (
      <svg className={className} viewBox={viewBox} {...props}>
        {children}
      </svg>
    ),
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('VoiceInputButton', () => {
  const mockOnTranscript = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSpeechRecognition.isListening = false;
    mockUseSpeechRecognition.isSupported = true;
    mockUseSpeechRecognition.transcript = '';
    mockUseSpeechRecognition.error = null;
  });

  test('renders voice input button when supported', () => {
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', '音声入力を開始');
  });

  test('does not render when speech recognition is not supported', () => {
    mockUseSpeechRecognition.isSupported = false;
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('starts listening when clicked and not listening', () => {
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockUseSpeechRecognition.startListening).toHaveBeenCalled();
  });

  test('stops listening when clicked while listening', () => {
    mockUseSpeechRecognition.isListening = true;
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', '音声入力を停止');
    
    fireEvent.click(button);
    
    expect(mockUseSpeechRecognition.stopListening).toHaveBeenCalled();
  });

  test('displays different icon when listening', () => {
    mockUseSpeechRecognition.isListening = true;
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');
  });

  test('shows transcript when listening and transcript is available', () => {
    mockUseSpeechRecognition.isListening = true;
    mockUseSpeechRecognition.transcript = 'テストの音声入力';
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    expect(screen.getByText('"テストの音声入力"')).toBeInTheDocument();
  });

  test('shows error message when error occurs', () => {
    mockUseSpeechRecognition.error = 'no-speech';
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    expect(screen.getByText('エラー: no-speech')).toBeInTheDocument();
  });

  test('calls onTranscript when transcript is available and not listening', () => {
    mockUseSpeechRecognition.transcript = 'テストの音声入力';
    mockUseSpeechRecognition.isListening = false;
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    expect(mockOnTranscript).toHaveBeenCalledWith('テストの音声入力');
    expect(mockUseSpeechRecognition.resetTranscript).toHaveBeenCalled();
  });

  test('does not call onTranscript when still listening', () => {
    mockUseSpeechRecognition.transcript = 'テストの音声入力';
    mockUseSpeechRecognition.isListening = true;
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    expect(mockOnTranscript).not.toHaveBeenCalled();
  });

  test('is disabled when disabled prop is true', () => {
    render(<VoiceInputButton onTranscript={mockOnTranscript} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('does not start listening when disabled and clicked', () => {
    render(<VoiceInputButton onTranscript={mockOnTranscript} disabled={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockUseSpeechRecognition.startListening).not.toHaveBeenCalled();
  });

  test('applies correct CSS classes when listening', () => {
    mockUseSpeechRecognition.isListening = true;
    
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500', 'border-red-500', 'text-white', 'shadow-lg');
  });

  test('applies correct CSS classes when not listening', () => {
    render(<VoiceInputButton onTranscript={mockOnTranscript} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white', 'dark:bg-gray-700', 'border-gray-300');
  });

  test('applies disabled styles when disabled', () => {
    render(<VoiceInputButton onTranscript={mockOnTranscript} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });
});