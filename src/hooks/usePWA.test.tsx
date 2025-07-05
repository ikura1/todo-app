import { renderHook, act } from '@testing-library/react';
import { usePWA } from './usePWA';

// Create a more comprehensive mock for testing
const createMockEnvironment = () => {
  const mockMatchMedia = jest.fn(() => ({ matches: false }));
  const mockServiceWorker = {
    register: jest.fn().mockResolvedValue({ scope: '/' }),
  };
  const mockNavigator = {
    onLine: true,
    serviceWorker: mockServiceWorker,
  };
  
  const eventListeners: { [key: string]: Function[] } = {};
  const mockWindow = {
    addEventListener: jest.fn((event: string, handler: Function) => {
      if (!eventListeners[event]) eventListeners[event] = [];
      eventListeners[event].push(handler);
    }),
    removeEventListener: jest.fn((event: string, handler: Function) => {
      if (eventListeners[event]) {
        const index = eventListeners[event].indexOf(handler);
        if (index > -1) eventListeners[event].splice(index, 1);
      }
    }),
    matchMedia: mockMatchMedia,
    triggerEvent: (event: string, data?: any) => {
      if (eventListeners[event]) {
        eventListeners[event].forEach(handler => handler(data));
      }
    },
  };

  return {
    mockNavigator,
    mockWindow,
    mockMatchMedia,
    mockServiceWorker,
    eventListeners,
  };
};

describe('usePWA', () => {
  let mockEnv: ReturnType<typeof createMockEnvironment>;
  let originalNavigator: any;

  beforeEach(() => {
    mockEnv = createMockEnvironment();
    originalNavigator = global.navigator;
    
    // Mock navigator
    Object.defineProperty(global, 'navigator', {
      value: mockEnv.mockNavigator,
      configurable: true,
    });
    
    // Mock window functions
    global.window = mockEnv.mockWindow as any;
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isOnline).toBe(true);
    expect(result.current.deferredPrompt).toBe(null);
  });

  test('should register service worker', () => {
    renderHook(() => usePWA());
    
    expect(mockEnv.mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
  });

  test('should detect standalone mode', () => {
    mockEnv.mockMatchMedia.mockReturnValue({ matches: true });
    
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isInstalled).toBe(true);
  });

  test('should set up event listeners', () => {
    renderHook(() => usePWA());
    
    expect(mockEnv.mockWindow.addEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(mockEnv.mockWindow.addEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function));
    expect(mockEnv.mockWindow.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(mockEnv.mockWindow.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  test('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => usePWA());
    
    unmount();
    
    expect(mockEnv.mockWindow.removeEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(mockEnv.mockWindow.removeEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function));
    expect(mockEnv.mockWindow.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(mockEnv.mockWindow.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  test('should handle beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWA());
    
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    };
    
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('beforeinstallprompt', mockEvent);
    });
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(true);
    expect(result.current.deferredPrompt).toBe(mockEvent);
  });

  test('should handle appinstalled event', () => {
    const { result } = renderHook(() => usePWA());
    
    // First set up an install prompt
    const mockEvent = {
      preventDefault: jest.fn(),
    };
    
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('beforeinstallprompt', mockEvent);
    });
    
    // Then simulate app installed
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('appinstalled');
    });
    
    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.deferredPrompt).toBe(null);
  });

  test('should handle online/offline events', () => {
    const { result } = renderHook(() => usePWA());
    
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('offline');
    });
    
    expect(result.current.isOnline).toBe(false);
    
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('online');
    });
    
    expect(result.current.isOnline).toBe(true);
  });

  test('should install app when prompt accepted', async () => {
    const { result } = renderHook(() => usePWA());
    
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    };
    
    // Set up deferred prompt
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('beforeinstallprompt', mockEvent);
    });
    
    // Install app
    await act(async () => {
      await result.current.installApp();
    });
    
    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(result.current.isInstalled).toBe(true);
    expect(result.current.deferredPrompt).toBe(null);
    expect(result.current.isInstallable).toBe(false);
  });

  test('should handle install app when prompt dismissed', async () => {
    const { result } = renderHook(() => usePWA());
    
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
    };
    
    // Set up deferred prompt
    act(() => {
      (mockEnv.mockWindow as any).triggerEvent('beforeinstallprompt', mockEvent);
    });
    
    // Install app
    await act(async () => {
      await result.current.installApp();
    });
    
    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.deferredPrompt).toBe(null);
    expect(result.current.isInstallable).toBe(false);
  });

  test('should not install app when no deferred prompt', async () => {
    const { result } = renderHook(() => usePWA());
    
    await act(async () => {
      await result.current.installApp();
    });
    
    expect(result.current.isInstalled).toBe(false);
  });

  test('should handle service worker registration failure gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    mockEnv.mockServiceWorker.register.mockRejectedValue(new Error('Registration failed'));
    
    renderHook(() => usePWA());
    
    // Should not throw an error
    expect(consoleSpy).toHaveBeenCalledWith('Service Worker registration failed:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});