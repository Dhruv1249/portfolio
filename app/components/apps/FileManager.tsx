'use client';

import React, { useState } from 'react';
import { fileSystem, FileNode, listDirectory, getNode } from '../../lib/filesystem';
import { useWindowManager } from '../../contexts/WindowContext';

// File type icons
const getFileIcon = (node: FileNode): string => {
  if (node.type === 'directory') {
    const folderIcons: Record<string, string> = {
      'projects': '📦',
      'documents': '📄',
      'downloads': '📥',
      '.config': '⚙️',
      'nvim': '📝',
      'zsh': '💻',
    };
    return folderIcons[node.name] || '📁';
  }

  const ext = node.name.split('.').pop()?.toLowerCase();
  const fileIcons: Record<string, string> = {
    'tsx': '⚛️',
    'ts': '📘',
    'js': '📒',
    'jsx': '⚛️',
    'md': '📝',
    'json': '📋',
    'css': '🎨',
    'html': '🌐',
    'go': '🐹',
    'rs': '🦀',
    'py': '🐍',
    'lua': '🌙',
    'conf': '⚙️',
    'pdf': '📕',
    'sh': '📜',
  };
  return fileIcons[ext || ''] || '📄';
};

const SIDEBAR_ITEMS = [
  { name: 'Home', path: '~', icon: '🏠' },
  { name: 'Projects', path: '~/projects', icon: '📦' },
  { name: 'Documents', path: '~/documents', icon: '📄' },
  { name: 'Downloads', path: '~/downloads', icon: '📥' },
  { name: 'Config', path: '~/.config', icon: '⚙️' },
];

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState('~');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { openWindow } = useWindowManager();

  const contents = listDirectory(currentPath);
  
  const pathParts = currentPath === '~' 
    ? ['~'] 
    : currentPath.split('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleItemClick = (item: FileNode) => {
    if (item.type === 'directory') {
      const newPath = currentPath === '~' 
        ? `~/${item.name}` 
        : `${currentPath}/${item.name}`;
      setCurrentPath(newPath);
      setSelectedFile(null);
    } else {
      setSelectedFile(item.name);
    }
  };

  const handleItemDoubleClick = (item: FileNode) => {
    if (item.type === 'directory') {
      handleItemClick(item);
    } else {
      // Open file in neovim
      openWindow('neovim', `Neovim — ${item.name}`);
    }
  };

  const handlePathClick = (index: number) => {
    if (index === 0) {
      setCurrentPath('~');
    } else {
      const newPath = pathParts.slice(0, index + 1).join('/');
      setCurrentPath(newPath);
    }
    setSelectedFile(null);
  };

  return (
    <div className="file-manager">
      {/* Sidebar */}
      <div className="file-sidebar">
        <div className="file-sidebar-title">Favorites</div>
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item.path}
            className={`file-sidebar-item ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => handleNavigate(item.path)}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="file-main">
        {/* Toolbar */}
        <div className="file-toolbar">
          <button 
            className="browser-nav-btn"
            onClick={() => {
              if (currentPath !== '~') {
                const parts = currentPath.split('/');
                parts.pop();
                setCurrentPath(parts.join('/') || '~');
              }
            }}
            disabled={currentPath === '~'}
            style={{ opacity: currentPath === '~' ? 0.5 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="file-path">
            {pathParts.map((part, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
                <span 
                  className="file-path-segment"
                  onClick={() => handlePathClick(index)}
                >
                  {part === '~' ? '~' : part}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* File Grid */}
        <div className="file-grid">
          {contents.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              color: 'var(--text-muted)',
              padding: '48px' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
              <div>This folder is empty</div>
            </div>
          ) : (
            contents.map((item) => (
              <div
                key={item.name}
                className={`file-item ${selectedFile === item.name ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="file-icon">{getFileIcon(item)}</div>
                <div className="file-name">{item.name}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
