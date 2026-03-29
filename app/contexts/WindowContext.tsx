'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

export type AppType = 'terminal' | 'browser' | 'filemanager' | 'neovim' | 'settings' | 'pdfviewer' | 'email' | 'doom';

export interface Window {
  id: string;
  appType: AppType;
  title: string;
  workspace: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isClosing: boolean;
  // Data passed to the app (e.g., file content for Neovim)
  appData?: Record<string, unknown>;
}

interface WindowContextType {
  windows: Window[];
  activeWorkspace: number;
  focusedWindowId: string | null;
  showAppLauncher: boolean;
  
  // Window operations
  openWindow: (appType: AppType, title?: string, appData?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  
  // Workspace operations
  setActiveWorkspace: (workspace: number) => void;
  moveWindowToWorkspace: (windowId: string, workspace: number) => void;
  
  // App launcher
  toggleAppLauncher: () => void;
  closeAppLauncher: () => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

let windowCounter = 0;
let zIndexCounter = 1;

const DEFAULT_TITLES: Record<AppType, string> = {
  terminal: 'Terminal',
  browser: 'Browser — Portfolio',
  filemanager: 'Files',
  neovim: 'Code Editor',
  settings: 'Settings',
  pdfviewer: 'PDF Viewer',
  email: 'Email Dhruv',
  doom: 'DOOM',
};

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([
    // Initial windows on startup
    {
      id: 'window-init-terminal',
      appType: 'terminal',
      title: 'zsh — 80x24',
      workspace: 1,
      zIndex: 1,
      isMinimized: false,
      isMaximized: false,
      isClosing: false,
    },
    {
      id: 'window-init-browser',
      appType: 'browser',
      title: 'Browser — Portfolio',
      workspace: 1,
      zIndex: 2,
      isMinimized: false,
      isMaximized: false,
      isClosing: false,
    },
  ]);
  
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const lastFocusedPerWorkspace = useRef<Record<number, string | null>>({});
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>('window-init-browser');
  const [showAppLauncher, setShowAppLauncher] = useState(false);

  const openWindow = useCallback((appType: AppType, title?: string, appData?: Record<string, unknown>) => {
    windowCounter++;
    zIndexCounter++;
    
    const newWindow: Window = {
      id: `window-${windowCounter}-${Date.now()}`,
      appType,
      title: title || DEFAULT_TITLES[appType],
      workspace: activeWorkspace,
      zIndex: zIndexCounter,
      isMinimized: false,
      isMaximized: false,
      isClosing: false,
      appData,
    };
    
    setWindows(prev => [...prev, newWindow]);
    setFocusedWindowId(newWindow.id);
    setShowAppLauncher(false);
  }, [activeWorkspace]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isClosing: true } : w)
    );
    
    setTimeout(() => {
      setWindows(prev => {
        const remaining = prev.filter(w => w.id !== id);
        setFocusedWindowId(fid => {
          if (fid === id) {
            const candidates = remaining.filter(w => !w.isMinimized && !w.isClosing);
            if (candidates.length > 0) {
              return candidates.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id;
            }
            return null;
          }
          return fid;
        });
        return remaining;
      });
    }, 200);
  }, []);

  const focusWindow = useCallback((id: string) => {
    zIndexCounter++;
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter } : w)
    );
    setFocusedWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
    );
    setFocusedWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    );
  }, []);

  const switchWorkspace = useCallback((workspace: number) => {
    lastFocusedPerWorkspace.current[activeWorkspace] = focusedWindowId;

    setActiveWorkspace(workspace);

    setWindows(currentWindows => {
      const targetWindows = currentWindows.filter(
        w => w.workspace === workspace && !w.isMinimized && !w.isClosing
      );
      const remembered = lastFocusedPerWorkspace.current[workspace];
      if (remembered && targetWindows.some(w => w.id === remembered)) {
        setFocusedWindowId(remembered);
      } else if (targetWindows.length > 0) {
        const top = targetWindows.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
        setFocusedWindowId(top.id);
      } else {
        setFocusedWindowId(null);
      }
      return currentWindows;
    });
  }, [activeWorkspace, focusedWindowId]);

  const moveWindowToWorkspace = useCallback((windowId: string, workspace: number) => {
    setWindows(prev =>
      prev.map(w => w.id === windowId ? { ...w, workspace } : w)
    );
  }, []);

  const toggleAppLauncher = useCallback(() => {
    setShowAppLauncher(prev => !prev);
  }, []);

  const closeAppLauncher = useCallback(() => {
    setShowAppLauncher(false);
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        activeWorkspace,
        focusedWindowId,
        showAppLauncher,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        setActiveWorkspace: switchWorkspace,
        moveWindowToWorkspace,
        toggleAppLauncher,
        closeAppLauncher,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowProvider');
  }
  return context;
}
