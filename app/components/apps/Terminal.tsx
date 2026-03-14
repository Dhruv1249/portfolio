'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { executeCommand, commandNames } from '../../lib/commands';
import { listDirectory } from '../../lib/filesystem';
import { useWindowManager } from '../../contexts/WindowContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
  path: string;
  id?: string;
}

const Terminal = React.memo(function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const [originalInput, setOriginalInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const { openWindow } = useWindowManager();
  const { animations } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount and after execution
  useEffect(() => {
    if (!isExecuting) {
      inputRef.current?.focus();
    }
  }, [isExecuting]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Run neofetch on mount
  useEffect(() => {
    executeCommand('neofetch', '~').then(result => {
      setHistory([{ command: 'neofetch', output: result.output, path: '~' }]);
    });
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isExecuting) return;

    setIsExecuting(true);
    // Clear tab state
    setTabSuggestions([]);
    setTabIndex(-1);

    const oldInput = input;
    const oldPath = currentPath;
    // Dispatch event for Tutorial tracking
    window.dispatchEvent(
      new CustomEvent('terminal-command-run', { detail: { command: oldInput.trim() } })
    );
    
    // Set input to empty immediately so user cannot double-submit duplicate commands easily
    setInput('');
    const executionId = Date.now().toString() + Math.random().toString();
    
    setHistory(prev => [...prev, {
      command: oldInput,
      output: <span style={{ color: 'var(--text-muted)' }}>Running...</span>,
      path: oldPath,
      id: executionId
    }]);

    // Add to command history for up/down navigation
    setCommandHistory(prev => [...prev, oldInput]);
    setHistoryIndex(-1);
    
    const result = await executeCommand(oldInput, oldPath, commandHistory);

    // Handle clear command
    if (result.output === '__CLEAR__') {
      setHistory([]);
      setIsExecuting(false);
      return;
    }

    // Open app if command requests it
    if (result.openApp) {
      openWindow(
        result.openApp.appType as any,
        result.openApp.title,
        result.openApp.appData
      );
    }

    // Update path if command changes it
    if (result.newPath) {
      setCurrentPath(result.newPath);
    }

    // Update history
    setHistory(prev => prev.map(entry => {
      if (entry.id === executionId) {
        return { ...entry, output: result.output, id: undefined };
      }
      return entry;
    }));
    
    setIsExecuting(false);
  };

  const getTabCompletions = async (text: string): Promise<string[]> => {
    const parts = text.split(/\s+/);

    if (parts.length <= 1) {
      // Complete command names
      const prefix = parts[0].toLowerCase();
      return commandNames.filter(cmd => cmd.startsWith(prefix) && cmd !== prefix);
    }

    // Complete file/directory names for the last argument
    const lastArg = parts[parts.length - 1];
    
    // Support nested path completions
    const pathParts = lastArg.split('/');
    const searchName = pathParts.pop() || '';
    const dirPathStr = pathParts.length > 0 ? pathParts.join('/') : '.';
    
    const targetDir = dirPathStr === '.' 
        ? currentPath 
        : (dirPathStr.startsWith('~') || dirPathStr.startsWith('/') 
             ? dirPathStr 
             : `${currentPath}/${dirPathStr}`);
             
    const contents = await listDirectory(targetDir);
    return contents
      .map(item => item.name + (item.type === 'directory' ? '/' : ''))
      .filter(name => name.toLowerCase().startsWith(searchName.toLowerCase()) && name !== searchName)
      .map(name => pathParts.length > 0 ? `${dirPathStr}/${name}` : name);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();

      if (tabSuggestions.length === 0) {
        // First tab press - get completions
        const completions = await getTabCompletions(input);
        if (completions.length === 1) {
          // Single match — complete immediately
          const parts = input.split(/\s+/);
          if (parts.length <= 1) {
            setInput(completions[0] + ' ');
          } else {
            parts[parts.length - 1] = completions[0];
            setInput(parts.join(' '));
          }
        } else if (completions.length > 1) {
          setTabSuggestions(completions);
          setTabIndex(0);
          setOriginalInput(input);

          // Apply first suggestion
          const parts = input.split(/\s+/);
          if (parts.length <= 1) {
            setInput(completions[0]);
          } else {
            parts[parts.length - 1] = completions[0];
            setInput(parts.join(' '));
          }
        }
      } else {
        // Cycle through suggestions
        const nextIndex = (tabIndex + 1) % tabSuggestions.length;
        setTabIndex(nextIndex);
        const parts = originalInput.split(/\s+/);
        if (parts.length <= 1) {
          setInput(tabSuggestions[nextIndex]);
        } else {
          parts[parts.length - 1] = tabSuggestions[nextIndex];
          setInput(parts.join(' '));
        }
      }
      return;
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      // Show the cancelled command in history
      setHistory(prev => [...prev, {
        command: input + '^C',
        output: '',
        path: currentPath,
      }]);
      setInput('');
    }

    // Clear tab state on any other key
    if (e.key !== 'Tab') {
      setTabSuggestions([]);
      setTabIndex(-1);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const getDisplayPath = (path: string) => {
    if (path === '~') return '~';
    return path.replace(/^~\//, '');
  };

  return (
    <div className="terminal-container" style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      <div className="terminal" ref={terminalRef} onClick={handleTerminalClick} style={{ height: '100%', overflowY: 'auto' }}>
        <div className="terminal-output">
        {history.map((entry, i) => (
          <div key={i} className="terminal-line" style={{ marginBottom: '8px' }}>
            <div className="terminal-prompt">
              <span className="terminal-user">user@portfolio</span>
              <span className="terminal-separator">:</span>
              <span className="terminal-path">{getDisplayPath(entry.path)}</span>
              <span className="terminal-symbol">$</span>
              <span style={{ color: 'var(--text-primary)' }}>{entry.command}</span>
            </div>
            <motion.div
              initial={animations ? { clipPath: 'inset(0 100% 0 0)', opacity: 0 } : false}
              animate={animations ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 } : false}
              transition={animations ? { duration: 0.3, ease: "linear" } : { duration: 0 }}
              style={{ marginTop: '4px', paddingLeft: '0' }}
            >
              {entry.output}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="terminal-prompt" style={{ marginTop: '8px' }}>
        <span className="terminal-user">user@portfolio</span>
        <span className="terminal-separator">:</span>
        <span className="terminal-path">{getDisplayPath(currentPath)}</span>
        <span className="terminal-symbol">$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          disabled={isExecuting}
          autoFocus
        />
      </div>

      {/* Tab completion suggestions */}
      {tabSuggestions.length > 1 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '8px 0',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}>
          {tabSuggestions.map((s, i) => (
            <span key={s} style={{
              color: i === tabIndex ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: i === tabIndex ? 600 : 400,
            }}>
              {s}
            </span>
          ))}
        </div>
      )}
      </div>
      {/* CRT Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 mix-blend-overlay opacity-30 pointer-events-none" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%'
      }} />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flicker {
          0% { opacity: 0.03; }
          50% { opacity: 0.01; }
          100% { opacity: 0.04; }
        }
        .terminal-container::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(18, 16, 16, 0.1);
          opacity: 0;
          z-index: 50;
          pointer-events: none;
          animation: flicker 0.15s infinite;
        }
      `}} />
    </div>
  );
});

export default Terminal;
