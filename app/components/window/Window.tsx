'use client';

import React from 'react';
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
  
  const AppComponent = APP_COMPONENTS[appType];

  const handleMouseDown = () => {
    if (!focused) {
      focusWindow(id);
    }
  };

  return (
    <div
      className={`window ${focused ? 'focused' : ''} ${isClosing ? 'window-exit' : 'window-enter'} boot-animation`}
      style={{
        ...style,
        animationDelay: `${bootDelay}s`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <div className="window-controls">
          <button 
            className="window-control close"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            title="Close"
          >
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M3.5 3.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button 
            className="window-control minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            title="Minimize"
          >
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button 
            className="window-control maximize"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
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
        <AppComponent />
      </div>
    </div>
  );
}
