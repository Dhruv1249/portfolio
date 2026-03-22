'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../../contexts/WindowContext';
import {
  Monitor, ChevronRight, ChevronLeft, X, Lightbulb, CheckCircle2,
  Terminal, Globe, FolderOpen, Code, Settings, Keyboard,
  Layers, Sparkles, Rocket, Play, Mail, SlidersHorizontal
} from 'lucide-react';

interface SimWindow {
  appType: string;
  id: string;
  workspace: number;
}

interface TryItConfig {
  instruction: string;
  hint: string;
  commandsToRun?: string[];
  checkFn?: (
    windows: SimWindow[],
    baseline: number,
    executedCommands?: string[],
    appLauncherOpened?: boolean,
    wsSwitched?: boolean
  ) => boolean;
}

type AnimationType =
  | 'welcome'
  | 'linux'
  | 'launcher'
  | 'terminal-open'
  | 'terminal-cmd'
  | 'browser'
  | 'tiling'
  | 'files'
  | 'editor'
  | 'workspace'
  | 'shortcuts'
  | 'settings'
  | 'email'
  | 'finish';

interface TutorialStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  animation: AnimationType;
  quickContent: React.ReactNode | ((executedCommands: string[]) => React.ReactNode);
  detailedContent: React.ReactNode;
  stuckContent: React.ReactNode;
  tryIt?: TryItConfig;
}

interface TutorialProps {
  show: boolean;
  onClose: () => void;
}

// Map of commands to their explanations for the dynamic tutorial step
const COMMAND_EXPLANATIONS: Record<string, string> = {
  help: 'Shows everything this terminal can do.',
  neofetch: 'Shows Linux-style system info and visual identity.',
};

const SHORTCUT_CHEAT_SHEET = [
  'Alt + Enter - Open Terminal',
  'Alt + K - Open App Launcher',
  'Alt + W - Close focused window',
  'Alt + M - Maximize focused window',
  'Alt + F - Open File Manager',
  'Alt + N - Open Code Editor',
  'Alt + B - Open Browser',
  'Alt + E - Open Email app',
  'Alt + S - Open Settings',
  'Alt + J / Alt + K - Focus next or previous window',
  'Alt + 1..4 - Switch workspace',
  'Esc - Close launcher / dismiss tutorial',
];

