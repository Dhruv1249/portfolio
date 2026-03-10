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
  // If provided, the step requires completing this array of commands (for terminal step)
  commandsToRun?: string[];
  // If checkFn is provided, auto-detect completion
  checkFn?: (windows: any[], baseline: number, executedCommands?: string[], appLauncherOpened?: boolean, wsSwitched?: boolean) => boolean;
}

interface TutorialStep {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode | ((executedCommands: string[]) => React.ReactNode);
  tryIt?: TryItConfig; // Optional now — informational steps won't have it
}

interface TutorialProps {
  show: boolean;
  onClose: () => void;
}

// Map of commands to their explanations for the dynamic tutorial step
const COMMAND_EXPLANATIONS: Record<string, string> = {
  'help': 'This shows you a list of every command the terminal understands.',
  'neofetch': 'A classic Linux command! It prints out system info and a cool logo. Hackers use this to show off their setups.',
  'cat README.md': 'The "cat" command reads a file and spits the text out here. You just read the README file!',
};

export default function Tutorial({ show, onClose }: TutorialProps) {
  // ... (state and effects stay the same)
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tryItCompleted, setTryItCompleted] = useState<Set<number>>(new Set());
  const [minimized, setMinimized] = useState(false);
  
  const baselineRef = useRef<number>(0);
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);
  const [appLauncherOpened, setAppLauncherOpened] = useState(false);
  const [workspaceSwitched, setWorkspaceSwitched] = useState(false);

  const { windows, activeWorkspace, closeWindow } = useWindowManager();

  useEffect(() => {
    if (show) {
      setCurrentStep(0);
      setTryItCompleted(new Set());
      setMinimized(false);
      setExecutedCommands([]);
      setAppLauncherOpened(false);
      setWorkspaceSwitched(false);
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const handleCommandRun = (e: Event) => {
      const customEvent = e as CustomEvent;
      const cmd = customEvent.detail.command.trim();
      setExecutedCommands(prev => {
        if (!prev.includes(cmd)) return [...prev, cmd];
        return prev;
      });
    };

    const handleAppLauncherOpen = () => {
      setAppLauncherOpened(true);
    };

    window.addEventListener('terminal-command-run', handleCommandRun);
    window.addEventListener('app-launcher-open', handleAppLauncherOpen);

    return () => {
      window.removeEventListener('terminal-command-run', handleCommandRun);
      window.removeEventListener('app-launcher-open', handleAppLauncherOpen);
    };
  }, [show]);

  // Track workspace switches for that specific step
  useEffect(() => {
    if (minimized && STEPS[currentStep]?.title === 'Virtual Workspaces' && activeWorkspace !== 1) {
      setWorkspaceSwitched(true);
    }
  }, [activeWorkspace, minimized, currentStep]);

  // ─── Steps ─────────────────────────────────────────
  const STEPS: TutorialStep[] = [
    {
      title: 'Welcome to Portfolio OS',
      icon: <Monitor size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            You&apos;re not looking at a regular portfolio — this is an <strong>interactive desktop</strong> running in your browser.
          </p>
          <p>
            Everything works just like a real computer. You can open apps, move things around, and type commands. I built this to show off my skills in a fun, hands-on way.
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Next</strong> to start the interactive guide, or press Esc to skip and explore.</span>
          </div>
        </div>
      ),
    },

    {
      title: 'Open the Terminal',
      icon: <Terminal size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            Let&apos;s start with the heart of Linux: the <strong>Terminal</strong>. It might look scary, but it&apos;s just a way to talk to the computer using text instead of a mouse.
          </p>
          <p>
            To open it, we use a keyboard shortcut. Don&apos;t worry, my shortcuts use the <kbd>Alt</kbd> key so they won&apos;t mess with whatever browser you are using!
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong>, then press <kbd>Alt</kbd> + <kbd>Enter</kbd> to open a terminal.</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open the Terminal',
        hint: 'Press  Alt + Enter',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'terminal') && wins.length > baseline,
      },
    },

    {
      title: 'Talk to the Computer',
      icon: <Terminal size={20} />,
      content: (execCmds: string[]) => {
        const reqCmds = ['help', 'neofetch', 'cat README.md'];
        return (
          <div className="tutorial-step-content">
            <p>Awesome! Now that the terminal is open, let&apos;s give the computer some instructions.</p>
            <p>Type these exact words into the terminal and hit Enter after each one:</p>
            <div className="tutorial-shortcuts">
              {reqCmds.map(cmd => {
                const isDone = execCmds.includes(cmd);
                return (
                  <div key={cmd} className="tutorial-shortcut-row" style={{ opacity: isDone ? 0.6 : 1, padding: '12px 0' }}>
                    <div className="tutorial-keys">
                      {isDone ? <CheckCircle2 size={16} color="var(--accent-green)" /> : <span style={{ width: 16 }} />}
                      <kbd>{cmd}</kbd>
                    </div>
                    <span className="tutorial-shortcut-desc" style={{ paddingLeft: '8px', lineHeight: '1.4' }}>
                      {isDone ? <span style={{ color: 'var(--accent-green)' }}>{COMMAND_EXPLANATIONS[cmd]}</span> : 'Run this to see what it does'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="tutorial-callout" style={{ marginTop: '12px' }}>
              <Lightbulb size={16} />
              <span><strong>Pro Tip:</strong> Type <code>cat RE</code> and press the <kbd>Tab</kbd> key. The terminal will auto-complete the rest for you!</span>
            </div>
          </div>
        );
      },
      tryIt: {
        instruction: 'Run commands in the Terminal',
        hint: 'Type  help  and press Enter to begin',
        commandsToRun: ['help', 'neofetch', 'cat README.md'],
        checkFn: (wins, baseline, execCmds) => {
          const required = ['help', 'neofetch', 'cat README.md'];
          return required.every(cmd => execCmds?.includes(cmd));
        },
      },
    },

    {
      title: 'The App Launcher',
      icon: <Sparkles size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            Now let&apos;s open a visual app! The <strong>App Launcher</strong> is just like the Start Menu on Windows or Spotlight on a Mac.
          </p>
          <p>
            When you open it, type &quot;Browser&quot; and hit Enter to launch my portfolio browser!
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong>, press <kbd>Alt</kbd> + <kbd>Space</kbd>, type &quot;Browser&quot; and press Enter.</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Launch the Browser',
        hint: 'Press  Alt + Space , type "Browser", and hit Enter',
        checkFn: (wins, baseline, execCmds, appLauncherOpened) => {
          // They must open the launcher, AND then open the browser
          return !!appLauncherOpened && wins.some(w => w.appType === 'browser') && wins.filter(w => w.appType === 'browser').length > 0;
        },
      },
    },

    {
      title: 'The Browser',
      icon: <Globe size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            Great job! You just opened the <strong>Browser</strong>.
          </p>
          <p>
            This app is really important because it&apos;s where all my actual web development projects live. You can click on any project in there to see live demos and information about the apps I&apos;ve built.
          </p>
        </div>
      ),
    },

    {
      title: 'Window Management',
      icon: <Layout size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            Notice how the Terminal and Browser automatically split the screen? This is called a <strong>Tiling Window Manager</strong>. You never have to drag or resize windows manually; they arrange themselves perfectly to use every pixel!
          </p>
          <p>Let&apos;s try closing the window you are currently looking at. You can always re-open them!</p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong>, then press <kbd>Alt</kbd> + <kbd>W</kbd> to close the active window.</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Close a window',
        hint: 'Press  Alt + W ',
        checkFn: (wins, baseline) => wins.length < baseline,
      },
    },

    {
      title: 'Connecting to GitHub',
      icon: <FolderOpen size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            I want to prove I actually wrote the code for my projects. Let&apos;s open the <strong>File Manager</strong>.
          </p>
          <p>
            This app reaches out directly to my real GitHub account and fetches the live source code of all my projects right into this computer.
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong> and press <kbd>Alt</kbd> + <kbd>F</kbd> to open the File Manager.</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open the File Manager',
        hint: 'Press  Alt + F ',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'filemanager') && wins.filter(w => w.appType === 'filemanager').length > 0,
      },
    },

    {
      title: 'Reading Source Code',
      icon: <Code size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            Once you see files in the File Manager, you can view them using <strong>Neovim</strong>.
          </p>
          <p>
            Neovim is a famous code editor beloved by developers because you never have to take your hands off the keyboard. I included it so you can read my project code natively!
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong>, then Double-Click any file in the File Manager to open it in Neovim!</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Open a file in Neovim',
        hint: 'Double click a file in the File Manager sidebar',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'neovim') && wins.filter(w => w.appType === 'neovim').length > 0,
      },
    },

    {
      title: 'Virtual Workspaces',
      icon: <Layers size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p>
            Things are getting crowded! Professional developers use <strong>Workspaces</strong> to stay organized. Think of them as multiple physical monitors, but all on one screen.
          </p>
          <p>
            You have 4 workspaces. If workspace 1 is full, just switch to workspace 2 for a completely fresh, empty desktop!
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong> and press <kbd>Alt</kbd> + <kbd>2</kbd> to switch to an empty workspace!</span>
          </div>
        </div>
      ),
      tryIt: {
        instruction: 'Switch to Workspace 2',
        hint: 'Press  Alt + 2 ',
        checkFn: (wins, baseline, execCmds, appLauncherOpened, wsSwitched) => !!wsSwitched,
      },
    },

    {
      title: 'You\'re Ready!',
      icon: <Rocket size={20} />,
      content: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            You made it! You now know how to navigate this portfolio like a pro Linux power-user.
          </p>
          <p>Go ahead and explore my projects, view my code, or just mess around in the terminal.</p>
          <div className="tutorial-callout success">
            <CheckCircle2 size={16} />
            <span>Click the <strong>?</strong> icon in the top right to re-open this tutorial anytime!</span>
          </div>
        </div>
      ),
    },
  ];

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isTryItDone = tryItCompleted.has(currentStep);
  const showTryIt = !!step.tryIt && !isTryItDone;

  const startTryIt = () => {
    baselineRef.current = windows.length;
    setMinimized(true);
  };

  // ─── Auto-detect completion ────────────────────────
  useEffect(() => {
    if (!show || !minimized || !step?.tryIt?.checkFn) return;
    if (tryItCompleted.has(currentStep)) return;

    const checkInterval = setInterval(() => {
      // Pass the tracked events as well
      if (step.tryIt!.checkFn!(windows, baselineRef.current, executedCommands, appLauncherOpened, workspaceSwitched)) {
        setTryItCompleted(prev => new Set([...prev, currentStep]));
        // When successfully detected, we no longer auto-advance. We wait for user action.
        setMinimized(false); 
      }
    }, 300);

    return () => clearInterval(checkInterval);
  }, [show, minimized, currentStep, windows, step, tryItCompleted, executedCommands, appLauncherOpened, workspaceSwitched]);

  // ─── Keyboard Navigation ──────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;
      if (minimized) return; // Ignore keys when minimized so they go to desktop
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

  // ─── Minimized: Floating hint bar at bottom ────────
  if (minimized) {
    let hintText = step.tryIt?.hint;
    if (step.tryIt?.commandsToRun) {
      const remainingCmds = step.tryIt.commandsToRun.filter(cmd => !executedCommands.includes(cmd));
      if (remainingCmds.length > 0) {
        hintText = `Type: ${remainingCmds[0]}`;
      } else {
        hintText = `All commands executed!`;
      }
    }

    return (
      <div className="tutorial-floating-hint">
        <div className="tutorial-floating-pulse" />
        <div className="tutorial-floating-text">
          <strong>{step.tryIt?.instruction}</strong>
          <span>{hintText}</span>
        </div>
        <button className="tutorial-floating-skip" onClick={() => setMinimized(false)}>
          Back <X size={14} />
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
          <h2 className="tutorial-title">
            {step.title}
            {isTryItDone && <CheckCircle2 size={18} color="var(--accent-green)" style={{ marginLeft: '8px' }} />}
          </h2>
          {/* Dynamic render if content is a function (used for command execution tracking) */}
          {typeof step.content === 'function' ? step.content(executedCommands) : step.content}
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

          {showTryIt ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="tutorial-nav-btn" 
                onClick={handleNext}
                style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)' }}
              >
                Skip
              </button>
              <button className="tutorial-nav-btn try-it" onClick={startTryIt}>
                <Play size={14} /> Try Now
              </button>
            </div>
          ) : (
            <button className="tutorial-nav-btn next" onClick={isLastStep ? onClose : handleNext}>
              {isLastStep ? 'Finish' : (isTryItDone ? 'Next' : 'Next')} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
