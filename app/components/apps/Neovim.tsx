'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { REPOS, RepoFile, fetchRepoTree, fetchFileContent, detectLanguage } from '../../lib/github';
import Prism from 'prismjs';

// Import Prism language grammars
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

// Map our detectLanguage output → Prism grammar name
const PRISM_LANG_MAP: Record<string, string> = {
  typescript: 'tsx', // tsx handles both TS and TSX
  javascript: 'jsx', // jsx handles both JS and JSX
  python: 'python',
  lua: 'lua',
  rust: 'rust',
  go: 'go',
  json: 'json',
  markdown: 'markdown',
  css: 'css',
  html: 'html',
  yaml: 'yaml',
  toml: 'toml',
  shell: 'bash',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
  sql: 'sql',
  dockerfile: 'docker',
  text: 'text',
};

function highlightCode(code: string, language: string): string {
  const prismLang = PRISM_LANG_MAP[language] || 'text';
  const grammar = Prism.languages[prismLang];
  if (!grammar) {
    // No grammar available — return escaped HTML
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  return Prism.highlight(code, grammar, prismLang);
}

// ─── File Tree Component ─────────────────────────────
function FileTreeItem({ file, depth, selected, onSelect }: {
  file: RepoFile; depth: number; selected: string | null;
  onSelect: (file: RepoFile) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);

  const getIcon = () => {
    if (file.type === 'directory') return expanded ? '📂' : '📁';
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const icons: Record<string, string> = {
      ts: '📘', tsx: '⚛️', js: '📒', jsx: '⚛️', py: '🐍', lua: '🌙',
      rs: '🦀', go: '🐹', md: '📝', json: '📋', css: '🎨', html: '🌐',
      yml: '⚙️', yaml: '⚙️', toml: '⚙️', sh: '📜', dockerfile: '🐳',
    };
    return icons[ext] || '📄';
  };

  return (
    <>
      <div
        className={`neovim-tree-item ${file.type === 'file' && selected === file.path ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (file.type === 'directory') {
            setExpanded(!expanded);
          } else {
            onSelect(file);
          }
        }}
      >
        <span style={{ marginRight: '6px', fontSize: '13px' }}>{getIcon()}</span>
        <span style={{
          color: file.type === 'directory' ? 'var(--accent-primary)' : 'var(--text-primary)',
          fontWeight: file.type === 'directory' ? 600 : 400,
          fontSize: '13px',
        }}>
          {file.name}
        </span>
      </div>
      {file.type === 'directory' && expanded && file.children && (
        file.children.map(child => (
          <FileTreeItem key={child.path} file={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
        ))
      )}
    </>
  );
}

// ─── Fallback Files ──────────────────────────────────
const FALLBACK_FILES = [
  {
    name: 'init.lua',
    language: 'lua',
    content: `-- Neovim Configuration\n-- Author: Dhruv\n\nvim.opt.number = true\nvim.opt.relativenumber = true\nvim.opt.tabstop = 2\nvim.opt.shiftwidth = 2\nvim.opt.expandtab = true\nvim.opt.smartindent = true\nvim.opt.wrap = false\nvim.opt.termguicolors = true\n\nvim.cmd("colorscheme catppuccin-mocha")\n\nvim.g.mapleader = " "\nvim.keymap.set("n", "<leader>pv", vim.cmd.Ex)\nvim.keymap.set("n", "<leader>w", ":w<CR>")\nvim.keymap.set("n", "<leader>q", ":q<CR>")\n\nlocal lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"\nrequire("lazy").setup({\n  { "catppuccin/nvim", name = "catppuccin" },\n  { "nvim-treesitter/nvim-treesitter" },\n  { "nvim-telescope/telescope.nvim" },\n  { "neovim/nvim-lspconfig" },\n})`,
  },
  {
    name: 'portfolio.tsx',
    language: 'typescript',
    content: `import React from 'react';\nimport { WindowProvider } from './contexts/WindowContext';\nimport { KeyboardProvider } from './contexts/KeyboardContext';\nimport Desktop from './components/desktop/Desktop';\n\nexport default function Portfolio() {\n  return (\n    <WindowProvider>\n      <KeyboardProvider>\n        <Desktop />\n      </KeyboardProvider>\n    </WindowProvider>\n  );\n}`,
  },
];

// ─── Main Neovim Component ───────────────────────────
export default function Neovim({ initialFile }: { initialFile?: { name: string; content: string } }) {
  const [selectedRepo, setSelectedRepo] = useState(0);
  const [fileTree, setFileTree] = useState<RepoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);
  const [cursorLine, setCursorLine] = useState(1);
  const [mode, setMode] = useState<'github' | 'local'>('github');
  const [localFileIndex, setLocalFileIndex] = useState(0);

  // Handle initial file passed from FileManager
  useEffect(() => {
    if (initialFile) {
      setMode('local');
      setFileContent(initialFile.content);
      setSelectedPath(initialFile.name);
    }
  }, [initialFile]);

  // Fetch repo tree on repo change
  useEffect(() => {
    if (mode !== 'github') return;
    const repo = REPOS[selectedRepo];
    setLoading(true);
    setError(null);
    setFileTree([]);
    setSelectedPath(null);
    setFileContent('');

    fetchRepoTree(repo.owner, repo.repo)
      .then(tree => {
        if (tree.length === 0) {
          setError('Rate limited or repo not found. Showing local files.');
          setMode('local');
        } else {
          setFileTree(tree);
          const firstFile = tree.find(f => f.type === 'file');
          if (firstFile) {
            handleFileSelect(firstFile, repo.owner, repo.repo);
          }
        }
      })
      .catch(() => {
        setError('Failed to fetch. Showing local files.');
        setMode('local');
      })
      .finally(() => setLoading(false));
  }, [selectedRepo, mode]);

  const handleFileSelect = useCallback((file: RepoFile, owner?: string, repo?: string) => {
    const o = owner || REPOS[selectedRepo].owner;
    const r = repo || REPOS[selectedRepo].repo;
    setSelectedPath(file.path);
    setContentLoading(true);
    setCursorLine(1);

    fetchFileContent(o, r, file.path)
      .then(content => setFileContent(content))
      .finally(() => setContentLoading(false));
  }, [selectedRepo]);

  // Determine what to render
  const isGithub = mode === 'github' && fileTree.length > 0;
  const displayContent = isGithub ? fileContent : (initialFile?.content || FALLBACK_FILES[localFileIndex]?.content || '');
  const displayName = isGithub
    ? (selectedPath?.split('/').pop() || 'Select a file')
    : (initialFile?.name || FALLBACK_FILES[localFileIndex]?.name || 'untitled');
  const language = detectLanguage(displayName);
  const lines = displayContent.split('\n');

  // Memoize highlighted HTML to avoid re-highlighting on every render
  const highlightedLines = useMemo(() => {
    return lines.map(line => highlightCode(line, language));
  }, [displayContent, language]);

  return (
    <div className="neovim">
      {/* Tab bar / Repo selector */}
      <div className="neovim-tabs">
        {isGithub ? (
          <>
            <select
              value={selectedRepo}
              onChange={(e) => { setSelectedRepo(Number(e.target.value)); setMode('github'); }}
              style={{
                background: 'var(--bg-elevated)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)',
                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)',
                cursor: 'pointer', outline: 'none', marginRight: '8px',
              }}
            >
              {REPOS.map((r, i) => (
                <option key={r.repo} value={i}>{r.emoji} {r.label}</option>
              ))}
            </select>
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
              <div className="neovim-tab active">
                <span>{initialFile.name}</span>
              </div>
            )}
            <button
              onClick={() => setMode('github')}
              style={{
                marginLeft: 'auto', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              🐙 Browse GitHub
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* File tree sidebar (GitHub mode only) */}
        {isGithub && (
          <div className="neovim-sidebar">
            {loading ? (
              <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                Loading repo...
              </div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {fileTree.map(file => (
                  <FileTreeItem
                    key={file.path}
                    file={file}
                    depth={0}
                    selected={selectedPath}
                    onSelect={(f) => handleFileSelect(f)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="neovim-content">
            {contentLoading ? (
              <div style={{ padding: '32px', color: 'var(--text-muted)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                Loading file...
              </div>
            ) : error && !isGithub ? (
              <div style={{ padding: '16px', color: 'var(--accent-warning)', fontSize: '13px' }}>
                ⚠ {error}
              </div>
            ) : (
              <>
                <div className="neovim-gutter">
                  {lines.map((_, i) => (
                    <div key={i} className={`neovim-gutter-line ${i + 1 === cursorLine ? 'active' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="neovim-editor">
                  {highlightedLines.map((html, i) => (
                    <div
                      key={i}
                      className={`neovim-line ${i + 1 === cursorLine ? 'active' : ''}`}
                      onClick={() => setCursorLine(i + 1)}
                      dangerouslySetInnerHTML={{ __html: html || ' ' }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status bar */}
          <div className="neovim-statusbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="neovim-mode">NORMAL</span>
              <span>{displayName}</span>
              {isGithub && (
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                  {REPOS[selectedRepo].owner}/{REPOS[selectedRepo].repo}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>{language}</span>
              <span>Ln {cursorLine}, Col 1</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
