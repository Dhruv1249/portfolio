'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useWindowManager, AppType } from '../../contexts/WindowContext';
import { useTheme } from '../../contexts/ThemeContext';

function AppLoading() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
      background: 'transparent',
    }}>
      Loading app...
    </div>
  );
}

const Terminal = dynamic(() => import('../apps/Terminal'), { ssr: false, loading: AppLoading });
const Browser = dynamic(() => import('../apps/Browser'), { ssr: false, loading: AppLoading });
const FileManager = dynamic(() => import('../apps/FileManager'), { ssr: false, loading: AppLoading });
const CodeEditor = dynamic(() => import('../apps/Neovim'), { ssr: false, loading: AppLoading });
const Settings = dynamic(() => import('../apps/Settings'), { ssr: false, loading: AppLoading });
const PDFViewer = dynamic(() => import('../apps/PDFViewer'), { ssr: false, loading: AppLoading });
const Email = dynamic(() => import('../apps/Email'), { ssr: false, loading: AppLoading });

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
  const { transparency, windowOpacity } = useTheme();
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), (bootDelay * 1000) + 500);
    return () => clearTimeout(timer);
  }, [bootDelay]);

  const handleMouseDown = useCallback(() => {
    if (!focused) {
      focusWindow(id);
    }
  }, [focusWindow, id, focused]);

  const handleMouseEnter = useCallback(() => {
    if (focused) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      focusWindow(id);
      hoverTimerRef.current = null;
    }, 35);
  }, [focusWindow, id, focused]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

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

  // Memoize app content
  const appContent = useMemo(() => {
    switch (appType) {
      case 'terminal':
        return <Terminal focused={focused} />;
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
        return <CodeEditor initialFile={initialFile} openRepo={openRepo} />;
      case 'settings':
        return <Settings />;
      case 'pdfviewer':
        return <PDFViewer />;
      case 'email':
        return <Email />;
      default:
        return null;
    }
  }, [appType, appData, focused]);

  return (
    <div
      className={`window ${focused ? 'focused' : ''} ${animationClass} ${transparency ? 'window-glass' : ''}`}
      data-app-type={appType}
      data-window-id={id}
      style={{
        ...style,
        ...(transparency ? { '--window-opacity': windowOpacity } as React.CSSProperties : {}),
        animationDelay: !hasAnimated ? `${bootDelay}s` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
