'use client';

import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../contexts/WindowContext';

interface TopBarProps {
  onShowTutorial: () => void;
}

export default function TopBar({ onShowTutorial }: TopBarProps) {
  const { activeWorkspace, setActiveWorkspace, windows, toggleAppLauncher } = useWindowManager();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
      setDate(now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const workspaces = [1, 2, 3, 4];
  
  // Count windows per workspace
  const windowsPerWorkspace = workspaces.map(ws => 
    windows.filter(w => w.workspace === ws).length
  );

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-launcher-btn"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('tutorial-launcher-open-menu'));
            toggleAppLauncher();
          }}
          title="Open App Launcher (Alt+K)"
          aria-label="Open app launcher"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </svg>
        </button>
        <div className="workspace-switcher">
          {workspaces.map((ws, index) => (
            <button
              key={ws}
              className={`workspace-dot ${activeWorkspace === ws ? 'active' : ''}`}
              onClick={() => setActiveWorkspace(ws)}
              title={`Workspace ${ws}${windowsPerWorkspace[index] > 0 ? ` (${windowsPerWorkspace[index]} windows)` : ''}`}
              style={{
                opacity: windowsPerWorkspace[index] > 0 || activeWorkspace === ws ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      <div className="topbar-center">
        <div className="topbar-time">
          <span>{date}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{time}</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-tutorial-btn" onClick={onShowTutorial} title="Show Tutorial">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Tutorial
        </button>
        <div className="topbar-icon" title="WiFi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
        </div>
        <div className="topbar-icon" title="Volume">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>
        <div className="topbar-icon" title="Battery">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
            <path d="M22 11v2" />
            <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
        <div className="topbar-icon" title="Power">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </div>
      </div>
    </header>
  );
}
