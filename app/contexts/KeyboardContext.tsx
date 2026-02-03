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
      const modPressed = isMac ? e.metaKey : e.ctrlKey;
      const altPressed = e.altKey;
      const shiftPressed = e.shiftKey;
      
      // Create key identifier
      const keyId = `${modPressed ? 'mod+' : ''}${altPressed ? 'alt+' : ''}${shiftPressed ? 'shift+' : ''}${e.key.toLowerCase()}`;
      
      // Check custom shortcuts first
      if (customShortcuts[keyId]) {
        e.preventDefault();
        customShortcuts[keyId]();
        return;
      }

      // Built-in shortcuts
      
      // Mod + Enter: Open terminal
      if (modPressed && e.key === 'Enter') {
        e.preventDefault();
        windowManager.openWindow('terminal');
        return;
      }

      // Mod + W: Close focused window
      if (modPressed && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (windowManager.focusedWindowId) {
          windowManager.closeWindow(windowManager.focusedWindowId);
        }
        return;
      }

      // Mod + D or Alt + D: Toggle app launcher
      if ((modPressed || altPressed) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        windowManager.toggleAppLauncher();
        return;
      }

      // Escape: Close app launcher
      if (e.key === 'Escape') {
        if (windowManager.showAppLauncher) {
          e.preventDefault();
          windowManager.closeAppLauncher();
          return;
        }
      }

      // Workspace switching: Mod + 1-4 or Ctrl + 1-4
      if (modPressed && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        windowManager.setActiveWorkspace(parseInt(e.key));
        return;
      }

      // Alt + J/K: Focus next/prev window (vim-style)
      if (altPressed && (e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        const currentWindows = windowManager.windows.filter(
          w => w.workspace === windowManager.activeWorkspace && !w.isMinimized
        );
        
        if (currentWindows.length > 1) {
          const currentIndex = currentWindows.findIndex(
            w => w.id === windowManager.focusedWindowId
          );
          
          let nextIndex: number;
          if (e.key.toLowerCase() === 'j') {
            nextIndex = (currentIndex + 1) % currentWindows.length;
          } else {
            nextIndex = (currentIndex - 1 + currentWindows.length) % currentWindows.length;
          }
          
          windowManager.focusWindow(currentWindows[nextIndex].id);
        }
        return;
      }

      // F11: Toggle fullscreen of focused window
      if (e.key === 'F11') {
        e.preventDefault();
        if (windowManager.focusedWindowId) {
          windowManager.maximizeWindow(windowManager.focusedWindowId);
        }
        return;
      }

      // Quick app launchers
      const appShortcuts: Record<string, AppType> = {
        't': 'terminal',
        'b': 'browser',
        'f': 'filemanager',
        'e': 'neovim',
        's': 'settings',
      };

      if (altPressed && shiftPressed && appShortcuts[e.key.toLowerCase()]) {
        e.preventDefault();
        windowManager.openWindow(appShortcuts[e.key.toLowerCase()]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
