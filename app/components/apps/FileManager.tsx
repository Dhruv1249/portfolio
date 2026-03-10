'use client';

import React, { useState, useEffect } from 'react';
import { REPOS, RepoFile, fetchRepoTree, fetchFileContent } from '../../lib/github';
import { useWindowManager } from '../../contexts/WindowContext';

// File type icons
const getIcon = (name: string, type: 'file' | 'directory', expanded?: boolean): string => {
  if (type === 'directory') return expanded ? '📂' : '📁';
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, string> = {
    ts: '📘', tsx: '⚛️', js: '📒', jsx: '⚛️', py: '🐍', lua: '🌙',
    rs: '🦀', go: '🐹', md: '📝', json: '📋', css: '🎨', html: '🌐',
    yml: '⚙️', yaml: '⚙️', toml: '⚙️', sh: '📜', dockerfile: '🐳',
    txt: '📄', pdf: '📕', conf: '⚙️',
  };
  return icons[ext] || '📄';
};

export default function FileManager() {
  const { openWindow } = useWindowManager();
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [fileTree, setFileTree] = useState<RepoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]); // breadcrumb path into the tree
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Fetch tree when repo changes
  useEffect(() => {
    if (selectedRepo === null) return;
    const repo = REPOS[selectedRepo];
    setLoading(true);
    setFileTree([]);
    setCurrentPath([]);
    setSelectedFile(null);

    fetchRepoTree(repo.owner, repo.repo)
      .then(tree => setFileTree(tree))
      .finally(() => setLoading(false));
  }, [selectedRepo]);

  // Navigate into tree by path segments
  const getCurrentContents = (): RepoFile[] => {
    if (selectedRepo === null) return [];
    let items = fileTree;
    for (const segment of currentPath) {
      const dir = items.find(f => f.name === segment && f.type === 'directory');
      if (dir?.children) {
        items = dir.children;
      } else {
        return [];
      }
    }
    return items;
  };

  const contents = getCurrentContents();

  const handleItemClick = (item: RepoFile) => {
    if (item.type === 'directory') {
      setCurrentPath(prev => [...prev, item.name]);
      setSelectedFile(null);
    } else {
      setSelectedFile(item.path);
    }
  };

  const handleItemDoubleClick = (item: RepoFile) => {
    if (item.type === 'directory') {
      handleItemClick(item);
      return;
    }
    if (selectedRepo === null) return;

    const repo = REPOS[selectedRepo];
    // Open Neovim with this repo + file
    openWindow('neovim', `Neovim — ${item.name}`, {
      repoIndex: selectedRepo,
      filePath: item.path,
      fileName: item.name,
    });
  };

  const handleBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(prev => prev.slice(0, -1));
      setSelectedFile(null);
    } else if (selectedRepo !== null) {
      setSelectedRepo(null);
      setFileTree([]);
    }
  };

  const handlePathClick = (index: number) => {
    if (index === -1) {
      // Clicked on repo name — go to repo root
      setCurrentPath([]);
    } else {
      setCurrentPath(prev => prev.slice(0, index + 1));
    }
    setSelectedFile(null);
  };

  // ─── Render ────────────────────────────────────────
  return (
    <div className="file-manager">
      {/* Sidebar */}
      <div className="file-sidebar">
        <div className="file-sidebar-title">Projects</div>
        {REPOS.map((repo, i) => (
          <div
            key={repo.repo}
            className={`file-sidebar-item ${selectedRepo === i ? 'active' : ''}`}
            onClick={() => setSelectedRepo(i)}
          >
            <span>{repo.emoji}</span>
            <span>{repo.label}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="file-main">
        {/* Toolbar */}
        <div className="file-toolbar">
          <button
            className="browser-nav-btn"
            onClick={handleBack}
            disabled={selectedRepo === null}
            style={{ opacity: selectedRepo === null ? 0.5 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="file-path">
            {selectedRepo === null ? (
              <span className="file-path-segment" style={{ color: 'var(--text-muted)' }}>
                Select a project →
              </span>
            ) : (
              <>
                <span
                  className="file-path-segment"
                  onClick={() => handlePathClick(-1)}
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {REPOS[selectedRepo].emoji} {REPOS[selectedRepo].label}
                </span>
                {currentPath.map((segment, index) => (
                  <React.Fragment key={index}>
                    <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>/</span>
                    <span
                      className="file-path-segment"
                      onClick={() => handlePathClick(index)}
                    >
                      {segment}
                    </span>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>

        {/* File Grid */}
        <div className="file-grid">
          {selectedRepo === null ? (
            // Landing: show all projects as cards
            <div style={{ gridColumn: '1 / -1', padding: '24px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '13px' }}>
                Select a project from the sidebar or click below:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {REPOS.map((repo, i) => (
                  <div
                    key={repo.repo}
                    className="file-item"
                    onClick={() => setSelectedRepo(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="file-icon" style={{ fontSize: '32px' }}>{repo.emoji}</div>
                    <div className="file-name" style={{ fontWeight: 600 }}>{repo.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {repo.owner}/{repo.repo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center',
              color: 'var(--text-muted)', padding: '48px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
              <div>Loading {REPOS[selectedRepo].label}...</div>
            </div>
          ) : contents.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center',
              color: 'var(--text-muted)', padding: '48px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
              <div>This folder is empty</div>
            </div>
          ) : (
            // Sort: directories first, then files
            [...contents]
              .sort((a, b) => {
                if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                return a.name.localeCompare(b.name);
              })
              .map(item => (
                <div
                  key={item.path}
                  className={`file-item ${selectedFile === item.path ? 'selected' : ''}`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <div className="file-icon">{getIcon(item.name, item.type)}</div>
                  <div className="file-name">{item.name}</div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