export default function Tutorial({ show, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tryItCompleted, setTryItCompleted] = useState<Set<number>>(new Set());
  const [minimized, setMinimized] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  const [showStuck, setShowStuck] = useState(false);
  
  const baselineRef = useRef<number>(0);
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);
  const [appLauncherOpened, setAppLauncherOpened] = useState(false);
  const [launcherOpenedByMenu, setLauncherOpenedByMenu] = useState(false);
  const [launcherOpenedByShortcut, setLauncherOpenedByShortcut] = useState(false);
  const [launcherEscCount, setLauncherEscCount] = useState(0);
  const [workspaceSwitched, setWorkspaceSwitched] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const { windows, activeWorkspace } = useWindowManager();
  const baselineBrowserCountRef = useRef(0);

  useEffect(() => {
    if (show) {
      setCurrentStep(0);
      setTryItCompleted(new Set());
      setMinimized(false);
      setExecutedCommands([]);
      setAppLauncherOpened(false);
      setLauncherOpenedByMenu(false);
      setLauncherOpenedByShortcut(false);
      setLauncherEscCount(0);
      setWorkspaceSwitched(false);
      setConfettiBurst(false);
      setShowSkipConfirm(false);
      setShowDetailed(false);
      setShowStuck(false);
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

    const handleAppLauncherClose = () => {
      // keep listener for future tutorial conditions
    };

    const handleLauncherOpenMenu = () => {
      setLauncherOpenedByMenu(true);
    };

    const handleLauncherOpenShortcut = () => {
      setLauncherOpenedByShortcut(true);
    };

    window.addEventListener('terminal-command-run', handleCommandRun);
    window.addEventListener('app-launcher-open', handleAppLauncherOpen);
    window.addEventListener('app-launcher-close', handleAppLauncherClose);
    window.addEventListener('tutorial-launcher-open-menu', handleLauncherOpenMenu);
    window.addEventListener('tutorial-launcher-open-shortcut', handleLauncherOpenShortcut);

    return () => {
      window.removeEventListener('terminal-command-run', handleCommandRun);
      window.removeEventListener('app-launcher-open', handleAppLauncherOpen);
      window.removeEventListener('app-launcher-close', handleAppLauncherClose);
      window.removeEventListener('tutorial-launcher-open-menu', handleLauncherOpenMenu);
      window.removeEventListener('tutorial-launcher-open-shortcut', handleLauncherOpenShortcut);
    };
  }, [show]);

  // Track workspace switch only while the workspace step is active and in try mode.
  useEffect(() => {
    if (minimized && STEPS[currentStep]?.id === 'workspace' && activeWorkspace !== 1) {
      setWorkspaceSwitched(true);
    }
  }, [activeWorkspace, minimized, currentStep]);

  const STEPS: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Portfolio OS',
      icon: <Monitor size={20} />,
      animation: 'welcome',
      quickContent: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            This is a live <strong>desktop simulation</strong>, not a static webpage.
          </p>
          <p>
            One step = one action. You can use keyboard or mouse. You can safely replay this tutorial anytime.
          </p>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            This portfolio mirrors a Linux workflow to show practical engineering habits: keyboard navigation, fast app launching, and tiled windows.
          </p>
          <p>
            If you like deeper explanation, use <strong>Read detailed</strong> on every step.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>If the overlay blocks your view, close with <kbd>Esc</kbd> and reopen using the <strong>Tutorial</strong> button in the top-right of the top bar.</p>
        </div>
      ),
    },

    {
      id: 'linux-why',
      title: 'Why Linux + Hyprland?',
      icon: <Sparkles size={20} />,
      animation: 'linux',
      quickContent: (
        <div className="tutorial-step-content">
          <p>
            Linux gives power-user speed. Hyprland gives clean auto-tiling, so windows organize themselves.
          </p>
          <p>
            That is why this feels different from normal portfolios.
          </p>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Think of it as a compact operating system tour. You get shortcuts, workspaces, and keyboard-first control instead of long scrolling sections.
          </p>
          <p>
            Hyprland-style tiling keeps every app visible and structured, which is ideal for demoing real workflows.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>This step is informational. Press <strong>Next</strong> when ready.</p>
        </div>
      ),
    },

    {
      id: 'launcher-menu',
      title: 'Launcher Step 1: Use Menu Button',
      icon: <Sparkles size={20} />,
      animation: 'launcher',
      quickContent: (
        <div className="tutorial-step-content">
          <p>
            Action only: click <strong>Menu</strong> in top-left to open launcher, then press <kbd>Esc</kbd> to close it.
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>One action at a time. Complete this method first.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Menu is mouse-friendly and easiest for first-time users.
          </p>
          <p>
            What this teaches:
          </p>
          <p>
            1. Discoverability: you can always find apps without remembering shortcuts.
          </p>
          <p>
            2. Recovery: if keyboard fails in a browser tab, Menu path still works.
          </p>
          <p>
            3. Closing behavior: pressing <kbd>Esc</kbd> should always dismiss launcher safely.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>If launcher does not close, click empty desktop area or press <kbd>Esc</kbd> again.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open launcher with top-left Menu, then close with Esc',
        hint: 'Top-left Menu -> Esc',
        checkFn: () => launcherOpenedByMenu && launcherEscCount >= 1,
      },
    },

    {
      id: 'launcher-shortcut',
      title: 'Launcher Step 2: Use Alt + K',
      icon: <Sparkles size={20} />,
      animation: 'launcher',
      quickContent: (
        <div className="tutorial-step-content">
          <p>
            Action only: press <kbd>Alt</kbd> + <kbd>K</kbd> to open launcher, then press <kbd>Esc</kbd> to close it.
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>This is the fastest launcher method.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            You now know both launcher methods: mouse and keyboard. Next, you will open apps with these patterns.
          </p>
          <p>
            Why this matters for speed:
          </p>
          <p>
            1. <kbd>Alt</kbd> + <kbd>K</kbd> is fastest for power users.
          </p>
          <p>
            2. Menu click is best when onboarding new users.
          </p>
          <p>
            3. Both methods reduce failure risk when one input path is blocked.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>If Alt+K is captured by browser/system, use Menu button as fallback.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open launcher with Alt + K, then close with Esc',
        hint: 'Alt + K -> Esc',
        checkFn: () => launcherOpenedByShortcut && launcherEscCount >= 1,
      },
    },

    {
      id: 'terminal-open',
      title: 'Open Terminal',
      icon: <Terminal size={20} />,
      animation: 'terminal-open',
      quickContent: (
        <div className="tutorial-step-content">
          <p>
            Open Terminal with <kbd>Alt</kbd> + <kbd>Enter</kbd>.
          </p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Click <strong>Try Now</strong>, then use Alt + Enter.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Terminal is the fastest way to inspect files, open apps, and show technical depth.
          </p>
          <p>
            The tutorial listens for your command activity automatically.
          </p>
          <p>
            Terminal shortcut recap:
          </p>
          <p>
            - Open: <kbd>Alt</kbd> + <kbd>Enter</kbd>
          </p>
          <p>
            - Close focused window: <kbd>Alt</kbd> + <kbd>W</kbd>
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>Shortcut not working? Open launcher and search for <code>Terminal</code>.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open the Terminal',
        hint: 'Press Alt + Enter',
        checkFn: (wins, baseline) => wins.some(w => w.appType === 'terminal') && wins.length > baseline,
      },
    },

    {
      id: 'terminal-commands',
      title: 'Run 2 Core Linux Commands',
      icon: <Terminal size={20} />,
      animation: 'terminal-cmd',
      quickContent: (execCmds: string[]) => {
        const reqCmds = ['help', 'neofetch'];
        return (
          <div className="tutorial-step-content">
            <p>Now run exactly 2 commands in Terminal:</p>
            <div className="tutorial-shortcuts">
              {reqCmds.map(cmd => {
                const isDone = execCmds.includes(cmd);
                return (
                  <div key={cmd} className="tutorial-shortcut-row" style={{ opacity: isDone ? 0.6 : 1, padding: '14px 0' }}>
                    <div className="tutorial-keys">
                      {isDone ? <CheckCircle2 size={16} color="var(--accent-green)" /> : <span style={{ width: 16 }} />}
                      <kbd>{cmd}</kbd>
                    </div>
                    <span className="tutorial-shortcut-desc" style={{ paddingLeft: '8px', lineHeight: '1.4', fontSize: '0.9rem' }}>
                      {isDone ? <span style={{ color: 'var(--accent-green)' }}>{COMMAND_EXPLANATIONS[cmd]}</span> : 'Run this to see what it does'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="tutorial-callout" style={{ marginTop: '12px' }}>
              <Lightbulb size={16} />
              <span>Tip: use <kbd>Tab</kbd> for auto-complete in this terminal.</span>
            </div>
          </div>
        );
      },
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            <code>help</code> lists available commands. <code>neofetch</code> introduces the Linux-style personality and stack info.
          </p>
          <p>
            You can also open apps directly by typing <code>browser</code>, <code>files</code>, <code>settings</code>, <code>code</code>, or <code>email</code>.
          </p>
          <p>
            Reading output quickly:
          </p>
          <p>
            1. Prompt format is <code>user@portfolio:~$</code>.
          </p>
          <p>
            2. Green text indicates successful command output.
          </p>
          <p>
            3. Use <kbd>Tab</kbd> to autocomplete long command names.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>Click inside Terminal first. Then type command and press Enter. Command matching is exact for this tutorial step.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Run commands in the Terminal',
        hint: 'Type help first, then neofetch',
        commandsToRun: ['help', 'neofetch'],
        checkFn: (_wins, _baseline, execCmds) => {
          const required = ['help', 'neofetch'];
          return required.every(cmd => execCmds?.includes(cmd));
        },
      },
    },

    {
      id: 'browser',
      title: 'Open Browser',
      icon: <Globe size={20} />,
      animation: 'browser',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Action only: open Browser using launcher search.</p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Type <code>Browser</code>, then press Enter.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Browser contains your visual project showcase and links. This is your main demo surface for non-terminal users.
          </p>
          <p>
            What to check after it opens:
          </p>
          <p>
            1. Top navigation sections (Projects, Experience, Certificates).
          </p>
          <p>
            2. Primary CTA buttons.
          </p>
          <p>
            3. Content sections load while terminal remains usable beside it.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>If launcher is closed, open it first with Menu or Alt+K.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Launch the Browser',
        hint: 'Open launcher, type Browser, Enter',
        checkFn: (wins) => {
          const currentBrowserCount = wins.filter(w => w.appType === 'browser').length;
          return currentBrowserCount > baselineBrowserCountRef.current;
        },
      },
    },

    {
      id: 'tiling',
      title: 'Hyprland-Style Window Flow',
      icon: <Layers size={20} />,
      animation: 'tiling',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Windows auto-arrange in tiles. This is the Hyprland behavior you are seeing.</p>
          <p>Try <kbd>Alt</kbd> + <kbd>W</kbd> to close focused window, then reopen it anytime.</p>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Hyprland-style UX favors keyboard speed. Close with Alt + W, maximize with Alt + M, focus cycle with Alt + J/K.
          </p>
          <p>
            Core behavior:
          </p>
          <p>
            1. Focused window receives commands.
          </p>
          <p>
            2. Closing one window reflows layout automatically.
          </p>
          <p>
            3. No manual resize/drag needed for most workflow steps.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>Click a window first so it becomes active, then press Alt + W.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Close a window',
        hint: 'Press Alt + W on a focused window',
        checkFn: (wins, baseline) => wins.length < baseline,
      },
    },

    {
      id: 'files',
      title: 'Open File Manager',
      icon: <FolderOpen size={20} />,
      animation: 'files',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Action only: press <kbd>Alt</kbd> + <kbd>F</kbd> to open File Manager.</p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>This is where live GitHub project trees are explored.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            File Manager fetches repositories and lets you inspect real source files. It is proof-of-work, not screenshot-only portfolio content.
          </p>
          <p>
            Practical flow:
          </p>
          <p>
            1. Pick a project in left sidebar.
          </p>
          <p>
            2. Browse file tree in right panel.
          </p>
          <p>
            3. Double-click file to open in Code Editor.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>Fallback: open launcher and search for <code>Files</code>.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open the File Manager',
        hint: 'Press Alt + F',
        checkFn: wins => wins.some(w => w.appType === 'filemanager'),
      },
    },

    {
      id: 'editor',
      title: 'Open Code Editor',
      icon: <Code size={20} />,
      animation: 'editor',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Action only: double-click one file in File Manager to open <strong>Code Editor</strong>.</p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>You can also open editor directly with <kbd>Alt</kbd> + <kbd>N</kbd>.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Editor is Neovim-inspired and keyboard-first. It is called <strong>Code Editor</strong> in this UI for clarity.
          </p>
          <p>
            What to notice:
          </p>
          <p>
            1. Line numbers and syntax-highlighted content.
          </p>
          <p>
            2. File context remains linked with File Manager selection.
          </p>
          <p>
            3. You can open editor directly with <kbd>Alt</kbd> + <kbd>N</kbd> too.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>No file opened yet? Open Files first, then double-click any file entry from the list.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open a file in the Code Editor',
        hint: 'Double click a file in the File Manager sidebar',
        checkFn: wins => wins.some(w => w.appType === 'neovim'),
      },
    },

    {
      id: 'workspace',
      title: 'Virtual Workspaces',
      icon: <Layers size={20} />,
      animation: 'workspace',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Action only: switch to workspace 2 with <kbd>Alt</kbd> + <kbd>2</kbd>.</p>
          <div className="tutorial-callout">
            <Lightbulb size={16} />
            <span>Workspaces help you separate tasks without clutter.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            You have 4 workspaces. Top bar dots also switch workspaces with mouse clicks.
          </p>
          <p>
            Why workspaces help beginners:
          </p>
          <p>
            1. One workspace can hold reading apps.
          </p>
          <p>
            2. Another can hold coding/terminal apps.
          </p>
          <p>
            3. This avoids visual overload from too many windows at once.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>If keyboard fails, click workspace dots in top bar manually.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Switch to Workspace 2',
        hint: 'Press Alt + 2',
        checkFn: (_wins, _baseline, _execCmds, _appLauncherOpened, wsSwitched) => !!wsSwitched,
      },
    },

    {
      id: 'settings',
      title: 'Explore Settings Customization',
      icon: <Settings size={20} />,
      animation: 'settings',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Action only: open Settings from launcher search to introduce customization flow.</p>
          <div className="tutorial-callout">
            <SlidersHorizontal size={16} />
            <span>Type <code>Settings</code> in launcher and press Enter.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Explore all settings sections: <strong>About</strong>, <strong>Appearance</strong>, <strong>Keyboard</strong>, and <strong>System</strong>.
          </p>
          <p>
            For customization, actively test:
          </p>
          <div className="tutorial-shortcuts">
            <div className="tutorial-shortcut-row"><span className="tutorial-shortcut-desc">1. Toggle animations</span></div>
            <div className="tutorial-shortcut-row"><span className="tutorial-shortcut-desc">2. Toggle transparency and adjust opacity</span></div>
            <div className="tutorial-shortcut-row"><span className="tutorial-shortcut-desc">3. Change global font scale, then click Apply</span></div>
            <div className="tutorial-shortcut-row"><span className="tutorial-shortcut-desc">4. Try a different particle effect preset</span></div>
          </div>
          <p>
            Recommended order for first-time users:
          </p>
          <p>
            1. Increase font scale first for readability.
          </p>
          <p>
            2. Disable heavy effects if performance feels slow.
          </p>
          <p>
            3. Re-enable animations after getting comfortable with navigation.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>Fallback: launcher search for <code>Settings</code>, then open Appearance tab first.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open Settings',
        hint: 'Open launcher, type Settings, Enter',
        checkFn: wins => wins.some(w => w.appType === 'settings'),
      },
    },

    {
      id: 'email',
      title: 'Open Contact App',
      icon: <Mail size={20} />,
      animation: 'email',
      quickContent: (
        <div className="tutorial-step-content">
          <p>Open Email app with <kbd>Alt</kbd> + <kbd>E</kbd> or type <code>email</code> in Terminal.</p>
          <p>This is the fastest direct contact route in this desktop.</p>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            You can use Email app for direct outreach, while Browser/README paths give project context.
          </p>
          <p>
            Contact options:
          </p>
          <p>
            1. Quick message via Email app.
          </p>
          <p>
            2. Project context via Browser before sending.
          </p>
          <p>
            3. Terminal <code>contact</code> style workflows for power users.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>Fallback: launcher search for <code>Email</code>.</p>
        </div>
      ),
      tryIt: {
        instruction: 'Open Email app',
        hint: 'Press Alt + E',
        checkFn: wins => wins.some(w => w.appType === 'email'),
      },
    },

    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts Cheat Sheet',
      icon: <Keyboard size={20} />,
      animation: 'shortcuts',
      quickContent: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            These are the main shortcuts for fast navigation.
          </p>
          <div className="tutorial-shortcuts">
            {SHORTCUT_CHEAT_SHEET.map((item) => (
              <div key={item} className="tutorial-shortcut-row">
                <span className="tutorial-shortcut-desc">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            You can open this tutorial anytime using the <strong>Tutorial</strong> button in the top-right bar.
          </p>
          <p>
            Beginner order: start with <kbd>Alt</kbd> + <kbd>Enter</kbd>, <kbd>Alt</kbd> + <kbd>K</kbd>, and <kbd>Alt</kbd> + <kbd>W</kbd> first.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>If a shortcut is blocked by your browser, use launcher + menu path as fallback.</p>
        </div>
      ),
    },

    {
      id: 'finish',
      title: 'You Are Ready',
      icon: <Rocket size={20} />,
      animation: 'finish',
      quickContent: (
        <div className="tutorial-step-content">
          <p className="tutorial-highlight">
            You now know launcher, terminal, tiling, workspaces, files, code editor, settings customization, and contact flow.
          </p>
          <div className="tutorial-callout success">
            <CheckCircle2 size={16} />
            <span>Use the <strong>Tutorial</strong> button in the top-right bar to replay this anytime.</span>
          </div>
        </div>
      ),
      detailedContent: (
        <div className="tutorial-step-content">
          <p>
            Recommended next exploration: run <code>projects</code>, <code>skills</code>, then inspect source with Files + Code Editor.
          </p>
        </div>
      ),
      stuckContent: (
        <div className="tutorial-step-content">
          <p>No blocker here. Hit Finish and explore.</p>
        </div>
      ),
    },
  ];

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isTryItDone = tryItCompleted.has(currentStep);
  const showTryIt = !!step.tryIt && !isTryItDone;

  useEffect(() => {
    if (!show || !minimized) return;
    if (!(step.id === 'launcher-menu' || step.id === 'launcher-shortcut')) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLauncherEscCount(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [show, minimized, step.id]);

  const startTryIt = () => {
    setConfettiBurst(false);
    if (step.id.startsWith('launcher') || step.id === 'browser') {
      setAppLauncherOpened(false);
    }
    if (step.id.startsWith('launcher')) {
      setLauncherOpenedByMenu(false);
      setLauncherOpenedByShortcut(false);
      setLauncherEscCount(0);
    }
    if (step.id === 'workspace') {
      setWorkspaceSwitched(false);
    }
    baselineRef.current = windows.length;
    baselineBrowserCountRef.current = windows.filter(w => w.appType === 'browser').length;
    setMinimized(true);
  };

  useEffect(() => {
    if (!show || !minimized || !step?.tryIt?.checkFn) return;
    if (tryItCompleted.has(currentStep)) return;

    const checkInterval = setInterval(() => {
      if (step.tryIt!.checkFn!(windows, baselineRef.current, executedCommands, appLauncherOpened, workspaceSwitched)) {
        setTryItCompleted(prev => new Set([...prev, currentStep]));
        setConfettiBurst(true);
        window.setTimeout(() => setConfettiBurst(false), 1200);
      }
    }, 300);

    return () => clearInterval(checkInterval);
  }, [show, minimized, currentStep, windows, step, tryItCompleted, executedCommands, appLauncherOpened, workspaceSwitched]);

  const getHighlightTargetSelector = () => {
    if (step.id === 'launcher-menu') return '.topbar-launcher-btn';
    if (step.id === 'browser') return appLauncherOpened ? '.app-launcher-search' : '.topbar-launcher-btn';
    if (step.id === 'workspace') return '.workspace-switcher';
    if (step.id === 'settings') return appLauncherOpened ? '.app-launcher-search' : '.topbar-launcher-btn';
    return null;
  };

  useEffect(() => {
    if (!show || !minimized) return;

    const selector = getHighlightTargetSelector();
    if (!selector) return;

    const highlightClass = 'tutorial-target-highlight';

    const clearHighlight = () => {
      const highlighted = document.querySelectorAll(`.${highlightClass}`);
      highlighted.forEach(node => node.classList.remove(highlightClass));
    };

    const updateHighlight = () => {
      clearHighlight();
      const target = document.querySelector(selector) as HTMLElement | null;
      if (target) target.classList.add(highlightClass);
    };

    updateHighlight();
    const interval = window.setInterval(updateHighlight, 120);

    return () => {
      window.clearInterval(interval);
      clearHighlight();
    };
  }, [show, minimized, step.id, windows, activeWorkspace]);

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
  }, [show, onClose, isLastStep, minimized]);

  useEffect(() => {
    setShowDetailed(false);
    setShowStuck(false);
  }, [currentStep]);

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

  if (minimized) {
    const isStepDone = tryItCompleted.has(currentStep);

    const getCompletionHint = () => {
      if (step.id === 'launcher-menu') return 'Done. Re-open launcher to explore apps, or Continue.';
      if (step.id === 'launcher-shortcut') return 'Done. Shortcut path learned. Continue when ready.';
      if (step.id === 'browser') return 'Done. Explore Browser for a moment, or Continue.';
      if (step.id === 'terminal-open') return 'Done. Type anything in terminal to explore, or Continue.';
      if (step.id === 'terminal-commands') return 'Done. Review command output, or Continue.';
      if (step.id === 'files') return 'Done. Browse project list briefly, or Continue.';
      if (step.id === 'editor') return 'Done. Read opened code for a moment, or Continue.';
      if (step.id === 'workspace') return 'Done. Try switching back and forth, or Continue.';
      if (step.id === 'settings') return 'Done. Explore customization toggles, or Continue.';
      if (step.id === 'email') return 'Done. Check contact flow, or Continue.';
      return 'Done. Explore this feature, or Continue.';
    };

    let hintText = step.tryIt?.hint;
    if (step.tryIt?.commandsToRun) {
      const remainingCmds = step.tryIt.commandsToRun.filter(cmd => !executedCommands.includes(cmd));
      if (remainingCmds.length > 0) {
        hintText = `Type: ${remainingCmds[0]}`;
      } else {
        hintText = `All commands executed!`;
      }
    }

    if (step.id === 'launcher-menu') {
      hintText = launcherOpenedByMenu
        ? (launcherEscCount >= 1 ? getCompletionHint() : 'Now press Esc to close launcher')
        : 'Look for highlighted top-left Menu button, then click it';
    }

    if (step.id === 'launcher-shortcut') {
      hintText = launcherOpenedByShortcut
        ? (launcherEscCount >= 1 ? getCompletionHint() : 'Now press Esc to close launcher')
        : 'Press Alt + K to open launcher';
    }

    if (isStepDone && step.id !== 'launcher-menu' && step.id !== 'launcher-shortcut') {
      hintText = getCompletionHint();
    }

    return (
      <div className="tutorial-floating-hint" role="status" aria-live="polite">
        {confettiBurst && (
          <div className="tutorial-confetti" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="tutorial-confetti-piece"
                style={{
                  left: `${(i / 18) * 100}%`,
                  animationDelay: `${(i % 6) * 0.03}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="tutorial-floating-pulse" />
        <div className="tutorial-floating-text">
          <strong>Action: {step.tryIt?.instruction}</strong>
          <span>{hintText}</span>
        </div>

        {!isStepDone ? (
          <button
            className="tutorial-floating-skip"
            onClick={() => setMinimized(false)}
            aria-label="Return to tutorial panel"
          >
            Return to tutorial
          </button>
        ) : (
          <div className="tutorial-floating-actions">
            <button className="tutorial-floating-done-btn" onClick={() => setMinimized(false)}>
              Review this step
            </button>
            <button
              className="tutorial-floating-next-btn"
              onClick={() => {
                setMinimized(false);
                handleNext();
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }

  const renderQuickContent = typeof step.quickContent === 'function'
    ? step.quickContent(executedCommands)
    : step.quickContent;

  const renderStepVisual = () => {
    switch (step.animation) {
      case 'welcome':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="title">Portfolio OS</span>
            </div>
            <div className="tutorial-mock-body tutorial-mock-grid-bg">
              <div className="tutorial-mock-pill" />
              <div className="tutorial-mock-pill short" />
            </div>
          </div>
        );
      case 'linux':
        return (
          <div className="tutorial-linux-compare">
            <div className="pane legacy">
              <div className="label">Typical Portfolio</div>
              <div className="bar" />
              <div className="bar short" />
            </div>
            <div className="pane hypr animated">
              <div className="label">Linux + Hyprland Flow</div>
              <div className="tile-row">
                <div className="tile" />
                <div className="tile" />
              </div>
            </div>
          </div>
        );
      case 'launcher':
        return (
          <div className="tutorial-mock-launcher">
            <div className="search">Search applications...</div>
            <div className="apps">
              <span>Terminal</span>
              <span>Browser</span>
              <span>Files</span>
              <span>Settings</span>
              <span>Code Editor</span>
              <span>Email</span>
            </div>
          </div>
        );
      case 'terminal-open':
      case 'terminal-cmd':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="title">zsh -80x24</span>
            </div>
            <div className="tutorial-terminal-preview">
              <div>user@portfolio:~$ help</div>
              <div>user@portfolio:~$ neofetch</div>
              <div className="cursor-line">user@portfolio:~$ <span className="cursor" /></div>
            </div>
          </div>
        );
      case 'browser':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="title">Browser - Portfolio</span>
            </div>
            <div className="tutorial-browser-preview">
              <div className="url">dhruv.dev</div>
              <div className="hero" />
            </div>
          </div>
        );
      case 'tiling':
        return (
          <div className="tutorial-tiling-preview">
            <div className="tile left" />
            <div className="tile right" />
          </div>
        );
      case 'files':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="title">Files</span>
            </div>
            <div className="tutorial-files-preview">
              <div className="sidebar">CALYX<br/>UrbanSwap<br/>PR Tracker<br/>Expense Tracker</div>
              <div className="content">Select a project to view files</div>
            </div>
          </div>
        );
      case 'editor':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="title">Code Editor</span>
            </div>
            <div className="tutorial-editor-preview">
              <div className="line"><span>1</span><span>import React from 'react';</span></div>
              <div className="line"><span>2</span><span></span></div>
              <div className="line"><span>3</span><span>export default function Demo() {'{'} </span></div>
              <div className="line"><span>4</span><span>  return &lt;div&gt;Hello&lt;/div&gt;;</span></div>
              <div className="line"><span>5</span><span>{'}'}</span></div>
            </div>
          </div>
        );
      case 'workspace':
        return (
          <div className="tutorial-workspace-preview">
            <div className="dots"><span className="active">1</span><span>2</span><span>3</span><span>4</span></div>
            <div className="strip" />
          </div>
        );
      case 'shortcuts':
        return (
          <div className="tutorial-workspace-preview">
            <div className="dots"><span className="active">Alt</span><span>K</span><span>W</span><span>1..4</span></div>
            <div className="strip" />
          </div>
        );
      case 'settings':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="title">Settings</span>
            </div>
            <div className="tutorial-settings-preview">
              <div className="tabs">About<br/>Appearance<br/>Keyboard<br/>System</div>
              <div className="panel">Animations: ON<br/>Transparency: ON<br/>Font Scale: 120%<br/>Particles: Galaxy</div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="tutorial-mock-window">
            <div className="tutorial-mock-header">
              <span className="dot" />
              <span className="title">Email Dhruv</span>
            </div>
            <div className="tutorial-email-preview">
              <div>To: dhruv1249.lm@gmail.com</div>
              <div className="input" />
              <div className="input short" />
            </div>
          </div>
        );
      case 'finish':
        return (
          <div className="tutorial-finish-preview">
            <div className="check">Launcher</div>
            <div className="check">Terminal</div>
            <div className="check">Files + Code Editor</div>
            <div className="check">Settings Customization</div>
          </div>
        );
      default:
        return <div className="tutorial-mock-window" />;
    }
  };

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
          <button
            className="tutorial-skip"
            onClick={() => setShowSkipConfirm(true)}
          >
            Skip <X size={14} />
          </button>
        </div>

        <div className="tutorial-progress">
          <div className="tutorial-progress-bar" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
        </div>

        <div className="tutorial-body">
          <div className="tutorial-sr-status" aria-live="polite" aria-atomic="true">
            Step {currentStep + 1} of {totalSteps}. {step.title}.
          </div>

          <h2 className="tutorial-title">
            {step.title}
            {isTryItDone && <CheckCircle2 size={18} color="var(--accent-green)" style={{ marginLeft: '8px' }} />}
          </h2>

          <div className={`tutorial-visual tutorial-visual-${step.animation}`} aria-hidden="true">
            {renderStepVisual()}
          </div>

          {renderQuickContent}

          <div className="tutorial-detail-controls" aria-label="Extra help options">
            <span className="tutorial-detail-label">Need more help?</span>
            <button className="tutorial-inline-btn" onClick={() => setShowDetailed(prev => !prev)} aria-label="Toggle detailed explanation">
              {showDetailed ? 'Hide details' : 'Read details'}
            </button>
            <button className="tutorial-inline-btn" onClick={() => setShowStuck(prev => !prev)} aria-label="Toggle stuck help">
              {showStuck ? 'Hide stuck help' : 'Need stuck help'}
            </button>
          </div>

          {showDetailed && (
            <div className="tutorial-detail-panel">
              {step.detailedContent}
            </div>
          )}

          {showStuck && (
            <div className="tutorial-detail-panel tutorial-detail-panel-warning">
              {step.stuckContent}
            </div>
          )}
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

        {showSkipConfirm && (
          <div className="tutorial-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm skipping tutorial">
            <div className="tutorial-confirm-card">
              <h3>Skip full tutorial?</h3>
              <p>This will mark tutorial as completed for this browser. You can reopen it later with the Tutorial button.</p>
              <div className="tutorial-confirm-actions">
                <button className="tutorial-nav-btn" onClick={() => setShowSkipConfirm(false)}>
                  Keep Tutorial
                </button>
                <button
                  className="tutorial-nav-btn next"
                  onClick={() => {
                    setShowSkipConfirm(false);
                    onClose();
                  }}
                >
                  Yes, Skip All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
