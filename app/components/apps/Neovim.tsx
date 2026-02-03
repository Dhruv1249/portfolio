'use client';

import React, { useState } from 'react';

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

const FILES: CodeFile[] = [
  {
    name: 'init.lua',
    language: 'lua',
    content: `-- Neovim Configuration
-- Author: Dhruv

vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.wrap = false
vim.opt.termguicolors = true

-- Set colorscheme
vim.cmd("colorscheme catppuccin-mocha")

-- Key mappings
vim.g.mapleader = " "
vim.keymap.set("n", "<leader>pv", vim.cmd.Ex)
vim.keymap.set("n", "<leader>w", ":w<CR>")
vim.keymap.set("n", "<leader>q", ":q<CR>")

-- Plugin manager (lazy.nvim)
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Plugins
require("lazy").setup({
  { "catppuccin/nvim", name = "catppuccin" },
  { "nvim-treesitter/nvim-treesitter" },
  { "nvim-telescope/telescope.nvim" },
  { "neovim/nvim-lspconfig" },
})`,
  },
  {
    name: 'portfolio.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { WindowProvider } from './contexts/WindowContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import Desktop from './components/desktop/Desktop';

export default function Portfolio() {
  return (
    <WindowProvider>
      <KeyboardProvider>
        <Desktop />
      </KeyboardProvider>
    </WindowProvider>
  );
}

// Types
interface Window {
  id: string;
  appType: 'terminal' | 'browser' | 'files';
  title: string;
  workspace: number;
  zIndex: number;
}

// Styled with Catppuccin Mocha theme
const theme = {
  bg: '#1e1e2e',
  surface: '#313244',
  text: '#cdd6f4',
  accent: '#89b4fa',
};`,
  },
];

// Simple syntax highlighting
const highlightCode = (code: string, language: string): React.ReactNode[] => {
  const lines = code.split('\n');
  
  return lines.map((line, i) => {
    let highlighted = line;
    
    // Comments
    if (language === 'lua' && line.trim().startsWith('--')) {
      return <span className="syn-comment">{line}</span>;
    }
    if ((language === 'typescript' || language === 'javascript') && line.trim().startsWith('//')) {
      return <span className="syn-comment">{line}</span>;
    }
    
    // Keywords
    const keywords = language === 'lua' 
      ? ['local', 'function', 'end', 'if', 'then', 'else', 'return', 'require', 'true', 'false', 'nil', 'not', 'and', 'or']
      : ['import', 'export', 'default', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'interface', 'type', 'true', 'false'];
    
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIndex = 0;
    
    // Process the line character by character
    while (remaining.length > 0) {
      let matched = false;
      
      // Check for string
      const stringMatch = remaining.match(/^(["'`]).*?\1/);
      if (stringMatch) {
        tokens.push(<span key={`str-${i}-${keyIndex++}`} className="syn-string">{stringMatch[0]}</span>);
        remaining = remaining.slice(stringMatch[0].length);
        matched = true;
        continue;
      }
      
      // Check for keywords
      for (const kw of keywords) {
        const regex = new RegExp(`^\\b${kw}\\b`);
        if (regex.test(remaining)) {
          tokens.push(<span key={`kw-${i}-${keyIndex++}`} className="syn-keyword">{kw}</span>);
          remaining = remaining.slice(kw.length);
          matched = true;
          break;
        }
      }
      if (matched) continue;
      
      // Check for numbers
      const numMatch = remaining.match(/^\b\d+\b/);
      if (numMatch) {
        tokens.push(<span key={`num-${i}-${keyIndex++}`} className="syn-number">{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      
      // Check for function calls
      const funcMatch = remaining.match(/^(\w+)(?=\()/);
      if (funcMatch) {
        tokens.push(<span key={`fn-${i}-${keyIndex++}`} className="syn-function">{funcMatch[1]}</span>);
        remaining = remaining.slice(funcMatch[1].length);
        continue;
      }
      
      // Default: add single character
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }
    
    return <>{tokens}</>;
  });
};

export default function Neovim() {
  const [activeFile, setActiveFile] = useState(0);
  const [cursorLine, setCursorLine] = useState(1);
  
  const file = FILES[activeFile];
  const lines = file.content.split('\n');
  const highlightedLines = highlightCode(file.content, file.language);

  return (
    <div className="neovim">
      {/* Tab bar */}
      <div className="neovim-tabs">
        {FILES.map((f, i) => (
          <div
            key={f.name}
            className={`neovim-tab ${i === activeFile ? 'active' : ''}`}
            onClick={() => {
              setActiveFile(i);
              setCursorLine(1);
            }}
          >
            <span>{f.name}</span>
            <span className="neovim-tab-close">×</span>
          </div>
        ))}
      </div>

      {/* Editor content */}
      <div className="neovim-content">
        {/* Line numbers */}
        <div className="neovim-gutter">
          {lines.map((_, i) => (
            <div 
              key={i} 
              className={`neovim-gutter-line ${i + 1 === cursorLine ? 'active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <div className="neovim-editor">
          {highlightedLines.map((line, i) => (
            <div 
              key={i} 
              className={`neovim-line ${i + 1 === cursorLine ? 'active' : ''}`}
              onClick={() => setCursorLine(i + 1)}
            >
              {line || ' '}
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="neovim-statusbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="neovim-mode">NORMAL</span>
          <span>{file.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>{file.language}</span>
          <span>Ln {cursorLine}, Col 1</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
