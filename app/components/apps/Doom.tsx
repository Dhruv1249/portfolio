'use client';

import React from 'react';
import { ExternalLink, Gamepad2 } from 'lucide-react';

const DOOM_EMBED_URL = 'https://archive.org/embed/doom_dos';
const DOOM_PLAY_URL = 'https://archive.org/details/doom_dos';

export default function Doom() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <Gamepad2 size={14} style={{ color: 'var(--accent-warning)', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            DOOM (1993)
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>- Retro mode</span>
        </div>

        <a
          href={DOOM_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-warning)';
            e.currentTarget.style.color = 'var(--accent-warning)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ExternalLink size={12} />
          Open Full Page
        </a>
      </div>

      <iframe
        src={DOOM_EMBED_URL}
        width="100%"
        height="100%"
        style={{ border: 'none', flexGrow: 1, background: '#000' }}
        title="DOOM"
        allowFullScreen
      />
    </div>
  );
}
