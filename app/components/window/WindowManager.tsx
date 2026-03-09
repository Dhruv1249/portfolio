'use client';

import React, { useRef } from 'react';
import { useWindowManager } from '../../contexts/WindowContext';
import { useTiling } from '../../hooks/useTiling';
import Window from './Window';

export default function WindowManager() {
  const { windows, activeWorkspace, focusedWindowId } = useWindowManager();
  const { getWindowPosition } = useTiling(windows, activeWorkspace);

  // Cache last known positions so closing windows don't jump to fallback
  const lastPositions = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});

  // Get windows for current workspace (including closing ones for exit animation)
  const workspaceWindows = windows.filter(
    w => w.workspace === activeWorkspace && !w.isMinimized
  );

  // Update cached positions for non-closing windows
  workspaceWindows.forEach(w => {
    if (!w.isClosing) {
      const pos = getWindowPosition(w.id);
      lastPositions.current[w.id] = pos;
    }
  });

  // DO NOT sort by z-index here — sorting changes DOM order which causes
  // React to unmount/remount components. CSS z-index (set in style prop)
  // handles visual stacking. Keep stable insertion order instead.

  return (
    <>
      {workspaceWindows.map((window) => {
        // Use cached position for closing windows, fresh position for others
        const pos = window.isClosing
          ? lastPositions.current[window.id] || getWindowPosition(window.id)
          : getWindowPosition(window.id);
        
        return (
          <Window
            key={window.id}
            id={window.id}
            appType={window.appType}
            title={window.title}
            focused={window.id === focusedWindowId}
            isClosing={window.isClosing}
            bootDelay={0}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${pos.width}%`,
              height: `${pos.height}%`,
              zIndex: window.zIndex,
              transition: window.isClosing ? 'none' : 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), top 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        );
      })}
    </>
  );
}
