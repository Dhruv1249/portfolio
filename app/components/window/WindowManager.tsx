'use client';

import React from 'react';
import { useWindowManager } from '../../contexts/WindowContext';
import { useTiling } from '../../hooks/useTiling';
import Window from './Window';

export default function WindowManager() {
  const { windows, activeWorkspace, focusedWindowId } = useWindowManager();
  const { getWindowPosition } = useTiling(windows, activeWorkspace);

  // Get windows for current workspace
  const workspaceWindows = windows.filter(
    w => w.workspace === activeWorkspace && !w.isMinimized
  );

  // Sort by z-index for proper stacking
  const sortedWindows = [...workspaceWindows].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <>
      {sortedWindows.map((window, index) => {
        const pos = getWindowPosition(window.id);
        
        return (
          <Window
            key={window.id}
            id={window.id}
            appType={window.appType}
            title={window.title}
            focused={window.id === focusedWindowId}
            isClosing={window.isClosing}
            bootDelay={index * 0.1}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${pos.width}%`,
              height: `${pos.height}%`,
              zIndex: window.zIndex,
              transition: window.isClosing ? 'none' : 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        );
      })}
    </>
  );
}
