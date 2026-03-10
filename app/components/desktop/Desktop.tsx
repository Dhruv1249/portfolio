'use client';

import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import AppLauncher from './AppLauncher';
import Tutorial from './Tutorial';
import Notifications from './Notifications';
import WindowManager from '../window/WindowManager';
import { useWindowManager } from '../../contexts/WindowContext';

export default function Desktop() {
  const { closeAppLauncher } = useWindowManager();
  const [showTutorial, setShowTutorial] = useState(false);

  // Auto-show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('portfolio-tutorial-seen');
    if (!hasSeenTutorial) {
      // Small delay so the desktop renders first
      const timer = setTimeout(() => setShowTutorial(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('portfolio-tutorial-seen', 'true');
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeAppLauncher();
    }
  };

  return (
    <div className="desktop" onClick={handleDesktopClick}>
      <TopBar onShowTutorial={() => setShowTutorial(true)} />
      <div className="desktop-content">
        <WindowManager />
      </div>
      <AppLauncher />
      <Notifications />
      <Tutorial show={showTutorial} onClose={handleCloseTutorial} />
    </div>
  );
}

