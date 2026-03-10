'use client';

import React, { useState } from 'react';
import { User, Paintbrush, Keyboard, Monitor, Trophy, Lightbulb } from 'lucide-react';

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const SECTIONS: SettingsSection[] = [
  { id: 'about', name: 'About', icon: <User size={16} /> },
  { id: 'appearance', name: 'Appearance', icon: <Paintbrush size={16} /> },
  { id: 'keyboard', name: 'Keyboard', icon: <Keyboard size={16} /> },
  { id: 'system', name: 'System', icon: <Monitor size={16} /> },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('about');
  const [darkMode, setDarkMode] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [transparency, setTransparency] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="settings-section">
            <h2 className="settings-title">About This Portfolio</h2>
            <p className="settings-subtitle">A Hyprland-style tiling window manager built with Next.js</p>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px',
              padding: '24px',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
              }}>
                <Monitor size={32} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-bright)', marginBottom: '4px' }}>Portfolio OS</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Version 1.0.0</p>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
                  Built with Next.js, React, and TypeScript
                </p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Developer</h3>
                <p>Dhruv — Full Stack Developer</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Education</h3>
                <p>B.Tech CSE @ LPU (CGPA: 8.72)</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Achievement</h3>
                <p><Trophy size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> NASA Space Apps 2025 — Global Honorable Mention</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Contact</h3>
                <p>dhr1249.lm@gmail.com | +91 7876503573</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Links</h3>
                <p>
                  <a href="https://github.com/Dhruv1249" target="_blank" style={{ color: 'var(--accent-cyan)', marginRight: '16px' }}>GitHub</a>
                  <a href="https://linkedin.com/in/dhruv124" target="_blank" style={{ color: 'var(--accent-cyan)' }}>LinkedIn</a>
                </p>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-section">
            <h2 className="settings-title">Appearance</h2>
            <p className="settings-subtitle">Customize the look and feel</p>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Dark Mode</h3>
                <p>Use dark theme throughout the interface</p>
              </div>
              <div 
                className={`toggle ${darkMode ? 'active' : ''}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Animations</h3>
                <p>Enable smooth transitions and animations</p>
              </div>
              <div 
                className={`toggle ${animations ? 'active' : ''}`}
                onClick={() => setAnimations(!animations)}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Transparency Effects</h3>
                <p>Enable blur and transparency</p>
              </div>
              <div 
                className={`toggle ${transparency ? 'active' : ''}`}
                onClick={() => setTransparency(!transparency)}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Accent Color</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['#7aa2f7', '#bb9af7', '#9ece6a', '#f7768e', '#ff9e64', '#7dcfff'].map((color) => (
                  <div
                    key={color}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: color,
                      cursor: 'pointer',
                      border: color === '#7aa2f7' ? '2px solid white' : '2px solid transparent',
                      transition: 'transform 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'keyboard':
        return (
          <div className="settings-section">
            <h2 className="settings-title">Keyboard Shortcuts</h2>
            <p className="settings-subtitle">Quick actions to boost productivity</p>

            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { keys: ['Alt', 'Enter'], action: 'Open Terminal' },
                { keys: ['Alt', 'B'], action: 'Open Browser' },
                { keys: ['Alt', 'F'], action: 'Open File Manager' },
                { keys: ['Alt', 'N'], action: 'Open Neovim' },
                { keys: ['Alt', 'S'], action: 'Open Settings' },
                { keys: ['Alt', 'Space'], action: 'Open App Launcher' },
                { keys: ['Alt', 'W'], action: 'Close Window' },
                { keys: ['Alt', 'M'], action: 'Maximize Window' },
                { keys: ['Alt', 'J/K'], action: 'Focus Next/Prev Window' },
                { keys: ['Alt', '1-4'], action: 'Switch Workspace' },
                { keys: ['Esc'], action: 'Close Launcher / Tutorial' },
              ].map(({ keys, action }) => (
                <div key={action} className="settings-option" style={{ padding: '12px 16px' }}>
                  <div className="settings-option-info">
                    <h3 style={{ fontSize: '13px' }}>{action}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {keys.map((key) => (
                      <kbd
                        key={key}
                        style={{
                          padding: '4px 8px',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '13px' }}>
              <Lightbulb size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> All shortcuts use Alt — no conflicts with browser shortcuts!
            </p>
          </div>
        );

      case 'system':
        return (
          <div className="settings-section">
            <h2 className="settings-title">System Information</h2>
            <p className="settings-subtitle">Technical details about this portfolio</p>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Operating System</h3>
                <p>Arch Linux (Simulated)</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Window Manager</h3>
                <p>Hyprland-style Tiling WM</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Shell</h3>
                <p>zsh 5.9</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Theme</h3>
                <p>Catppuccin Mocha</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Font</h3>
                <p>JetBrains Mono, Inter</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Framework</h3>
                <p>Next.js 14, React 19, TypeScript</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Source Code</h3>
                <p>
                  <a href="https://github.com/Dhruv1249" target="_blank" style={{ color: 'var(--accent-cyan)' }}>
                    github.com/Dhruv1249
                  </a>
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings">
      {/* Sidebar */}
      <div className="settings-sidebar">
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span>{section.icon}</span>
            <span>{section.name}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
}
