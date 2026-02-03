'use client';

import React from 'react';
import TopBar from './TopBar';
import AppLauncher from './AppLauncher';
import WindowManager from '../window/WindowManager';
import { useWindowManager } from '../../contexts/WindowContext';

export default function Desktop() {
  const { closeAppLauncher } = useWindowManager();

  const handleDesktopClick = () => {
    closeAppLauncher();
  };

  return (
    <div className="desktop" onClick={handleDesktopClick}>
      <TopBar />
      <div className="desktop-content">
        <WindowManager />
      </div>
      <AppLauncher />
    </div>
  );
}
