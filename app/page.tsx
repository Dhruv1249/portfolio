'use client';

import { useEffect, useState } from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Desktop from './components/desktop/Desktop';

export default function Home() {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsPhone = () => {
      const ua = navigator.userAgent || '';
      const isMobileUA = /Mobi|Android|iPhone|iPod/i.test(ua);
      const isPhoneViewport = window.matchMedia('(max-width: 820px)').matches;
      setIsPhone(isMobileUA && isPhoneViewport);
    };

    checkIsPhone();
    window.addEventListener('resize', checkIsPhone);

    return () => {
      window.removeEventListener('resize', checkIsPhone);
    };
  }, []);

  if (isPhone) {
    return (
      <main className="pc-only-screen">
        <div className="pc-only-card">
          <p className="pc-only-kicker">Tech Portfolio</p>
          <h1>This experience is built for desktop</h1>
          <p>
            This version simulates a keyboard-first Linux desktop and currently works best on a PC or laptop.
            Please open it on a larger screen with a physical keyboard.
          </p>
        </div>
      </main>
    );
  }

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
