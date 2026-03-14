'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useWindowManager, AppType } from '../../contexts/WindowContext';

// Import apps
import Terminal from '../apps/Terminal';
import Browser from '../apps/Browser';
import FileManager from '../apps/FileManager';
import Neovim from '../apps/Neovim';
import Settings from '../apps/Settings';
import PDFViewer from '../apps/PDFViewer';

interface WindowProps {
  id: string;
  appType: AppType;
  title: string;
  focused: boolean;
  isClosing: boolean;
  style: React.CSSProperties;
  bootDelay?: number;
  appData?: Record<string, unknown>;
}

export default function Window({ 
  id, 
  appType, 
  title, 
  focused, 
  isClosing,
  style,
  bootDelay = 0,
  appData,
}: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow } = useWindowManager();

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

  const animationClass = isClosing
    ? 'window-exit'
    : !hasAnimated
      ? 'window-enter boot-animation'
      : '';

  // Memoize app content, but include appData for Neovim file passing
  const appContent = useMemo(() => {
    switch (appType) {
      case 'terminal':
        return <Terminal />;
      case 'browser':
        return <Browser />;
      case 'filemanager':
        return <FileManager />;
      case 'neovim':
        const initialFile = appData?.fileName && appData?.fileContent
          ? { name: appData.fileName as string, content: appData.fileContent as string }
          : undefined;
        const openRepo = appData?.repoIndex !== undefined
          ? { repoIndex: appData.repoIndex as number, filePath: appData.filePath as string }
          : undefined;
        return <Neovim initialFile={initialFile} openRepo={openRepo} />;
      case 'settings':
        return <Settings />;
      case 'pdfviewer':
        return <PDFViewer />;
      default:
        return null;
    }
  }, [appType, appData]);

  return (
    <div
      className={`window ${focused ? 'focused' : ''} ${animationClass}`}
      style={{
        ...style,
        animationDelay: !hasAnimated ? `${bootDelay}s` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseDown}
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
