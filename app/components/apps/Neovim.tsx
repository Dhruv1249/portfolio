'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { REPOS, RepoFile, fetchRepoTree, fetchFileContent, detectLanguage } from '../../lib/github';
import { RepoIcon, FileIcon } from '../../lib/icons';
import { Loader2, Github, ChevronDown, CornerDownLeft } from 'lucide-react';
import Prism from 'prismjs';

import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-docker';

const PRISM_LANG_MAP: Record<string, string> = {
  typescript: 'tsx', javascript: 'jsx', python: 'python', lua: 'lua',
  rust: 'rust', go: 'go', json: 'json', markdown: 'markdown',
  css: 'css', html: 'html', yaml: 'yaml', toml: 'toml',
  shell: 'bash', c: 'c', cpp: 'cpp', java: 'java',
  sql: 'sql', dockerfile: 'docker', text: 'text',
};

function highlightCode(code: string, language: string): string {
  const prismLang = PRISM_LANG_MAP[language] || 'text';
  const grammar = Prism.languages[prismLang];
  if (!grammar) {
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return Prism.highlight(code, grammar, prismLang);
}

// ─── Render a line with a visible cursor at a given column ───
function renderLineWithCursor(html: string, col: number, showCursor: boolean): string {
  if (!showCursor) return html || '&nbsp;';
  // Strip html to plain text to find cursor position, then re-render.
  // Simpler approach: We add the cursor as an overlay via CSS, not inline.
  return html || '&nbsp;';
}

// ─── Project Selection Modal ─────────────────────────
function ProjectSelector({ onSelect, onClose }: {
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mountedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, REPOS.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        if (Date.now() - mountedAtRef.current < 250) return;
        e.preventDefault();
        onSelect(selectedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIndex, onSelect, onClose]);

  return (
    <div className="neovim-project-overlay" onClick={onClose}>
      <div className="neovim-project-modal" onClick={e => e.stopPropagation()}>
        <div className="neovim-project-header">
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Select Project</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>j/k · Enter · Esc</span>
        </div>
        <div className="neovim-project-list" ref={listRef}>
          {REPOS.map((repo, i) => (
            <div
              key={repo.repo}
              ref={el => { itemRefs.current[i] = el; }}
              className={`neovim-project-item ${selectedIndex === i ? 'selected' : ''}`}
              onClick={() => onSelect(i)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span style={{ marginRight: '12px', display: 'flex' }}><RepoIcon icon={repo.icon} size={22} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '0.875rem' }}>
                  {repo.label}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                  {repo.owner}/{repo.repo}
                </div>
              </div>
              {selectedIndex === i && (
                <CornerDownLeft size={14} style={{ color: 'var(--accent-primary)' }} />
              )}
            </div>
          ))}
        </div>
        <div className="neovim-project-footer">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
            {REPOS.length} repositories
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── File Tree ───────────────────────────────────────
function FileTreeItem({ file, depth, selected, onSelect }: {
  file: RepoFile; depth: number; selected: string | null;
  onSelect: (file: RepoFile) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className={`neovim-tree-item ${file.type === 'file' && selected === file.path ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (file.type === 'directory') setExpanded(!expanded);
          else onSelect(file);
        }}
      >
        <span style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}><FileIcon name={file.name} type={file.type} isSubmodule={file.isSubmodule} expanded={expanded} size={14} /></span>
        <span style={{
          color: file.type === 'directory' ? 'var(--accent-primary)' : 'var(--text-primary)',
          fontWeight: file.type === 'directory' ? 600 : 400, fontSize: '0.8125rem',
        }}>{file.name}{file.isSubmodule ? ' (submodule)' : ''}</span>
      </div>
      {file.type === 'directory' && expanded && file.children?.map(child => (
        <FileTreeItem key={child.path} file={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
      ))}
    </>
  );
}

// ─── Fallback Files ──────────────────────────────────
const FALLBACK_FILES = [
  {
    name: 'init.lua', language: 'lua',
    content: `-- Neovim Configuration\n-- Author: Dhruv\n\nvim.opt.number = true\nvim.opt.relativenumber = true\nvim.opt.tabstop = 2\nvim.opt.shiftwidth = 2\nvim.opt.expandtab = true\nvim.opt.smartindent = true\nvim.opt.wrap = false\nvim.opt.termguicolors = true\n\nvim.cmd("colorscheme catppuccin-mocha")\n\nvim.g.mapleader = " "\nvim.keymap.set("n", "<leader>pv", vim.cmd.Ex)\nvim.keymap.set("n", "<leader>w", ":w<CR>")\nvim.keymap.set("n", "<leader>q", ":q<CR>")\n\nlocal lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"\nrequire("lazy").setup({\n  { "catppuccin/nvim", name = "catppuccin" },\n  { "nvim-treesitter/nvim-treesitter" },\n  { "nvim-telescope/telescope.nvim" },\n  { "neovim/nvim-lspconfig" },\n})`,
  },
  {
    name: 'portfolio.tsx', language: 'typescript',
    content: `import React from 'react';\nimport { WindowProvider } from './contexts/WindowContext';\nimport { KeyboardProvider } from './contexts/KeyboardContext';\nimport Desktop from './components/desktop/Desktop';\n\nexport default function Portfolio() {\n  return (\n    <WindowProvider>\n      <KeyboardProvider>\n        <Desktop />\n      </KeyboardProvider>\n    </WindowProvider>\n  );\n}`,
  },
];

type VimMode = 'NORMAL' | 'INSERT' | 'COMMAND' | 'SEARCH';

// ─── Main Neovim Component ───────────────────────────
export default function Neovim({ initialFile, openRepo }: {
  initialFile?: { name: string; content: string };
  openRepo?: { repoIndex: number; filePath: string };
}) {
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [fileTree, setFileTree] = useState<RepoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [sourceContent, setSourceContent] = useState<string>(''); // Original from API
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<string[]>([]); // Temporary editable copy
  const [contentLoading, setContentLoading] = useState(false);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(0);
  const [vimMode, setVimMode] = useState<VimMode>('NORMAL');
  const [commandBuffer, setCommandBuffer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);
  const [pendingKey, setPendingKey] = useState('');
  const [mode, setMode] = useState<'github' | 'local'>(initialFile ? 'local' : 'github');
  const [localFileIndex, setLocalFileIndex] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const neovimRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // ─── Derived state ─────────────────────────────────
  const isGithub = mode === 'github' && selectedRepo !== null && fileTree.length > 0;
  const rawContent = isGithub ? sourceContent : (initialFile?.content || FALLBACK_FILES[localFileIndex]?.content || '');
  const displayName = isGithub
    ? (selectedPath?.split('/').pop() || 'Select a file')
    : (initialFile?.name || FALLBACK_FILES[localFileIndex]?.name || 'untitled');
  const language = detectLanguage(displayName);

  // Init edit buffer from source content
  useEffect(() => {
    setEditBuffer(rawContent.split('\n'));
    setCursorLine(1);
    setCursorCol(0);
  }, [rawContent]);

  const totalLines = editBuffer.length;

  // Highlight from the edit buffer (so edits show with syntax highlighting)
  const highlightedLines = useMemo(() => {
    return editBuffer.map(line => highlightCode(line, language));
  }, [editBuffer, language]);

  // ─── Lifecycle ─────────────────────────────────────
  useEffect(() => {
    if (openRepo) {
      // Opened from FileManager with a specific repo + file
      setSelectedRepo(openRepo.repoIndex);
      setMode('github');
    } else if (initialFile) {
      // do nothing, handled below
    } else if (mode === 'github' && selectedRepo === null) {
      setShowProjectSelector(true);
    }
  }, []);

  useEffect(() => {
    if (initialFile) {
      setMode('local');
      setSourceContent(initialFile.content);
      setSelectedPath(initialFile.name);
    }
  }, [initialFile]);

  useEffect(() => {
    if (mode !== 'github' || selectedRepo === null) return;
    const repo = REPOS[selectedRepo];
    setLoading(true);
    setError(null);
    setFileTree([]);
    setSelectedPath(null);
    setSourceContent('');
    setSourceImageUrl(null);

    fetchRepoTree(repo.owner, repo.repo)
      .then(tree => {
        if (tree.length === 0) {
          setError('Rate limited or repo not found. Showing local files.');
          setMode('local');
        } else {
          setFileTree(tree);
          // If opened from FileManager, select the specific file
          if (openRepo && openRepo.repoIndex === selectedRepo && openRepo.filePath) {
            const targetFile = { path: openRepo.filePath, name: openRepo.filePath.split('/').pop() || '', type: 'file' as const };
            handleFileSelect(targetFile, repo.owner, repo.repo);
          } else {
            const firstFile = tree.find(f => f.type === 'file');
            if (firstFile) handleFileSelect(firstFile, repo.owner, repo.repo);
          }
        }
      })
      .catch(() => { setError('Failed to fetch.'); setMode('local'); })
      .finally(() => setLoading(false));
  }, [selectedRepo, mode]);

  useEffect(() => {
    if (editorRef.current) {
      const lineEl = editorRef.current.querySelector(`.neovim-line:nth-child(${cursorLine})`);
      lineEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [cursorLine]);

  useEffect(() => {
    if (vimMode === 'COMMAND' || vimMode === 'SEARCH') {
      commandInputRef.current?.focus();
    }
  }, [vimMode]);

  // ─── Handlers ──────────────────────────────────────
  const handleProjectSelect = (index: number) => {
    setSelectedRepo(index);
    setMode('github');
    setShowProjectSelector(false);
    // Focus the editor after a tick so content renders first
    setTimeout(() => neovimRef.current?.focus(), 50);
  };

  const handleFileSelect = useCallback((file: RepoFile, owner?: string, repo?: string) => {
    const o = owner || (selectedRepo !== null ? REPOS[selectedRepo].owner : '');
    const r = repo || (selectedRepo !== null ? REPOS[selectedRepo].repo : '');
    setSelectedPath(file.path);
    setContentLoading(true);
    setSearchQuery(''); setSearchMatches([]);
    setVimMode('NORMAL');

    fetchFileContent(o, r, file.path)
      .then(res => {
        setSourceContent(res.content);
        setSourceImageUrl(res.imageUrl || null);
      })
      .finally(() => setContentLoading(false));
  }, [selectedRepo]);

  // ─── Edit Buffer Helpers ───────────────────────────
  const insertChar = useCallback((ch: string) => {
    setEditBuffer(prev => {
      const newBuf = [...prev];
      const line = newBuf[cursorLine - 1] || '';
      newBuf[cursorLine - 1] = line.slice(0, cursorCol) + ch + line.slice(cursorCol);
      return newBuf;
    });
    setCursorCol(prev => prev + ch.length);
  }, [cursorLine, cursorCol]);

  const deleteCharBack = useCallback(() => {
    if (cursorCol > 0) {
      setEditBuffer(prev => {
        const newBuf = [...prev];
        const line = newBuf[cursorLine - 1] || '';
        newBuf[cursorLine - 1] = line.slice(0, cursorCol - 1) + line.slice(cursorCol);
        return newBuf;
      });
      setCursorCol(prev => prev - 1);
    } else if (cursorLine > 1) {
      // Join with previous line
      setEditBuffer(prev => {
        const newBuf = [...prev];
        const prevLineLen = newBuf[cursorLine - 2].length;
        newBuf[cursorLine - 2] += newBuf[cursorLine - 1];
        newBuf.splice(cursorLine - 1, 1);
        setCursorCol(prevLineLen);
        return newBuf;
      });
      setCursorLine(prev => prev - 1);
    }
  }, [cursorLine, cursorCol]);

  const insertNewline = useCallback(() => {
    setEditBuffer(prev => {
      const newBuf = [...prev];
      const line = newBuf[cursorLine - 1] || '';
      const before = line.slice(0, cursorCol);
      const after = line.slice(cursorCol);
      newBuf[cursorLine - 1] = before;
      newBuf.splice(cursorLine, 0, after);
      return newBuf;
    });
    setCursorLine(prev => prev + 1);
    setCursorCol(0);
  }, [cursorLine, cursorCol]);

  // ─── Vim Keybindings ─────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (showProjectSelector) return;

    // ─── INSERT MODE ───
    if (vimMode === 'INSERT') {
      if (e.key === 'Escape') {
        e.preventDefault();
        setVimMode('NORMAL');
        // Move cursor back one (vim behavior: cursor lands on last char typed)
        setCursorCol(prev => Math.max(0, prev - 1));
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        deleteCharBack();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        insertNewline();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        insertChar('  '); // 2-space tab
        return;
      }
      if (e.key === 'ArrowLeft') {
        setCursorCol(prev => Math.max(0, prev - 1));
        return;
      }
      if (e.key === 'ArrowRight') {
        const lineLen = (editBuffer[cursorLine - 1] || '').length;
        setCursorCol(prev => Math.min(prev + 1, lineLen));
        return;
      }
      if (e.key === 'ArrowUp') {
        setCursorLine(prev => Math.max(1, prev - 1));
        return;
      }
      if (e.key === 'ArrowDown') {
        setCursorLine(prev => Math.min(prev + 1, totalLines));
        return;
      }
      // Only insert printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        insertChar(e.key);
        return;
      }
      return;
    }

    // ─── COMMAND / SEARCH MODE — handled below ───
    if (vimMode === 'COMMAND' || vimMode === 'SEARCH') return;

    // ─── NORMAL MODE ───
    const key = e.key;

    if (['j', 'k', 'h', 'l', 'g', 'G', 'i', 'a', 'o', 'O', 'A', 'I', 'x', 'd', 'u', '/', ':', '0', '$', 'w', 'b', 'e'].includes(key) ||
        (e.ctrlKey && ['d', 'u', 'f', 'b'].includes(key))) {
      e.preventDefault();
    }

    // Multi-key: gg, dd
    if (pendingKey === 'g') {
      setPendingKey('');
      if (key === 'g') { setCursorLine(1); setCursorCol(0); }
      return;
    }
    if (pendingKey === 'd') {
      setPendingKey('');
      if (key === 'd') {
        // Delete current line
        setEditBuffer(prev => {
          if (prev.length <= 1) return [''];
          const newBuf = [...prev];
          newBuf.splice(cursorLine - 1, 1);
          return newBuf;
        });
        if (cursorLine > totalLines - 1) setCursorLine(prev => Math.max(1, prev - 1));
        setCursorCol(0);
      }
      return;
    }

    // Ctrl combos
    if (e.ctrlKey) {
      const halfPage = Math.max(1, Math.floor(totalLines / 4));
      if (key === 'd') { setCursorLine(prev => Math.min(prev + halfPage, totalLines)); return; }
      if (key === 'u') { setCursorLine(prev => Math.max(prev - halfPage, 1)); return; }
      if (key === 'f') { setCursorLine(prev => Math.min(prev + halfPage * 2, totalLines)); return; }
      if (key === 'b') { setCursorLine(prev => Math.max(prev - halfPage * 2, 1)); return; }
      return;
    }

    const currentLineLen = (editBuffer[cursorLine - 1] || '').length;

    switch (key) {
      // Movement
      case 'j': setCursorLine(prev => Math.min(prev + 1, totalLines)); break;
      case 'k': setCursorLine(prev => Math.max(prev - 1, 1)); break;
      case 'h': setCursorCol(prev => Math.max(0, prev - 1)); break;
      case 'l': setCursorCol(prev => Math.min(prev + 1, Math.max(0, currentLineLen - 1))); break;
      case '0': setCursorCol(0); break;
      case '$': setCursorCol(Math.max(0, currentLineLen - 1)); break;
      case 'w': { // Next word
        const line = editBuffer[cursorLine - 1] || '';
        const match = line.slice(cursorCol + 1).match(/\S/);
        if (match && match.index !== undefined) setCursorCol(cursorCol + 1 + match.index);
        else if (cursorLine < totalLines) { setCursorLine(prev => prev + 1); setCursorCol(0); }
        break;
      }
      case 'b': { // Previous word
        const line = editBuffer[cursorLine - 1] || '';
        const beforeCursor = line.slice(0, cursorCol);
        const match = beforeCursor.match(/\S+\s*$/);
        if (match && match.index !== undefined) setCursorCol(match.index);
        else if (cursorLine > 1) {
          setCursorLine(prev => prev - 1);
          const prevLine = editBuffer[cursorLine - 2] || '';
          setCursorCol(Math.max(0, prevLine.length - 1));
        }
        break;
      }
      case 'G': setCursorLine(totalLines); setCursorCol(0); break;
      case 'g': setPendingKey('g'); break;

      // Enter INSERT mode
      case 'i': setVimMode('INSERT'); break;
      case 'a':
        setVimMode('INSERT');
        setCursorCol(prev => Math.min(prev + 1, currentLineLen));
        break;
      case 'A':
        setVimMode('INSERT');
        setCursorCol(currentLineLen);
        break;
      case 'I':
        setVimMode('INSERT');
        setCursorCol(0);
        break;
      case 'o': // New line below
        setVimMode('INSERT');
        setEditBuffer(prev => {
          const newBuf = [...prev];
          newBuf.splice(cursorLine, 0, '');
          return newBuf;
        });
        setCursorLine(prev => prev + 1);
        setCursorCol(0);
        break;
      case 'O': // New line above
        setVimMode('INSERT');
        setEditBuffer(prev => {
          const newBuf = [...prev];
          newBuf.splice(cursorLine - 1, 0, '');
          return newBuf;
        });
        setCursorCol(0);
        break;

      // Delete char under cursor
      case 'x':
        setEditBuffer(prev => {
          const newBuf = [...prev];
          const line = newBuf[cursorLine - 1] || '';
          newBuf[cursorLine - 1] = line.slice(0, cursorCol) + line.slice(cursorCol + 1);
          return newBuf;
        });
        break;

      // dd pending
      case 'd': setPendingKey('d'); break;

      // Undo: reset to source
      case 'u':
        setEditBuffer(rawContent.split('\n'));
        setCursorLine(1);
        setCursorCol(0);
        break;

      // Search & Command
      case '/': setVimMode('SEARCH'); setCommandBuffer(''); break;
      case ':': setVimMode('COMMAND'); setCommandBuffer(''); break;
      case 'n':
        if (searchMatches.length > 0) {
          const next = (searchMatchIndex + 1) % searchMatches.length;
          setSearchMatchIndex(next);
          setCursorLine(searchMatches[next]);
        }
        break;
      case 'N':
        if (searchMatches.length > 0) {
          const prev = (searchMatchIndex - 1 + searchMatches.length) % searchMatches.length;
          setSearchMatchIndex(prev);
          setCursorLine(searchMatches[prev]);
        }
        break;
    }
  }, [vimMode, pendingKey, totalLines, cursorLine, cursorCol, showProjectSelector, searchMatches, searchMatchIndex, editBuffer, rawContent, insertChar, deleteCharBack, insertNewline]);

  // Clamp cursor col when line changes
  useEffect(() => {
    const lineLen = (editBuffer[cursorLine - 1] || '').length;
    const maxCol = vimMode === 'INSERT' ? lineLen : Math.max(0, lineLen - 1);
    if (cursorCol > maxCol) setCursorCol(maxCol);
  }, [cursorLine, editBuffer, vimMode]);

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setVimMode('NORMAL');
      setCommandBuffer('');
      neovimRef.current?.focus();
      return;
    }
    if (e.key !== 'Enter') return;

    if (vimMode === 'SEARCH') {
      const query = commandBuffer.toLowerCase();
      if (query) {
        const matches = editBuffer
          .map((line, i) => line.toLowerCase().includes(query) ? i + 1 : -1)
          .filter(n => n !== -1);
        setSearchMatches(matches);
        setSearchQuery(query);
        if (matches.length > 0) {
          const afterCursor = matches.find(m => m >= cursorLine) || matches[0];
          setSearchMatchIndex(matches.indexOf(afterCursor));
          setCursorLine(afterCursor);
        }
      }
    } else if (vimMode === 'COMMAND') {
      const cmd = commandBuffer.trim();
      if (/^\d+$/.test(cmd)) {
        setCursorLine(Math.min(Math.max(1, parseInt(cmd)), totalLines));
      }
    }

    setVimMode('NORMAL');
    setCommandBuffer('');
    neovimRef.current?.focus();
  };

  // ─── Render ────────────────────────────────────────
  return (
    <div
      className="neovim"
      ref={neovimRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      {showProjectSelector && (
        <ProjectSelector
          onSelect={handleProjectSelect}
          onClose={() => {
            setShowProjectSelector(false);
            if (selectedRepo === null) setMode('local');
            neovimRef.current?.focus();
          }}
        />
      )}

      <div className="neovim-tabs">
        {isGithub ? (
          <>
            <div
              className="neovim-tab"
              onClick={() => setShowProjectSelector(true)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RepoIcon icon={REPOS[selectedRepo].icon} size={14} />
              <span>{REPOS[selectedRepo].label}</span>
              <ChevronDown size={10} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="neovim-tab active" style={{ marginLeft: 'auto' }}>
              <span>{displayName}</span>
            </div>
          </>
        ) : (
          <>
            {FALLBACK_FILES.map((f, i) => (
              <div
                key={f.name}
                className={`neovim-tab ${!initialFile && i === localFileIndex ? 'active' : ''}`}
                onClick={() => { setLocalFileIndex(i); setMode('local'); }}
              >
                <span>{f.name}</span>
              </div>
            ))}
            {initialFile && (
              <div className="neovim-tab active"><span>{initialFile.name}</span></div>
            )}
            <button
              onClick={() => setShowProjectSelector(true)}
              style={{
                marginLeft: 'auto', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.6875rem',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              <Github size={12} style={{ marginRight: '4px' }} /> Browse GitHub
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {isGithub && (
          <div className="neovim-sidebar">
            {loading ? (
              <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Loading repo...</div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {fileTree.map(file => (
                  <FileTreeItem key={file.path} file={file} depth={0} selected={selectedPath} onSelect={f => handleFileSelect(f)} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="neovim-content" ref={editorRef}>
            {contentLoading ? (
              <div style={{ padding: '32px', color: 'var(--text-muted)', textAlign: 'center' }}>
                <Loader2 size={24} className="spin" style={{ marginBottom: '8px' }} />Loading file...
              </div>
            ) : error && !isGithub ? (
              <div style={{ padding: '16px', color: 'var(--accent-warning)', fontSize: '0.8125rem' }}>⚠ {error}</div>
            ) : sourceImageUrl ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', backgroundColor: '#00000040' }}>
                <img src={sourceImageUrl} alt={displayName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
              </div>
            ) : (
              <>
                <div className="neovim-gutter">
                  {editBuffer.map((_, i) => (
                    <div key={i} className={`neovim-gutter-line ${i + 1 === cursorLine ? 'active' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="neovim-editor">
                  {highlightedLines.map((html, i) => {
                    const lineNum = i + 1;
                    const isCurrent = lineNum === cursorLine;
                    const isMatch = searchMatches.includes(lineNum);
                    const lineText = editBuffer[i] || '';

                    return (
                      <div
                        key={i}
                        className={`neovim-line ${isCurrent ? 'active' : ''} ${isMatch ? 'search-match' : ''}`}
                        onClick={() => {
                          setCursorLine(lineNum);
                          // Approximate column from click
                          setCursorCol(0);
                        }}
                        style={{ position: 'relative' }}
                      >
                        <span dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />
                        {/* Block cursor */}
                        {isCurrent && (
                          <span
                            className={`neovim-cursor ${vimMode === 'INSERT' ? 'insert' : 'normal'}`}
                            style={{
                              left: `${cursorCol}ch`,
                            }}
                          >
                            {vimMode === 'INSERT'
                              ? '\u200B' // zero-width for thin line cursor
                              : (lineText[cursorCol] || ' ')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {(vimMode === 'COMMAND' || vimMode === 'SEARCH') && (
            <div className="neovim-commandbar">
              <span style={{ color: 'var(--accent-primary)', marginRight: '4px' }}>
                {vimMode === 'SEARCH' ? '/' : ':'}
              </span>
              <input
                ref={commandInputRef}
                type="text"
                value={commandBuffer}
                onChange={e => setCommandBuffer(e.target.value)}
                onKeyDown={handleCommandSubmit}
                className="neovim-command-input"
                autoFocus
                spellCheck={false}
              />
            </div>
          )}

          <div className="neovim-statusbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`neovim-mode ${vimMode !== 'NORMAL' ? 'insert' : ''}`}>{vimMode}</span>
              <span>{displayName}</span>
              {isGithub && selectedRepo !== null && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                  {REPOS[selectedRepo].owner}/{REPOS[selectedRepo].repo}
                </span>
              )}
              {searchQuery && searchMatches.length > 0 && (
                <span style={{ color: 'var(--accent-warning)', fontSize: '0.6875rem' }}>
                  [{searchMatchIndex + 1}/{searchMatches.length}] &quot;{searchQuery}&quot;
                </span>
              )}
              {pendingKey && (
                <span style={{ color: 'var(--accent-warning)', fontSize: '0.6875rem' }}>{pendingKey}_</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>{language}</span>
              <span>Ln {cursorLine}, Col {cursorCol + 1}</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
