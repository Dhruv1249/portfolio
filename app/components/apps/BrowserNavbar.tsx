"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

interface BrowserNavbarProps {
  name?: string;
  resumeUrl?: string;
  onOpenResume?: () => void;
}

export default function BrowserNavbar({ name = "Portfolio", resumeUrl = "", onOpenResume }: BrowserNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visibleItemCount, setVisibleItemCount] = useState(navLinks.length + 1);

  const logoRef = useRef<HTMLAnchorElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopControlsRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const desktopItems = [
    ...navLinks,
    ...(resumeUrl ? [{ label: "Resume", href: resumeUrl }] : []),
  ];

  const visibleDesktopItems = desktopItems.slice(0, visibleItemCount);
  const overflowDesktopItems = desktopItems.slice(visibleItemCount);

  useEffect(() => {
    const container = document.querySelector('.browser-content');
    if (container) {
      const onScroll = () => setScrolled(container.scrollTop > 50);
      container.addEventListener("scroll", onScroll);
      return () => container.removeEventListener("scroll", onScroll);
    } else {
      const onScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, []);

  useLayoutEffect(() => {
    const recompute = () => {
      if (!desktopNavRef.current || !desktopControlsRef.current) return;
      const logoWidth = logoRef.current?.clientWidth ?? 0;

      const available = desktopNavRef.current.clientWidth - logoWidth - desktopControlsRef.current.clientWidth - 44;
      if (available <= 0) {
        setVisibleItemCount(0);
        return;
      }

      const widths = desktopItems.map((item, i) => {
        const measured = measureRefs.current[i]?.offsetWidth ?? 84;
        const iconAllowance = item.label === "Resume" ? 18 : 0;
        return measured + iconAllowance + 20;
      });

      const total = widths.reduce((sum, w) => sum + w, 0);
      if (total <= available) {
        setVisibleItemCount(desktopItems.length);
        return;
      }

      const moreReserve = 84;
      let used = 0;
      let count = 0;
      for (const width of widths) {
        if (used + width + moreReserve > available) break;
        used += width;
        count += 1;
      }
      setVisibleItemCount(Math.max(0, count));
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    if (desktopNavRef.current) ro.observe(desktopNavRef.current);
    if (desktopControlsRef.current) ro.observe(desktopControlsRef.current);
    window.addEventListener("resize", recompute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [desktopItems.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      className="sticky top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(var(--bg-primary-rgb, 5, 5, 5), 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <div ref={desktopNavRef} style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem', width: '100%', gap: '1rem' }}>
        {/* Logo */}
        <a ref={logoRef} href="#" className="text-xl font-bold tracking-tight shrink-0" style={{ color: "var(--text-primary)", fontSize: '1.5rem', whiteSpace: 'nowrap' }}>
          {name}<span style={{ color: "var(--accent-primary, #2dd4bf)" }}>.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center" style={{ gap: '1rem', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', height: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {desktopItems.map((item, i) => (
              <span
                key={`measure-${item.href}`}
                ref={(el) => { measureRefs.current[i] = el; }}
                className="text-sm font-medium tracking-wide"
                style={{ fontSize: '0.9rem' }}
              >
                {item.label}
              </span>
            ))}
          </div>

          {visibleDesktopItems.map((item, i) => (
            item.label === 'Resume' ? (
              <motion.button
                key={item.href}
                type="button"
                onClick={onOpenResume}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[var(--accent-primary, #2dd4bf)] inline-flex items-center"
                style={{ color: "var(--text-muted)", fontSize: '0.9rem', gap: '0.35rem', whiteSpace: 'nowrap', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FileText size={14} />
                {item.label}
              </motion.button>
            ) : (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[var(--accent-primary, #2dd4bf)] inline-flex items-center"
                style={{ color: "var(--text-muted)", fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {item.label}
              </motion.a>
            )
          ))}

          <div ref={desktopControlsRef} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {overflowDesktopItems.length > 0 && (
          <div ref={moreRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="text-sm font-medium tracking-wide inline-flex items-center gap-1 transition-colors duration-300 hover:text-[var(--accent-primary, #2dd4bf)]"
              style={{ color: "var(--text-muted)", fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              More <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '210px',
                    background: 'rgb(var(--bg-primary-rgb, 5, 5, 5))',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '8px',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
                    zIndex: 120,
                  }}
                >
                  {overflowDesktopItems.map((item) => (
                    item.label === 'Resume' ? (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => {
                          onOpenResume?.();
                          setMoreOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          marginBottom: '2px',
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={14} />
                        {item.label}
                      </button>
                    ) : (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          marginBottom: '2px'
                        }}
                      >
                        {item.label}
                      </a>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}

          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85 }}
            className="text-sm font-semibold tracking-wide rounded-xl transition-all duration-300"
            style={{
              padding: "0.75rem 1.75rem",
              background: "var(--accent-dim, rgba(45,212,191,0.12))",
              color: "var(--accent-primary, #2dd4bf)",
              border: "1px solid var(--accent-glow, rgba(45,212,191,0.25))",
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-primary, #2dd4bf)";
              e.currentTarget.style.color = "#050505";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 20px var(--accent-glow, rgba(45,212,191,0.25))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--accent-dim, rgba(45,212,191,0.12))";
              e.currentTarget.style.color = "var(--accent-primary, #2dd4bf)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Get In Touch
          </motion.a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: "var(--text-primary)" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(5, 5, 5, 0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-base font-medium tracking-wide py-2 transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--text-secondary)", fontSize: '1.1rem' }}
                >
                  {link.label}
                </motion.a>
              ))}
              {resumeUrl && (
                <motion.button
                  type="button"
                  onClick={() => {
                    onOpenResume?.();
                    setMobileOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.06 }}
                  className="text-base font-medium tracking-wide py-2 inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--text-secondary)", fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <FileText size={18} /> Resume
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
