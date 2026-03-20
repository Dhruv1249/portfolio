// Shared icon utilities for mapping icon string identifiers to Lucide React components
import React from 'react';
import {
  Globe, Bot, GitBranch, Wallet, FileText, Zap,
  Folder, FolderOpen, FileCode, FileJson, FileType, File,
  Image, Settings, Hash, Terminal, Code, Braces,
  Coffee, Bug, Paintbrush, Layout, Cog, ScrollText,
  Monitor, HardDrive, Cpu, Wifi, Battery, Clock,
} from 'lucide-react';

// Map repo icon identifiers to Lucide components
const REPO_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  globe: Globe,
  bot: Bot,
  'git-branch': GitBranch,
  wallet: Wallet,
  'file-text': FileText,
  zap: Zap,
};

export function RepoIcon({ icon, size = 18, className }: { icon: string; size?: number; className?: string }) {
  const Icon = REPO_ICONS[icon] || FileText;
  return <Icon size={size} className={className} />;
}

// File extension → icon mapping
export function FileIcon({ name, type, expanded, size = 14, isSubmodule = false }: {
  name: string; type: 'file' | 'directory'; expanded?: boolean; size?: number; isSubmodule?: boolean;
}) {
  if (type === 'directory') {
    if (isSubmodule) {
      return <GitBranch size={size} style={{ color: 'var(--accent-cyan)' }} />;
    }
    return expanded
      ? <FolderOpen size={size} style={{ color: 'var(--accent-primary)' }} />
      : <Folder size={size} style={{ color: 'var(--accent-primary)' }} />;
  }

  const ext = name.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }> = {
    ts: { icon: FileCode, color: '#3178c6' },
    tsx: { icon: Code, color: '#61dafb' },
    js: { icon: FileCode, color: '#f7df1e' },
    jsx: { icon: Code, color: '#61dafb' },
    py: { icon: FileCode, color: '#3776ab' },
    lua: { icon: FileCode, color: '#000080' },
    rs: { icon: FileCode, color: '#ce412b' },
    go: { icon: FileCode, color: '#00add8' },
    json: { icon: FileJson, color: '#fbc02d' },
    md: { icon: FileText, color: '#42a5f5' },
    css: { icon: Paintbrush, color: '#264de4' },
    html: { icon: Layout, color: '#e44d26' },
    yml: { icon: Cog, color: '#cb171e' },
    yaml: { icon: Cog, color: '#cb171e' },
    toml: { icon: Cog, color: '#9c4221' },
    sh: { icon: Terminal, color: '#4eaa25' },
    dockerfile: { icon: Braces, color: '#2496ed' },
    txt: { icon: FileType, color: 'var(--text-muted)' },
    pdf: { icon: FileText, color: '#f44336' },
    conf: { icon: Cog, color: 'var(--text-muted)' },
    png: { icon: Image, color: '#66bb6a' },
    jpg: { icon: Image, color: '#66bb6a' },
    svg: { icon: Image, color: '#ffb300' },
  };

  const match = iconMap[ext];
  if (match) {
    const IconComp = match.icon;
    return <IconComp size={size} style={{ color: match.color }} />;
  }
  return <File size={size} style={{ color: 'var(--text-muted)' }} />;
}
