'use client';

import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const ICONS: Record<string, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
};

const COLORS: Record<string, string> = {
  info: 'var(--accent-primary)',
  success: 'var(--accent-tertiary)',
  warning: 'var(--accent-warning)',
};

export default function Notifications() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="notification-toast"
          style={{ borderLeftColor: COLORS[notif.type] }}
        >
          <span style={{ marginRight: '8px' }}>{ICONS[notif.type]}</span>
          <span>{notif.message}</span>
        </div>
      ))}
    </div>
  );
}
