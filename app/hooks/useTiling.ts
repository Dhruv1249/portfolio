'use client';

import { useMemo } from 'react';
import { Window } from '../contexts/WindowContext';

interface TilePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseTilingResult {
  getWindowPosition: (windowId: string) => TilePosition;
}

export function useTiling(windows: Window[], activeWorkspace: number): UseTilingResult {
  const workspaceWindows = useMemo(() => 
    windows.filter(w => w.workspace === activeWorkspace && !w.isMinimized && !w.isClosing),
    [windows, activeWorkspace]
  );

  const positions = useMemo(() => {
    const gap = 12;
    const positions: Record<string, TilePosition> = {};
    
    if (workspaceWindows.length === 0) return positions;

    // Master-stack tiling layout
    // First window takes left portion (60%), rest stack on right (40%)
    
    if (workspaceWindows.length === 1) {
      // Single window: full width
      positions[workspaceWindows[0].id] = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };
    } else if (workspaceWindows.length === 2) {
      // Two windows: side by side
      positions[workspaceWindows[0].id] = {
        x: 0,
        y: 0,
        width: 50 - gap / 20,
        height: 100,
      };
      positions[workspaceWindows[1].id] = {
        x: 50 + gap / 20,
        y: 0,
        width: 50 - gap / 20,
        height: 100,
      };
    } else {
      // Master + stack layout
      const masterRatio = 0.55;
      const stackCount = workspaceWindows.length - 1;
      const stackHeight = 100 / stackCount;
      
      // Master window (left side)
      positions[workspaceWindows[0].id] = {
        x: 0,
        y: 0,
        width: masterRatio * 100 - gap / 20,
        height: 100,
      };
      
      // Stack windows (right side)
      for (let i = 1; i < workspaceWindows.length; i++) {
        const stackIndex = i - 1;
        positions[workspaceWindows[i].id] = {
          x: masterRatio * 100 + gap / 20,
          y: stackIndex * stackHeight,
          width: (1 - masterRatio) * 100 - gap / 20,
          height: stackHeight - (stackIndex < stackCount - 1 ? gap / 10 : 0),
        };
      }
    }
    
    return positions;
  }, [workspaceWindows]);

  const getWindowPosition = (windowId: string): TilePosition => {
    return positions[windowId] || { x: 10, y: 10, width: 80, height: 80 };
  };

  return { getWindowPosition };
}
