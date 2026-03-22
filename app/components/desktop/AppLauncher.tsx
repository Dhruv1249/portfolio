'use client';

import React, { useState, useEffect } from 'react';
import { useWindowManager, AppType } from '../../contexts/WindowContext';
import { Terminal, Globe, FolderOpen, Code, Settings, FileText, AppWindow, Mail } from 'lucide-react';
import appConfig from '../../lib/editor-config.json';

const APPS: { id: AppType; name: string; icon: React.ReactNode }[] = [
  { id: 'terminal', name: 'Terminal', icon: <Terminal size={28} /> },
  { id: 'browser', name: 'Browser', icon: <Globe size={28} /> },
  { id: 'filemanager', name: 'Files', icon: <FolderOpen size={28} /> },
  { id: 'neovim', name: appConfig.apps.codeEditorName, icon: <Code size={28} /> },
  { id: 'email', name: appConfig.apps.emailName, icon: <Mail size={28} /> },
  { id: 'pdfviewer', name: 'Resume', icon: <FileText size={28} /> },
  { id: 'settings', name: 'Settings', icon: <Settings size={28} /> },
  { id: 'standard' as any, name: 'Standard View', icon: <AppWindow size={28} /> },
];

  export default function AppLauncher() {
    const { showAppLauncher, closeAppLauncher, openWindow } = useWindowManager();
    const [search, setSearch] = useState('');
  
    useEffect(() => {
      if (showAppLauncher) {
        window.dispatchEvent(new CustomEvent('app-launcher-open'));
      } else {
        window.dispatchEvent(new CustomEvent('app-launcher-close'));
      }
    }, [showAppLauncher]);
  
    if (!showAppLauncher) return null;
  
    const filteredApps = APPS.filter(app =>
      app.name.toLowerCase().includes(search.toLowerCase())
    );

  const handleAppClick = (appType: AppType | string) => {
    if (appType === 'standard') {
      window.open(appConfig.nonTechPortfolioUrl, '_blank');
      closeAppLauncher();
      setSearch('');
      return;
    }
    openWindow(appType as AppType);
    setSearch('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeAppLauncher();
      setSearch('');
    }
  };

  return (
    <div className="app-launcher-overlay" onClick={handleOverlayClick}>
      <div className="app-launcher">
        <input
          type="text"
          className="app-launcher-search"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filteredApps.length > 0) {
              handleAppClick(filteredApps[0].id);
            }
          }}
        />
        <div className="app-launcher-grid">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="app-launcher-item"
              onClick={() => handleAppClick(app.id)}
            >
              <div className="app-launcher-icon">{app.icon}</div>
              <span className="app-launcher-name">{app.name}</span>
            </div>
          ))}
        </div>
        {filteredApps.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
            No applications found
          </div>
        )}
      </div>
    </div>
  );
}
