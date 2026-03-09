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
    const pad = 1.5; // outer padding from screen edges (percentage)
    const positions: Record<string, TilePosition> = {};
    
    if (workspaceWindows.length === 0) return positions;

    // Available area after outer padding
    const areaX = pad;
    const areaY = pad;
    const areaW = 100 - pad * 2;
    const areaH = 100 - pad * 2;

    // Master-stack tiling layout
    // First window takes left portion (55%), rest stack on right (45%)
    
    if (workspaceWindows.length === 1) {
      // Single window: fills available area
      positions[workspaceWindows[0].id] = {
        x: areaX,
        y: areaY,
        width: areaW,
        height: areaH,
      };
    } else if (workspaceWindows.length === 2) {
      // Two windows: side by side
      const halfW = areaW / 2;
      positions[workspaceWindows[0].id] = {
        x: areaX,
        y: areaY,
        width: halfW - gap / 20,
        height: areaH,
      };
      positions[workspaceWindows[1].id] = {
        x: areaX + halfW + gap / 20,
        y: areaY,
        width: halfW - gap / 20,
        height: areaH,
      };
    } else {
      // Master + stack layout
      const masterRatio = 0.55;
      const stackCount = workspaceWindows.length - 1;
      const stackHeight = areaH / stackCount;
      
      // Master window (left side)
      positions[workspaceWindows[0].id] = {
        x: areaX,
        y: areaY,
        width: masterRatio * areaW - gap / 20,
        height: areaH,
      };
      
      // Stack windows (right side)
      for (let i = 1; i < workspaceWindows.length; i++) {
        const stackIndex = i - 1;
        positions[workspaceWindows[i].id] = {
          x: areaX + masterRatio * areaW + gap / 20,
          y: areaY + stackIndex * stackHeight,
          width: (1 - masterRatio) * areaW - gap / 20,
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
