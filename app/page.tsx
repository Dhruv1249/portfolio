'use client';

import { WindowProvider } from './contexts/WindowContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Desktop from './components/desktop/Desktop';

export default function Home() {
  return (
    <ThemeProvider>
      <WindowProvider>
        <KeyboardProvider>
          <NotificationProvider>
            <Desktop />
          </NotificationProvider>
        </KeyboardProvider>
      </WindowProvider>
    </ThemeProvider>
  );
}
