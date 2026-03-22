'use client';

import React, { createContext, useContext, useEffect, useCallback, ReactNode, useState } from 'react';
import { useWindowManager, AppType } from './WindowContext';

interface KeyboardContextType {
  isMac: boolean;
  modKey: string;
  registerShortcut: (key: string, handler: () => void) => void;
  unregisterShortcut: (key: string) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

// Detect Mac vs other platforms
const detectMac = () => {
  if (typeof window === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [isMac, setIsMac] = useState(false);
  const windowManager = useWindowManager();
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, () => void>>({});

  useEffect(() => {
    setIsMac(detectMac());
  }, []);

  const modKey = isMac ? '⌘' : 'Ctrl';

  const registerShortcut = useCallback((key: string, handler: () => void) => {
    setCustomShortcuts(prev => ({ ...prev, [key]: handler }));
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setCustomShortcuts(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const altPressed = e.altKey;
      const shiftPressed = e.shiftKey;
      const rawKey = typeof e.key === 'string' ? e.key : '';
      const normalizedKey = rawKey.toLowerCase();
      
      // Create key identifier for custom shortcuts
      const modPressed = isMac ? e.metaKey : e.ctrlKey;
      const keyId = `${modPressed ? 'mod+' : ''}${altPressed ? 'alt+' : ''}${shiftPressed ? 'shift+' : ''}${normalizedKey}`;
      
      // Check custom shortcuts first
      if (customShortcuts[keyId]) {
        e.preventDefault();
        customShortcuts[keyId]();
        return;
      }

      // All shortcuts use Alt to avoid conflicting with browser shortcuts
      if (!altPressed) return;

      const key = normalizedKey;

      // Escape: Close app launcher (works without Alt too)
      if (rawKey === 'Escape') {
        if (windowManager.showAppLauncher) {
          e.preventDefault();
          windowManager.closeAppLauncher();
          return;
        }
      }

      // Alt + Enter: Open terminal
      if (rawKey === 'Enter') {
        e.preventDefault();
        windowManager.openWindow('terminal');
        return;
      }

      // Alt + W: Close focused window
      if (key === 'w') {
        e.preventDefault();
        if (windowManager.focusedWindowId) {
          windowManager.closeWindow(windowManager.focusedWindowId);
        }
        return;
      }

      // Alt + K: Toggle app launcher (recommended, avoids Alt+Space browser/system capture)
      // Alt + Space remains as a fallback for users who are used to it.
      if (key === 'k' || rawKey === ' ') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('tutorial-launcher-open-shortcut'));
        windowManager.toggleAppLauncher();
        return;
      }

      // Alt + B: Open browser
      if (key === 'b') {
        e.preventDefault();
        windowManager.openWindow('browser');
        return;
      }

      // Alt + F: Open file manager
      if (key === 'f') {
        e.preventDefault();
        windowManager.openWindow('filemanager');
        return;
      }

      // Alt + N: Open neovim
      if (key === 'n') {
        e.preventDefault();
        windowManager.openWindow('neovim');
        return;
      }

      // Alt + E: Open email app
      if (key === 'e') {
        e.preventDefault();
        windowManager.openWindow('email');
        return;
      }

      // Alt + S: Open settings
      if (key === 's') {
        e.preventDefault();
        windowManager.openWindow('settings');
        return;
      }

      // Alt + M: Toggle maximize/fullscreen
      if (key === 'm') {
        e.preventDefault();
        if (windowManager.focusedWindowId) {
          windowManager.maximizeWindow(windowManager.focusedWindowId);
        }
        return;
      }

      // Alt + J/K: Focus next/prev window (vim-style)
      if (key === 'j' || key === 'k') {
        e.preventDefault();
        const currentWindows = windowManager.windows.filter(
          w => w.workspace === windowManager.activeWorkspace && !w.isMinimized
        );
        
        if (currentWindows.length > 1) {
          const currentIndex = currentWindows.findIndex(
            w => w.id === windowManager.focusedWindowId
          );
          
          let nextIndex: number;
          if (key === 'j') {
            nextIndex = (currentIndex + 1) % currentWindows.length;
          } else {
            nextIndex = (currentIndex - 1 + currentWindows.length) % currentWindows.length;
          }
          
          windowManager.focusWindow(currentWindows[nextIndex].id);
        }
        return;
      }

      // Alt + 1-4: Switch workspace
      if (['1', '2', '3', '4'].includes(rawKey)) {
        e.preventDefault();
        windowManager.setActiveWorkspace(parseInt(rawKey, 10));
        return;
      }
    };

    // Escape handler (works without Alt)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && windowManager.showAppLauncher) {
        e.preventDefault();
        windowManager.closeAppLauncher();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMac, windowManager, customShortcuts]);

  return (
    <KeyboardContext.Provider
      value={{
        isMac,
        modKey,
        registerShortcut,
        unregisterShortcut,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within KeyboardProvider');
  }
  return context;
}
