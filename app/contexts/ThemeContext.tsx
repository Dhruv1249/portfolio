'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ColorProfile {
  id: string;
  name: string;
  preview: string[];
  vars: Record<string, string>;
}

export const COLOR_PROFILES: ColorProfile[] = [
  {
    id: 'teal',
    name: 'Teal Dark',
    preview: ['#2dd4bf', '#14b8a6', '#050505', '#f5f5f5'],
    vars: {
      '--bg-primary': '#050505',
      '--bg-secondary': '#0a0a0a',
      '--bg-tertiary': '#111111',
      '--bg-elevated': '#161616',
      '--bg-window': '#0d0d0d',
      '--accent-primary': '#2dd4bf',
      '--accent-secondary': '#14b8a6',
      '--accent-tertiary': '#5eead4',
      '--accent-warning': '#e0af68',
      '--accent-error': '#f7768e',
      '--accent-cyan': '#2dd4bf',
      '--accent-green': '#2dd4bf',
      '--text-primary': '#f5f5f5',
      '--text-secondary': '#a1a1aa',
      '--text-muted': '#52525b',
      '--text-bright': '#ffffff',
      '--border-color': 'rgba(255, 255, 255, 0.06)',
      '--border-focused': '#2dd4bf',
      '--window-bg': 'rgba(10, 10, 10, 0.95)',
      '--window-header': '#111111',
      '--glass-bg': 'rgba(17, 17, 17, 0.8)',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    preview: ['#7aa2f7', '#bb9af7', '#0d0f18', '#c0caf5'],
    vars: {
      '--bg-primary': '#0d0f18',
      '--bg-secondary': '#141621',
      '--bg-tertiary': '#1a1d2e',
      '--bg-elevated': '#1e2235',
      '--bg-window': '#181b28',
      '--accent-primary': '#7aa2f7',
      '--accent-secondary': '#bb9af7',
      '--accent-tertiary': '#9ece6a',
      '--accent-warning': '#e0af68',
      '--accent-error': '#f7768e',
      '--accent-cyan': '#7dcfff',
      '--accent-green': '#73daca',
      '--text-primary': '#c0caf5',
      '--text-secondary': '#a9b1d6',
      '--text-muted': '#565f89',
      '--text-bright': '#ffffff',
      '--border-color': '#292e42',
      '--border-focused': '#7aa2f7',
      '--window-bg': 'rgba(24, 27, 40, 0.95)',
      '--window-header': '#1a1d2e',
      '--glass-bg': 'rgba(26, 29, 46, 0.8)',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    preview: ['#cba6f7', '#f38ba8', '#1e1e2e', '#cdd6f4'],
    vars: {
      '--bg-primary': '#1e1e2e',
      '--bg-secondary': '#181825',
      '--bg-tertiary': '#313244',
      '--bg-elevated': '#45475a',
      '--bg-window': '#1e1e2e',
      '--accent-primary': '#cba6f7',
      '--accent-secondary': '#f38ba8',
      '--accent-tertiary': '#a6e3a1',
      '--accent-warning': '#f9e2af',
      '--accent-error': '#f38ba8',
      '--accent-cyan': '#89dceb',
      '--accent-green': '#a6e3a1',
      '--text-primary': '#cdd6f4',
      '--text-secondary': '#bac2de',
      '--text-muted': '#6c7086',
      '--text-bright': '#ffffff',
      '--border-color': '#313244',
      '--border-focused': '#cba6f7',
      '--window-bg': 'rgba(30, 30, 46, 0.95)',
      '--window-header': '#181825',
      '--glass-bg': 'rgba(30, 30, 46, 0.8)',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    preview: ['#88c0d0', '#81a1c1', '#2e3440', '#d8dee9'],
    vars: {
      '--bg-primary': '#2e3440',
      '--bg-secondary': '#3b4252',
      '--bg-tertiary': '#434c5e',
      '--bg-elevated': '#4c566a',
      '--bg-window': '#2e3440',
      '--accent-primary': '#88c0d0',
      '--accent-secondary': '#81a1c1',
      '--accent-tertiary': '#a3be8c',
      '--accent-warning': '#ebcb8b',
      '--accent-error': '#bf616a',
      '--accent-cyan': '#8fbcbb',
      '--accent-green': '#a3be8c',
      '--text-primary': '#d8dee9',
      '--text-secondary': '#e5e9f0',
      '--text-muted': '#4c566a',
      '--text-bright': '#eceff4',
      '--border-color': '#434c5e',
      '--border-focused': '#88c0d0',
      '--window-bg': 'rgba(46, 52, 64, 0.95)',
      '--window-header': '#3b4252',
      '--glass-bg': 'rgba(46, 52, 64, 0.8)',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    preview: ['#bd93f9', '#ff79c6', '#282a36', '#f8f8f2'],
    vars: {
      '--bg-primary': '#282a36',
      '--bg-secondary': '#21222c',
      '--bg-tertiary': '#343746',
      '--bg-elevated': '#44475a',
      '--bg-window': '#282a36',
      '--accent-primary': '#bd93f9',
      '--accent-secondary': '#ff79c6',
      '--accent-tertiary': '#50fa7b',
      '--accent-warning': '#f1fa8c',
      '--accent-error': '#ff5555',
      '--accent-cyan': '#8be9fd',
      '--accent-green': '#50fa7b',
      '--text-primary': '#f8f8f2',
      '--text-secondary': '#ccc',
      '--text-muted': '#6272a4',
      '--text-bright': '#ffffff',
      '--border-color': '#44475a',
      '--border-focused': '#bd93f9',
      '--window-bg': 'rgba(40, 42, 54, 0.95)',
      '--window-header': '#21222c',
      '--glass-bg': 'rgba(40, 42, 54, 0.8)',
    },
  },
  {
    id: 'rose-pine',
    name: 'Rosé Pine',
    preview: ['#c4a7e7', '#ebbcba', '#191724', '#e0def4'],
    vars: {
      '--bg-primary': '#191724',
      '--bg-secondary': '#1f1d2e',
      '--bg-tertiary': '#26233a',
      '--bg-elevated': '#2a2837',
      '--bg-window': '#191724',
      '--accent-primary': '#c4a7e7',
      '--accent-secondary': '#ebbcba',
      '--accent-tertiary': '#9ccfd8',
      '--accent-warning': '#f6c177',
      '--accent-error': '#eb6f92',
      '--accent-cyan': '#9ccfd8',
      '--accent-green': '#31748f',
      '--text-primary': '#e0def4',
      '--text-secondary': '#908caa',
      '--text-muted': '#6e6a86',
      '--text-bright': '#ffffff',
      '--border-color': '#26233a',
      '--border-focused': '#c4a7e7',
      '--window-bg': 'rgba(25, 23, 36, 0.95)',
      '--window-header': '#1f1d2e',
      '--glass-bg': 'rgba(25, 23, 36, 0.8)',
    },
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    preview: ['#fabd2f', '#fe8019', '#1d2021', '#ebdbb2'],
    vars: {
      '--bg-primary': '#1d2021',
      '--bg-secondary': '#282828',
      '--bg-tertiary': '#3c3836',
      '--bg-elevated': '#504945',
      '--bg-window': '#1d2021',
      '--accent-primary': '#fabd2f',
      '--accent-secondary': '#fe8019',
      '--accent-tertiary': '#b8bb26',
      '--accent-warning': '#fabd2f',
      '--accent-error': '#fb4934',
      '--accent-cyan': '#8ec07c',
      '--accent-green': '#b8bb26',
      '--text-primary': '#ebdbb2',
      '--text-secondary': '#d5c4a1',
      '--text-muted': '#665c54',
      '--text-bright': '#fbf1c7',
      '--border-color': '#3c3836',
      '--border-focused': '#fabd2f',
      '--window-bg': 'rgba(29, 32, 33, 0.95)',
      '--window-header': '#282828',
      '--glass-bg': 'rgba(29, 32, 33, 0.8)',
    },
  },
];

interface ThemeContextType {
  activeProfile: ColorProfile;
  setProfile: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeProfile: COLOR_PROFILES[0],
  setProfile: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<ColorProfile>(COLOR_PROFILES[0]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) {
      const found = COLOR_PROFILES.find(p => p.id === saved);
      if (found) {
        setActiveProfile(found);
        applyTheme(found);
      }
    }
  }, []);

  const applyTheme = useCallback((profile: ColorProfile) => {
    const root = document.documentElement;
    Object.entries(profile.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  const setProfile = useCallback((id: string) => {
    const found = COLOR_PROFILES.find(p => p.id === id);
    if (found) {
      setActiveProfile(found);
      applyTheme(found);
      localStorage.setItem('portfolio-theme', id);
    }
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ activeProfile, setProfile }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
