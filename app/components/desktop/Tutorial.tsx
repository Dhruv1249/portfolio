'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../../contexts/WindowContext';
import {
  Monitor, ChevronRight, ChevronLeft, X, Lightbulb, CheckCircle2,
  Terminal, Globe, FolderOpen, Code, Settings, Keyboard, Layout,
  Layers, MousePointer, Sparkles, Rocket, Info, ArrowRight, Play
} from 'lucide-react';

interface TryItConfig {
  instruction: string;
  hint: string;
  // If checkFn is provided, auto-detect completion. Otherwise user clicks "Done".
  checkFn?: (windows: any[], baseline: number) => boolean;
}

interface TutorialStep {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  tryIt: TryItConfig;
}

interface TutorialProps {
  show: boolean;
  onClose: () => void;
}

export default function Tutorial({ show, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tryItCompleted, setTryItCompleted] = useState<Set<number>>(new Set());
  const [minimized, setMinimized] = useState(false);
  const baselineRef = useRef<number>(0);
  const { windows } = useWindowManager();

  useEffect(() => {
    if (show) {
      setCurrentStep(0);
      setTryItCompleted(new Set());
      setMinimized(false);
    }
  }, [show]);

  // ─── Steps ─────────────────────────────────────────
  const STEPS: TutorialStep[] = [
    {
      title: 'Welcome to Portfolio OS',
      icon: <Monitor size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            You&apos;re not looking at a regular portfolio — this is an <strong>interactive Linux desktop</strong> running in your browser.
          </p>
          <p>
            Everything works just like a real desktop — open apps, switch windows, use keyboard shortcuts, browse code, and explore projects.
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Every step has a <strong>Try Now</strong> button — practice each feature hands-on!</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Explore the desktop',
        hint: 'Look around! Click anything. Press Esc to skip tutorial anytime.',
      },
    },

    {
      title: 'What is Linux?',
      icon: <Info size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            <strong>Linux</strong> is a free, open-source operating system. Unlike Windows or macOS, Linux gives users complete control.
          </p>
          <div className="tutorial-info-grid">
            <div className="tutorial-info-card">
              <div className="tutorial-info-icon"><Sparkles size={20} /></div>
              <div><strong>Open Source</strong><p>Anyone can view, modify, and distribute the code</p></div>
            </div>
            <div className="tutorial-info-card">
              <div className="tutorial-info-icon"><Rocket size={20} /></div>
              <div><strong>Powerful</strong><p>Powers 96% of the world&apos;s top supercomputers</p></div>
            </div>
            <div className="tutorial-info-card">
              <div className="tutorial-info-icon"><Settings size={20} /></div>
              <div><strong>Customizable</strong><p>Every aspect of the desktop can be personalized</p></div>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Take a look around',
        hint: 'Notice the top bar, workspace dots, and the empty desktop — just like a real Linux install.',
      },
    },

    {
      title: 'Arch Linux & Hyprland',
      icon: <Layout size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            This portfolio is themed after <strong>Arch Linux</strong> with <strong>Hyprland</strong>, a tiling window manager.
            Windows automatically arrange to fill your screen — no dragging!
          </p>
          <div className="tutorial-comparison">
            <div className="tutorial-compare-item">
              <div className="tutorial-compare-header"><MousePointer size={16} /> Traditional Desktop</div>
              <ul><li>Windows overlap freely</li><li>Manual dragging & resizing</li><li>Wasted screen space</li></ul>
            </div>
            <div className="tutorial-compare-item highlight">
              <div className="tutorial-compare-header"><Layout size={16} /> Tiling WM (This Portfolio)</div>
              <ul><li>Windows auto-arrange</li><li>Keyboard-driven workflow</li><li>Every pixel utilized</li></ul>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Check the workspace dots',
        hint: 'Look at the top-left corner — those dots represent 4 virtual workspaces. Click one!',
      },
    },

    {
      title: 'Open the Terminal',
      icon: <Terminal size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            The <strong>Terminal</strong> is the most powerful tool on Linux. Let&apos;s open one!
          </p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd> + <kbd>Enter</kbd></div>
              <span className="tutorial-shortcut-desc">Open a new terminal</span>
            </div>
          </div>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Press <strong>Try Now</strong> below, then press <kbd>Alt</kbd> + <kbd>Enter</kbd> on your keyboard.</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open a Terminal',
        hint: 'Press  Alt + Enter',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'terminal') && wins.length > baseline,
      },
    },

    {
      title: 'Run a Command',
      icon: <Terminal size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>Now type a command in your terminal! Try any of these:</p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>help</kbd></div>
              <span className="tutorial-shortcut-desc">See all available commands</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>neofetch</kbd></div>
              <span className="tutorial-shortcut-desc">Display system info</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>cat skills.json</kbd></div>
              <span className="tutorial-shortcut-desc">View a file&apos;s contents</span>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Type a command in the terminal',
        hint: 'Try typing  help  or  neofetch  and press Enter',
      },
    },

    {
      title: 'App Launcher',
      icon: <Sparkles size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            The <strong>App Launcher</strong> lets you quickly open any app. Type to search!
          </p>
          <div className="tutorial-apps-list">
            <div className="tutorial-app-item">
              <span className="tutorial-app-icon"><Terminal size={18} /></span>
              <div><strong>Terminal</strong><p>Simulated zsh shell</p></div>
            </div>
            <div className="tutorial-app-item">
              <span className="tutorial-app-icon"><Globe size={18} /></span>
              <div><strong>Browser</strong><p>Portfolio with projects</p></div>
            </div>
            <div className="tutorial-app-item">
              <span className="tutorial-app-icon"><FolderOpen size={18} /></span>
              <div><strong>Files</strong><p>GitHub file browser</p></div>
            </div>
            <div className="tutorial-app-item">
              <span className="tutorial-app-icon"><Code size={18} /></span>
              <div><strong>Neovim</strong><p>Code editor with Vim motions</p></div>
            </div>
            <div className="tutorial-app-item">
              <span className="tutorial-app-icon"><Settings size={18} /></span>
              <div><strong>Settings</strong><p>System info & shortcuts</p></div>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open the App Launcher',
        hint: 'Press  Alt + Space  — then try searching for an app!',
      },
    },

    {
      title: 'Window Management',
      icon: <Layout size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>Windows <strong>tile automatically</strong>. Here are the controls:</p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd> + <kbd>J</kbd> / <kbd>K</kbd></div>
              <span className="tutorial-shortcut-desc">Cycle focus between windows</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd> + <kbd>W</kbd></div>
              <span className="tutorial-shortcut-desc">Close the focused window</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><span style={{ color: '#ff5f57', fontSize: '12px' }}>●</span> button</div>
              <span className="tutorial-shortcut-desc">Close button (top-left of each window)</span>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Try the window shortcuts',
        hint: 'Press  Alt + J/K  to cycle focus, or  Alt + W  to close a window',
      },
    },

    {
      title: 'Tiling in Action',
      icon: <Layers size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>Open <strong>another app</strong> and watch them tile side by side!</p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd> + <kbd>B</kbd></div>
              <span className="tutorial-shortcut-desc">Open Browser</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd> + <kbd>F</kbd></div>
              <span className="tutorial-shortcut-desc">Open File Manager</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd> + <kbd>N</kbd></div>
              <span className="tutorial-shortcut-desc">Open Neovim</span>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open another app to see tiling',
        hint: 'Try  Alt + B  for the Browser',
        checkFn: (wins, baseline) => wins.length > baseline,
      },
    },

    {
      title: 'Workspaces',
      icon: <Layers size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>You have <strong>4 virtual workspaces</strong> — separate desktops to organize your windows.</p>
          <div className="tutorial-workspace-demo">
            <div className="tutorial-ws-dots">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={`tutorial-ws-dot ${n === 1 ? 'active' : ''}`}>{n}</div>
              ))}
            </div>
            <p className="tutorial-ws-hint">
              Click the dots in the <strong>top-left</strong> or use <kbd>Alt</kbd> + <kbd>1</kbd>-<kbd>4</kbd> to switch.
            </p>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Switch to a different workspace',
        hint: 'Press  Alt + 2  — then come back with  Alt + 1',
      },
    },

    {
      title: 'File Manager',
      icon: <FolderOpen size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>Browse my <strong>GitHub project repositories</strong>. Double-click any file to open it in Neovim.</p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys">Click sidebar project</div>
              <span className="tutorial-shortcut-desc">Load its file tree from GitHub</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys">Double-click a file</div>
              <span className="tutorial-shortcut-desc">Open it in Neovim</span>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open Files and browse a project',
        hint: 'Press  Alt + F  — pick a project, explore the files',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'filemanager'),
      },
    },

    {
      title: 'Neovim Code Editor',
      icon: <Code size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p><strong>Neovim</strong> — keyboard-driven code editor with real Vim motions:</p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>j</kbd> / <kbd>k</kbd></div>
              <span className="tutorial-shortcut-desc">Move cursor down / up</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>gg</kbd> / <kbd>G</kbd></div>
              <span className="tutorial-shortcut-desc">Jump to top / bottom</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>/</kbd>query</div>
              <span className="tutorial-shortcut-desc">Search in file</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>i</kbd> / <kbd>Esc</kbd></div>
              <span className="tutorial-shortcut-desc">INSERT mode / back to NORMAL</span>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open Neovim and try Vim motions',
        hint: 'Press  Alt + N  — then try  j/k  to move, gg to jump to top',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'neovim'),
      },
    },

    {
      title: 'Keyboard Shortcuts',
      icon: <Keyboard size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>All shortcuts use <kbd>Alt</kbd> — no browser conflicts:</p>
          <div className="tutorial-shortcuts" style={{ columns: 2, columnGap: '16px' }}>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>Enter</kbd></div>
              <span className="tutorial-shortcut-desc">Terminal</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>B</kbd></div>
              <span className="tutorial-shortcut-desc">Browser</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>F</kbd></div>
              <span className="tutorial-shortcut-desc">Files</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>N</kbd></div>
              <span className="tutorial-shortcut-desc">Neovim</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>Space</kbd></div>
              <span className="tutorial-shortcut-desc">App Launcher</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>J/K</kbd></div>
              <span className="tutorial-shortcut-desc">Cycle focus</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>W</kbd></div>
              <span className="tutorial-shortcut-desc">Close window</span>
            </div>
            <div className="tutorial-shortcut-row">
              <div className="tutorial-keys"><kbd>Alt</kbd>+<kbd>1-4</kbd></div>
              <span className="tutorial-shortcut-desc">Switch workspace</span>
            </div>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Try any shortcut from the list',
        hint: 'Press any  Alt + _  shortcut to see it work!',
      },
    },

    {
      title: 'You\'re Ready!',
      icon: <Rocket size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            You&apos;ve completed the tutorial! Now go explore and discover my projects.
          </p>
          <div className="tutorial-info-grid">
            <div className="tutorial-info-card">
              <div className="tutorial-info-icon"><Terminal size={20} /></div>
              <div><strong>Terminal</strong><p>Try <code>fortune</code>, <code>man neovim</code>, or <code>sudo rm -rf /</code></p></div>
            </div>
            <div className="tutorial-info-card">
              <div className="tutorial-info-icon"><Globe size={20} /></div>
              <div><strong>Browser</strong><p>Check out my NASA award-winning CALYX project</p></div>
            </div>
            <div className="tutorial-info-card">
              <div className="tutorial-info-icon"><Code size={20} /></div>
              <div><strong>Neovim</strong><p>Browse real source code from my GitHub repos</p></div>
            </div>
          </div>
          <div className="tutorial-callout success">
            <CheckCircle2 size={16} />
            <span>Click <strong>?</strong> in the top bar anytime to re-open this tutorial.</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Go explore!',
        hint: 'The desktop is yours — open anything, try everything!',
      },
    },
  ];

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isTryItDone = tryItCompleted.has(currentStep);
  const hasAutoCheck = !!step?.tryIt?.checkFn;

  const startTryIt = () => {
    baselineRef.current = windows.length;
    setMinimized(true);
  };

  // ─── Auto-detect completion for steps with checkFn ─
  useEffect(() => {
    if (!show || !minimized || !step?.tryIt?.checkFn) return;
    if (tryItCompleted.has(currentStep)) return;

    const checkInterval = setInterval(() => {
      if (step.tryIt!.checkFn!(windows, baselineRef.current)) {
        setTryItCompleted(prev => new Set([...prev, currentStep]));
      }
    }, 300);

    return () => clearInterval(checkInterval);
  }, [show, minimized, currentStep, windows, step, tryItCompleted]);

  // ─── Keyboard Navigation ──────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;
      if (minimized) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isLastStep) onClose();
        else handleNext();
      }
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, currentStep, onClose, isLastStep, minimized]);

  if (!show) return null;

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
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

  const handleFloatingDone = () => {
    setTryItCompleted(prev => new Set([...prev, currentStep]));
  };

  const handleFloatingNext = () => {
    setMinimized(false);
    if (isLastStep) {
      onClose();
    } else {
      handleNext();
    }
  };

  // ─── Minimized: Floating hint bar at bottom ────────
  if (minimized) {
    return (
      <div className="tutorial-floating-hint">
        {!isTryItDone ? (
          <>
            <div className="tutorial-floating-pulse" />
            <div className="tutorial-floating-text">
              <strong>{step.tryIt?.instruction}</strong>
              <span>{step.tryIt?.hint}</span>
            </div>
            {/* If no auto-check, show a manual "Done" button */}
            {!hasAutoCheck && (
              <button className="tutorial-floating-done-btn" onClick={handleFloatingDone}>
                <CheckCircle2 size={14} />
                Done
              </button>
            )}
          </>
        ) : (
          <>
            <CheckCircle2 size={20} className="tutorial-floating-check" />
            <div className="tutorial-floating-text">
              <strong>Nice work!</strong>
              <span>Step completed</span>
            </div>
            <button className="tutorial-floating-next-btn" onClick={handleFloatingNext}>
              {isLastStep ? 'Finish' : 'Next'}
              <ChevronRight size={14} />
            </button>
          </>
        )}
        <button className="tutorial-floating-skip" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
    );
  }

  // ─── Full modal ────────────────────────────────────
  return (
    <div className="tutorial-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={`tutorial-modal ${isAnimating ? 'tutorial-fade' : ''}`}>
        <div className="tutorial-header">
          <div className="tutorial-step-indicator">
            <span className="tutorial-step-icon">{step.icon}</span>
            <span className="tutorial-step-number">{currentStep + 1} / {totalSteps}</span>
          </div>
          <button className="tutorial-skip" onClick={onClose}>
            Skip <X size={14} />
          </button>
        </div>

        <div className="tutorial-progress">
          <div className="tutorial-progress-bar" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
        </div>

        <div className="tutorial-body">
          <h2 className="tutorial-title">{step.title}</h2>
          {step.content}
        </div>

        <div className="tutorial-footer">
          <button className="tutorial-nav-btn prev" onClick={handlePrev} disabled={currentStep === 0}>
            <ChevronLeft size={16} /> Back
          </button>

          <div className="tutorial-dots">
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`tutorial-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(i)}
              />
            ))}
          </div>

          <button className="tutorial-nav-btn try-it" onClick={startTryIt}>
            <Play size={14} /> Try Now
          </button>
        </div>
      </div>
    </div>
  );
}
