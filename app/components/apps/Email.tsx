'use client';

import React, { useMemo, useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import appConfig from '../../lib/editor-config.json';

interface EmailFormState {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

const initialState: EmailFormState = {
  from_name: '',
  from_email: '',
  subject: '',
  message: '',
};

export default function Email() {
  const [form, setForm] = useState<EmailFormState>(initialState);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const isValid = useMemo(() => {
    return form.from_name.trim().length > 1
      && /^\S+@\S+\.\S+$/.test(form.from_email)
      && form.message.trim().length >= 10;
  }, [form]);

  const onChange = (key: keyof EmailFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status !== 'idle') {
      setStatus('idle');
      setStatusMessage('');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || sending) return;

    try {
      setSending(true);
      setStatus('idle');
      setStatusMessage('');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: form.from_name.trim(),
          from_email: form.from_email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          source: 'tech-portfolio-email-app',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send email');
      }

      setStatus('success');
      setStatusMessage("I'll reach out to you soon.");
      setForm(initialState);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send email';
      setStatus('error');
      setStatusMessage(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'transparent', minHeight: 0, overflow: 'hidden' }}>
      <div
        style={{
          borderBottom: '1px solid var(--border-color)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Email Dhruv</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>To: {appConfig.email.to}</div>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Direct contact</div>
      </div>

      <div style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
        {appConfig.email.notice}
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '0 16px 12px', display: 'grid', gap: '10px' }}>
          <input
            value={form.from_name}
            onChange={(e) => onChange('from_name', e.target.value)}
            placeholder="Your name"
            style={inputStyle}
            required
          />
          <input
            type="email"
            value={form.from_email}
            onChange={(e) => onChange('from_email', e.target.value)}
            placeholder="Your email"
            style={inputStyle}
            required
          />
          <input
            value={form.subject}
            onChange={(e) => onChange('subject', e.target.value)}
            placeholder="Subject (optional)"
            style={inputStyle}
          />
          <textarea
            value={form.message}
            onChange={(e) => onChange('message', e.target.value)}
            placeholder="Write your message..."
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '120px',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.5,
            }}
            required
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px 16px',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {status !== 'idle' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: status === 'success' ? 'var(--accent-green)' : 'var(--accent-error)' }}>
                {status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {statusMessage}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || sending}
            style={{
              border: '1px solid var(--accent-primary)',
              background: !isValid || sending ? 'var(--bg-elevated)' : 'var(--accent-primary)',
              color: !isValid || sending ? 'var(--text-muted)' : '#04110e',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: !isValid || sending ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {sending ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  padding: '10px 12px',
  fontSize: '0.8125rem',
  outline: 'none',
};
