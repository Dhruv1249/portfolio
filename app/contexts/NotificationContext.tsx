'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';

export type NotificationType = 'info' | 'success' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let notifCounter = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = `notif-${++notifCounter}-${Date.now()}`;
    const notification: Notification = { id, message, type, timestamp: Date.now() };
    
    setNotifications(prev => [...prev.slice(-2), notification]); // Cap at 3

    // Auto-dismiss
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      timersRef.current.delete(id);
    }, 3000);
    
    timersRef.current.set(id, timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
