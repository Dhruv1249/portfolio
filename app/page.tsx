'use client';

import { useEffect, useState } from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Desktop from './components/desktop/Desktop';
import appConfig from './lib/editor-config.json';

export default function Home() {
  const [isPhone, setIsPhone] = useState(false);
  const nonTechUrl = process.env.NEXT_PUBLIC_NON_TECH_PORTFOLIO_URL || appConfig.nonTechPortfolioUrl;

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

  useEffect(() => {
    if (!isPhone || typeof window === 'undefined') return;
    window.location.replace(nonTechUrl);
  }, [isPhone, nonTechUrl]);

  if (isPhone) {
    return (
      <main className="pc-only-screen">
        <div className="pc-only-card">
          <p className="pc-only-kicker">Redirecting</p>
          <h1>Taking you to the mobile-friendly portfolio</h1>
          <p>
            This desktop environment works best on a larger screen. You are being redirected to the standard portfolio.
          </p>
          <p>
            If redirect does not happen, <a href={nonTechUrl} style={{ color: 'var(--accent-primary)' }}>tap here</a>.
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
