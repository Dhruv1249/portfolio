'use client';

import React, { useState, useEffect } from 'react';
import { User, Paintbrush, Keyboard, Monitor, Trophy, Lightbulb, Check } from 'lucide-react';
import { useTheme, COLOR_PROFILES } from '../../contexts/ThemeContext';
import Image from 'next/image';

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
  const [photoVisible, setPhotoVisible] = useState(true);
  const [pendingFontScale, setPendingFontScale] = useState(1);
  const { activeProfile, setProfile, animations, setAnimations, particleMode, setParticleMode, transparency, setTransparency, windowOpacity, setWindowOpacity, fontScale, applyFontScale } = useTheme();

  useEffect(() => {
    fetch('/api/photo-toggle')
      .then(r => r.json())
      .then(d => setPhotoVisible(d.visible))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPendingFontScale(fontScale);
  }, [fontScale]);

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
              {photoVisible ? (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '2px solid var(--accent-primary)',
                  boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)',
                  flexShrink: 0,
                }}>
                  <Image
                    src="/dhruv.png"
                    alt="Dhruv"
                    width={80}
                    height={80}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  flexShrink: 0,
                }}>
                  <Monitor size={32} style={{ color: 'var(--accent-primary)' }} />
                </div>
              )}
              <div>
                <h3 style={{ color: 'var(--text-bright)', marginBottom: '4px' }}>Dhruv</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Full Stack Developer & ML Engineer</p>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
                  Built with Next.js, React, and TypeScript
                </p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Contact</h3>
                <p>dhruv1249.lm@gmail.com | +91 7876503573</p>
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
                <h3>Education — B.Tech CSE</h3>
                <p>Lovely Professional University, Punjab | CGPA: 8.66 | Aug &apos;23 – Present</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Education — Intermediate</h3>
                <p>G.A.V Sr. Sec. School, Kangra, Himachal Pradesh | 83% | Apr &apos;22 – Mar &apos;23</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Education — Matriculation</h3>
                <p>M.V.M Public High School, Kangra, Himachal Pradesh | 96% | Apr &apos;20 – Mar &apos;21</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Certifications</h3>
                <p>
                  <a href="https://drive.google.com/file/d/1oC01o8KJWbJgoAvF1imNXfG5KLEQgu9r/view?usp=sharing" target="_blank" style={{ color: 'var(--accent-cyan)', marginRight: '16px' }}>Cloud Computing (NPTEL)</a>
                  <a href="https://drive.google.com/file/d/1Ypk5IU8V_YzrDsZ1wsVm00OnfqWnwZol/view?usp=sharing" target="_blank" style={{ color: 'var(--accent-cyan)' }}>Large Language Models (NPTEL)</a>
                </p>
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
                <p>Glass blur and transparency on windows</p>
              </div>
              <div 
                className={`toggle ${transparency ? 'active' : ''}`}
                onClick={() => setTransparency(!transparency)}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            {transparency && (
              <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="settings-option-info">
                    <h3>Window Opacity</h3>
                    <p>Adjust window background transparency</p>
                  </div>
                  <span style={{ 
                    color: 'var(--accent-primary)', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    minWidth: '42px',
                    textAlign: 'right'
                  }}>{Math.round(windowOpacity * 100)}%</span>
                </div>
                <div style={{ position: 'relative', padding: '4px 0' }}>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={Math.round(windowOpacity * 100)}
                    onChange={(e) => setWindowOpacity(parseInt(e.target.value) / 100)}
                    style={{
                      width: '100%',
                      height: '6px',
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${((windowOpacity - 0.3) / 0.7) * 100}%, var(--bg-tertiary) ${((windowOpacity - 0.3) / 0.7) * 100}%, var(--bg-tertiary) 100%)`,
                      borderRadius: '3px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            )}

            <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="settings-option-info">
                  <h3>Global Font Size</h3>
                  <p>Adjust text scaling across all desktop apps</p>
                </div>
                <span style={{
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  minWidth: '58px',
                  textAlign: 'right'
                }}>{Math.round(pendingFontScale * 100)}%</span>
              </div>

              <div style={{ position: 'relative', padding: '4px 0' }}>
                <input
                  type="range"
                  min="70"
                  max="160"
                  value={Math.round(pendingFontScale * 100)}
                  onChange={(e) => setPendingFontScale(parseInt(e.target.value, 10) / 100)}
                  style={{
                    width: '100%',
                    height: '6px',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${((pendingFontScale - 0.7) / 0.9) * 100}%, var(--bg-tertiary) ${((pendingFontScale - 0.7) / 0.9) * 100}%, var(--bg-tertiary) 100%)`,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>Range: 70% to 160%</p>
                <button
                  onClick={() => applyFontScale(pendingFontScale)}
                  disabled={Math.abs(pendingFontScale - fontScale) < 0.005}
                  style={{
                    background: Math.abs(pendingFontScale - fontScale) < 0.005 ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                    color: Math.abs(pendingFontScale - fontScale) < 0.005 ? 'var(--text-muted)' : 'var(--bg-primary)',
                    border: `1px solid ${Math.abs(pendingFontScale - fontScale) < 0.005 ? 'var(--border-color)' : 'var(--accent-primary)'}`,
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: Math.abs(pendingFontScale - fontScale) < 0.005 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Particle Effects */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>Particle Effects</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { id: 'none', name: 'None' },
                  { id: 'nodes', name: 'Nodes' },
                  { id: 'rain', name: 'Rain' },
                  { id: 'floatinglines', name: 'Lines' },
                  { id: 'starfield', name: 'Stars' },
                  { id: 'galaxy', name: 'Galaxy' },
                  { id: 'threads', name: 'Threads' },
                  { id: 'lightrays', name: 'Rays' },
                  { id: 'firefly', name: 'Firefly' },
                ].map((effect) => {
                  const isActive = particleMode === effect.id;
                  return (
                    <div
                      key={effect.id}
                      onClick={() => setParticleMode(effect.id)}
                      style={{
                        padding: '12px',
                        background: isActive ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                        border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                      }}
                    >
                      {effect.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Profiles */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>Color Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {COLOR_PROFILES.map((profile) => {
                  const isActive = activeProfile.id === profile.id;
                  return (
                    <div
                      key={profile.id}
                      onClick={() => setProfile(profile.id)}
                      style={{
                        padding: '16px',
                        background: isActive ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                        border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                    >
                      {isActive && (
                        <div style={{
                          position: 'absolute', top: '8px', right: '8px',
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: 'var(--accent-primary)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={12} style={{ color: 'var(--bg-primary)' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                        {profile.preview.map((color, i) => (
                          <div
                            key={i}
                            style={{
                              width: '24px', height: '24px', borderRadius: '6px',
                              background: color,
                              border: '1px solid rgba(255,255,255,0.1)',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
                        {profile.name}
                      </span>
                    </div>
                  );
                })}
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
                    <h3 style={{ fontSize: '0.8125rem' }}>{action}</h3>
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
                          fontSize: '0.75rem',
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

            <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.8125rem' }}>
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
                <p>{activeProfile.name}</p>
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
                <p>Next.js 16, React 19, TypeScript</p>
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
