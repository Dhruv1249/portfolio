'use client';

import { WindowProvider } from './contexts/WindowContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import Desktop from './components/desktop/Desktop';

export default function Home() {
  return (
    <WindowProvider>
      <KeyboardProvider>
        <Desktop />
      </KeyboardProvider>
    </WindowProvider>
  );
}
