'use client';

import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';

const DRIVE_FILE_ID = '15CVRIhP6VVB5kUqO5F8Q3rXjhrVvOvqI';
const PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view`;

export default function PDFViewer() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <FileText size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            resume.pdf
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>— Dhruv&apos;s CV</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <a
            href={VIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ExternalLink size={12} />
            Open
          </a>
          <a
            href={DOWNLOAD_URL}
            download="Dhruv_Resume.pdf"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--bg-primary)',
              background: 'var(--accent-primary)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '6px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Download size={12} />
            Download CV
          </a>
        </div>
      </div>

      {/* PDF Embed */}
      <iframe
        src={PREVIEW_URL}
        width="100%"
        height="100%"
        style={{ border: 'none', flexGrow: 1 }}
        title="Resume PDF Viewer"
        allow="autoplay"
      />
    </div>
  );
}
