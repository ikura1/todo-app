import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDarkMode } from './useDarkMode';

// localStorage のモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // document.documentElement.classList をモック
    const classList = {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    };
    Object.defineProperty(document.documentElement, 'classList', {
      value: classList,
      writable: true,
    });
  });

  it('should return default light mode when no stored preference', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(false);
    expect(typeof result.current.toggleDarkMode).toBe('function');
  });

  it('should return stored dark mode preference', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(true);
  });

  it('should return stored light mode preference', () => {
    localStorageMock.getItem.mockReturnValue('light');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(false);
  });

  it('should toggle dark mode and save to localStorage', () => {
    localStorageMock.getItem.mockReturnValue('light');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(false);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDarkMode).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should toggle light mode and save to localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(true);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDarkMode).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should apply dark class to document element when dark mode is enabled', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    renderHook(() => useDarkMode());

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('should remove dark class from document element when light mode is enabled', () => {
    localStorageMock.getItem.mockReturnValue('light');

    renderHook(() => useDarkMode());

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });

  it('should detect system preference when no stored preference', () => {
    localStorageMock.getItem.mockReturnValue(null);

    // システムがダークモードを設定
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(true);
  });
});
