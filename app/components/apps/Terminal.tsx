'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { executeCommand } from '../../lib/commands';

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

    const result = executeCommand(input, currentPath);
    
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
      // Basic tab completion could be added here
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
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
    </div>
  );
});

export default Terminal;
