'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { executeCommand, commandNames } from '../../lib/commands';
import { listDirectory } from '../../lib/filesystem';

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
  path: string;
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

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Run neofetch on mount
  useEffect(() => {
    const result = executeCommand('neofetch', '~');
    setHistory([{ command: 'neofetch', output: result.output, path: '~' }]);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Clear tab state
    setTabSuggestions([]);
    setTabIndex(-1);

    const result = executeCommand(input, currentPath, commandHistory);

    // Handle clear command
    if (result.output === '__CLEAR__') {
      setHistory([]);
      setInput('');
      return;
    }

    // Update path if command changes it
    if (result.newPath) {
      setCurrentPath(result.newPath);
    }

    // Add to history
    setHistory(prev => [...prev, {
      command: input,
      output: result.output,
      path: currentPath,
    }]);

    // Add to command history for up/down navigation
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const getTabCompletions = (text: string): string[] => {
    const parts = text.split(/\s+/);

    if (parts.length <= 1) {
      // Complete command names
      const prefix = parts[0].toLowerCase();
      return commandNames.filter(cmd => cmd.startsWith(prefix) && cmd !== prefix);
    }

    // Complete file/directory names for the last argument
    const lastArg = parts[parts.length - 1];
    const contents = listDirectory(currentPath);
    return contents
      .map(item => item.name + (item.type === 'directory' ? '/' : ''))
      .filter(name => name.toLowerCase().startsWith(lastArg.toLowerCase()) && name !== lastArg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
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
        const completions = getTabCompletions(input);
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
    <div className="terminal" ref={terminalRef} onClick={handleTerminalClick}>
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
            <div style={{ marginTop: '4px', paddingLeft: '0' }}>
              {entry.output}
            </div>
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
  );
});

export default Terminal;
