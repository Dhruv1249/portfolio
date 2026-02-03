'use client';

import React, { useState } from 'react';
import { useWindowManager, AppType } from '../../contexts/WindowContext';

interface AppItem {
  id: AppType;
  name: string;
  icon: string;
}

const APPS: AppItem[] = [
  { id: 'terminal', name: 'Terminal', icon: '💻' },
  { id: 'browser', name: 'Browser', icon: '🌐' },
  { id: 'filemanager', name: 'Files', icon: '📁' },
  { id: 'neovim', name: 'Neovim', icon: '📝' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
];

export default function AppLauncher() {
  const { showAppLauncher, closeAppLauncher, openWindow } = useWindowManager();
  const [search, setSearch] = useState('');

  if (!showAppLauncher) return null;

  const filteredApps = APPS.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAppClick = (appType: AppType) => {
    openWindow(appType);
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
