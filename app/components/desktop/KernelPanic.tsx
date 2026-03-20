'use client';

import React, { useState, useEffect, useRef } from 'react';

const CRASH_LOGS = [
  '[    0.000000] Kernel panic - not syncing: Attempted to kill init!',
  '[    0.000012] CPU: 0 PID: 1 Comm: systemd Tainted: G      D 6.12.1-arch1-1',
  '[    0.000024] Hardware name: Portfolio OS v2.0 / Hyprland Desktop',
  '[    0.000031] Call Trace:',
  '[    0.000038]  <TASK>',
  '[    0.000042]  dump_stack_lvl+0x5d/0x80',
  '[    0.000051]  panic+0x159/0x320',
  '[    0.000058]  do_exit.cold+0x14/0x14',
  '[    0.000065]  do_group_exit+0x33/0xa0',
  '[    0.000071]  __x64_sys_exit_group+0x18/0x20',
  '[    0.000081]  do_syscall_64+0x56/0x120',
  '[    0.000089]  entry_SYSCALL_64_after_hwframe+0x6e/0x76',
  '[    0.000095]  </TASK>',
  '[    0.000102] ---[ end Kernel panic - not syncing: Attempted to kill init! ]---',
  '',
  '[    0.100000] Deleting /boot/vmlinuz-linux... done',
  '[    0.200000] Deleting /boot/initramfs-linux.img... done',
  '[    0.300000] Deleting /usr/lib/systemd/systemd... done',
  '[    0.400000] Deleting /etc/fstab... done',
  '[    0.500000] Deleting /home/dhruv/projects/... done',
  '[    0.600000] Deleting /var/lib/pacman/... done',
  '[    0.700000] Removing all shared libraries...',
  '[    0.750000]   /usr/lib/libc.so.6... deleted',
  '[    0.780000]   /usr/lib/libm.so.6... deleted',
  '[    0.800000]   /usr/lib/ld-linux-x86-64.so.2... deleted',
  '[    0.900000] WARNING: unable to load dynamic linker',
  '',
  '[    1.000000] FATAL: VFS: Unable to mount root fs',
  '[    1.100000] EXT4-fs error: no valid block groups',
  '[    1.200000] sd 0:0:0:0: [sda] I/O error, dev sda, sector 0',
  '[    1.300000] Buffer I/O error on dev sda1',
  '[    1.400000] Aborting journal on dev sda1-8.',
  '[    1.500000] EXT4-fs (sda1): Remounting filesystem read-only',
  '[    1.600000] EXT4-fs error: commit transaction failed',
  '',
  '[    2.000000] =========================================',
  '[    2.000001] [  BUG: portfolio completely destroyed  ]',
  '[    2.000002] =========================================',
  '[    2.000003] Just kidding. ;)',
  '[    2.000004] This is a portfolio, not a real server.',
  '[    2.000005] But I appreciate the audacity.',
  '[    2.000006] =========================================',
  '',
  '[    3.000000] System rebooting in 5 seconds...',
];

export default function KernelPanic() {
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [rebooting, setRebooting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePanic = () => setActive(true);
    window.addEventListener('kernel-panic', handlePanic);
    return () => window.removeEventListener('kernel-panic', handlePanic);
  }, []);

  useEffect(() => {
    if (!active) return;

    let lineIndex = 0;
    const timer = setInterval(() => {
      if (lineIndex < CRASH_LOGS.length) {
        setLines(prev => [...prev, CRASH_LOGS[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(timer);
        // Start countdown
        setRebooting(true);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [active]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Countdown and reboot
  useEffect(() => {
    if (!rebooting) return;
    if (countdown <= 0) {
      // "Reboot" — reload the page
      window.location.reload();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [rebooting, countdown]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      animation: 'crash-appear 0.3s ease-out',
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        zIndex: 1,
      }} />

      {/* Screen flicker */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        animation: 'crash-flicker 0.15s infinite',
        background: 'rgba(255,0,0,0.02)',
      }} />

      {/* Content */}
      <div ref={scrollRef} style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px',
        position: 'relative',
        zIndex: 3,
      }}>
        {lines.map((line, i) => {
          const l = line ?? '';
          return (
          <div key={i} style={{
            color: l.includes('BUG') || l.includes('FATAL') || l.includes('panic') || l.includes('error')
              ? '#ff4444'
              : l.includes('kidding') || l.includes('appreciate') || l.includes('portfolio')
                ? '#44ff44'
                : l.includes('WARNING')
                  ? '#ffaa00'
                  : l.startsWith('[')
                    ? '#cccccc'
                    : '#888888',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
            whiteSpace: 'pre',
          }}>
            {l || '\u00A0'}
          </div>
          );
        })}

        {rebooting && (
          <div style={{
            marginTop: '20px',
            color: '#44ff44',
            fontSize: '0.875rem',
            fontWeight: 600,
            animation: 'crash-blink 1s infinite',
          }}>
            Rebooting in {countdown}...
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes crash-appear {
          0% { opacity: 0; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes crash-flicker {
          0% { opacity: 0.02; }
          50% { opacity: 0; }
          100% { opacity: 0.03; }
        }
        @keyframes crash-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}} />
    </div>
  );
}
