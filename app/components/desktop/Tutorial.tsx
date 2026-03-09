'use client';

import React, { useState, useEffect } from 'react';

interface TutorialStep {
  title: string;
  icon: string;
  content: React.ReactNode;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Portfolio OS',
    icon: '🖥️',
    content: (
      <div className="tutorial-step-content">
        <p className="tutorial-highlight">
          You&apos;re not looking at a regular portfolio — this is an <strong>interactive Linux desktop</strong> running in your browser.
        </p>
        <p>
          This portfolio recreates the experience of a <strong>Linux desktop environment</strong>, 
          complete with a tiling window manager, terminal emulator, file manager, and more.
        </p>
        <p>
          Everything you see works just like a real desktop — you can open apps, 
          switch between windows, use keyboard shortcuts, and explore the filesystem.
        </p>
        <div className="tutorial-callout">
          <span className="tutorial-callout-icon">💡</span>
          <span>This tutorial is skippable — press <kbd>Skip</kbd> anytime or <kbd>Esc</kbd> to close.</span>
        </div>
      </div>
    ),
  },
  {
    title: 'What is Linux?',
    icon: '🐧',
    content: (
      <div className="tutorial-step-content">
        <p>
          <strong>Linux</strong> is a free, open-source operating system kernel created by Linus Torvalds in 1991. 
          Unlike Windows or macOS, Linux gives users complete control over their system.
        </p>
        <p>
          Linux comes in many &quot;distributions&quot; (distros) — think of them as different flavors 
          of the same core system, each configured for different needs.
        </p>
        <div className="tutorial-info-grid">
          <div className="tutorial-info-card">
            <div className="tutorial-info-icon">🔓</div>
            <div>
              <strong>Open Source</strong>
              <p>Anyone can view, modify, and distribute the code</p>
            </div>
          </div>
          <div className="tutorial-info-card">
            <div className="tutorial-info-icon">⚡</div>
            <div>
              <strong>Powerful</strong>
              <p>Powers 96% of the world&apos;s top supercomputers</p>
            </div>
          </div>
          <div className="tutorial-info-card">
            <div className="tutorial-info-icon">🎨</div>
            <div>
              <strong>Customizable</strong>
              <p>Every aspect of the desktop can be personalized</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Arch Linux & Hyprland',
    icon: '🏔️',
    content: (
      <div className="tutorial-step-content">
        <p>
          This portfolio is themed after <strong>Arch Linux</strong> — a minimalist distribution 
          that gives you a blank canvas to build your perfect system from scratch.
          Arch&apos;s philosophy: <em>&quot;Keep It Simple&quot;</em>.
        </p>
        <p>
          The window manager is inspired by <strong>Hyprland</strong> — a modern, 
          dynamic tiling compositor for Linux. Unlike traditional desktops where you 
          manually drag and resize windows, a <strong>tiling window manager</strong> automatically 
          arranges windows to fill your screen efficiently.
        </p>
        <div className="tutorial-comparison">
          <div className="tutorial-compare-item">
            <div className="tutorial-compare-header">
              <span>🪟</span> Traditional Desktop
            </div>
            <ul>
              <li>Windows overlap freely</li>
              <li>Manual dragging & resizing</li>
              <li>Wasted screen space</li>
            </ul>
          </div>
          <div className="tutorial-compare-item highlight">
            <div className="tutorial-compare-header">
              <span>⚡</span> Tiling WM (This Portfolio)
            </div>
            <ul>
              <li>Windows auto-arrange</li>
              <li>Keyboard-driven workflow</li>
              <li>Every pixel utilized</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Window Management',
    icon: '🪟',
    content: (
      <div className="tutorial-step-content">
        <p>
          Windows automatically tile — they split the screen to fill available space. 
          Here&apos;s how to manage them:
        </p>
        <div className="tutorial-shortcuts">
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Click</kbd><span> a window</span>
            </div>
            <span className="tutorial-shortcut-desc">Focus / bring to front</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>●</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Close button (top-left of each window)</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>Space</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open App Launcher to launch new apps</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>J</kbd> / <kbd>K</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Cycle focus between windows</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>W</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Close the focused window</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Keyboard Shortcuts',
    icon: '⌨️',
    content: (
      <div className="tutorial-step-content">
        <p>
          Power users love keyboard shortcuts! Here are the essentials:
        </p>
        <div className="tutorial-shortcuts">
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>Enter</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open Terminal</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>B</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open Browser</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>F</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open File Manager</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>N</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open Neovim</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>S</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open Settings</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Alt</kbd> + <kbd>Space</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Open App Launcher (search & launch any app)</span>
          </div>
          <div className="tutorial-shortcut-row">
            <div className="tutorial-keys">
              <kbd>Esc</kbd>
            </div>
            <span className="tutorial-shortcut-desc">Close app launcher / this tutorial</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'The Apps',
    icon: '📱',
    content: (
      <div className="tutorial-step-content">
        <p>Explore the built-in applications:</p>
        <div className="tutorial-apps-list">
          <div className="tutorial-app-item">
            <span className="tutorial-app-icon">💻</span>
            <div>
              <strong>Terminal</strong>
              <p>Simulated zsh shell — try commands like <code>help</code>, <code>ls</code>, <code>cat</code>, <code>neofetch</code></p>
            </div>
          </div>
          <div className="tutorial-app-item">
            <span className="tutorial-app-icon">🌐</span>
            <div>
              <strong>Browser</strong>
              <p>My portfolio page with projects, experience, and achievements</p>
            </div>
          </div>
          <div className="tutorial-app-item">
            <span className="tutorial-app-icon">📁</span>
            <div>
              <strong>Files</strong>
              <p>Navigate the virtual filesystem — double-click files to open in Neovim</p>
            </div>
          </div>
          <div className="tutorial-app-item">
            <span className="tutorial-app-icon">📝</span>
            <div>
              <strong>Neovim</strong>
              <p>Code editor with syntax highlighting — the editor real developers use</p>
            </div>
          </div>
          <div className="tutorial-app-item">
            <span className="tutorial-app-icon">⚙️</span>
            <div>
              <strong>Settings</strong>
              <p>System info, keyboard shortcuts reference, and about page</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Workspaces',
    icon: '🔲',
    content: (
      <div className="tutorial-step-content">
        <p>
          Like a real Linux desktop, you have <strong>4 virtual workspaces</strong> — 
          think of them as separate desktops you can switch between. 
          Organize your windows by putting different apps on different workspaces.
        </p>
        <div className="tutorial-workspace-demo">
          <div className="tutorial-ws-dots">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className={`tutorial-ws-dot ${n === 1 ? 'active' : ''}`}>
                {n}
              </div>
            ))}
          </div>
          <p className="tutorial-ws-hint">
            The dots in the <strong>top-left</strong> of the taskbar represent workspaces. 
            Click them or use <kbd>Alt</kbd> + <kbd>1</kbd>-<kbd>4</kbd> to switch.
          </p>
        </div>
        <div className="tutorial-callout success">
          <span className="tutorial-callout-icon">🎉</span>
          <span>You&apos;re all set! Close this tutorial and start exploring. Have fun!</span>
        </div>
      </div>
    ),
  },
];

interface TutorialProps {
  show: boolean;
  onClose: () => void;
}

export default function Tutorial({ show, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setCurrentStep(0);
    }
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
          handleNext();
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, currentStep, onClose]);

  if (!show) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, TUTORIAL_STEPS.length - 1));
      setIsAnimating(false);
    }, 150);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
      setIsAnimating(false);
    }, 150);
  };

  return (
    <div className="tutorial-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={`tutorial-modal ${isAnimating ? 'tutorial-fade' : ''}`}>
        {/* Header */}
        <div className="tutorial-header">
          <div className="tutorial-step-indicator">
            <span className="tutorial-step-icon">{step.icon}</span>
            <span className="tutorial-step-number">
              {currentStep + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>
          <button className="tutorial-skip" onClick={onClose}>
            Skip Tutorial
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="tutorial-progress">
          <div
            className="tutorial-progress-bar"
            style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="tutorial-body">
          <h2 className="tutorial-title">{step.title}</h2>
          {step.content}
        </div>

        {/* Footer navigation */}
        <div className="tutorial-footer">
          <button
            className="tutorial-nav-btn prev"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="tutorial-dots">
            {TUTORIAL_STEPS.map((_, i) => (
              <button
                key={i}
                className={`tutorial-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(i)}
              />
            ))}
          </div>

          <button
            className="tutorial-nav-btn next"
            onClick={isLastStep ? onClose : handleNext}
          >
            {isLastStep ? 'Get Started' : 'Next'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
