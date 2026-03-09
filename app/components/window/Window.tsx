'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useWindowManager, AppType } from '../../contexts/WindowContext';

// Import apps
import Terminal from '../apps/Terminal';
import Browser from '../apps/Browser';
import FileManager from '../apps/FileManager';
import Neovim from '../apps/Neovim';
import Settings from '../apps/Settings';

interface WindowProps {
  id: string;
  appType: AppType;
  title: string;
  focused: boolean;
  isClosing: boolean;
  style: React.CSSProperties;
  bootDelay?: number;
}

const APP_COMPONENTS: Record<AppType, React.ComponentType> = {
  terminal: Terminal,
  browser: Browser,
  filemanager: FileManager,
  neovim: Neovim,
  settings: Settings,
};

export default function Window({ 
  id, 
  appType, 
  title, 
  focused, 
  isClosing,
  style,
  bootDelay = 0,
}: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow } = useWindowManager();

  // Track whether the initial enter animation has completed
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), (bootDelay * 1000) + 500);
    return () => clearTimeout(timer);
  }, [bootDelay]);

  const handleMouseDown = useCallback(() => {
    focusWindow(id);
  }, [focusWindow, id]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(id);
  }, [closeWindow, id]);

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  }, [minimizeWindow, id]);

  const handleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    maximizeWindow(id);
  }, [maximizeWindow, id]);

  // Only apply enter/boot animation on initial mount, not on every re-render
  const animationClass = isClosing
    ? 'window-exit'
    : !hasAnimated
      ? 'window-enter boot-animation'
      : '';

  // CRITICAL: Memoize the app content so it NEVER re-renders due to window
  // management state changes (focus, z-index, etc.). The app component
  // (Terminal, Browser, etc.) is only created once and the same React element
  // reference is reused on every subsequent render of Window.
  const appContent = useMemo(() => {
    const AppComponent = APP_COMPONENTS[appType];
    return <AppComponent />;
  }, [appType]);

  return (
    <div
      className={`window ${focused ? 'focused' : ''} ${animationClass}`}
      style={{
        ...style,
        animationDelay: !hasAnimated ? `${bootDelay}s` : undefined,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <div className="window-controls">
          <button 
            className="window-control close"
            onClick={handleClose}
            title="Close"
          >
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M3.5 3.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button 
            className="window-control minimize"
            onClick={handleMinimize}
            title="Minimize"
          >
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button 
            className="window-control maximize"
            onClick={handleMaximize}
            title="Maximize"
          >
            <svg viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>
        <div className="window-title">{title}</div>
        <div style={{ width: 52 }} /> {/* Spacer for centering */}
      </div>
      <div className="window-content">
        {appContent}
      </div>
    </div>
  );
}

