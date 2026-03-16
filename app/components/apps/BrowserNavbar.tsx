"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";

const personalInfo = {
  name: 'Dhruv',
  roles: ['Full-Stack Developer', 'DevOps Enthusiast', 'ML Engineer'],
  tagline: 'I build intelligent, scalable systems — from data pipelines to cloud-deployed AI applications.',
  email: 'dhruv1249.lm@gmail.com',
  github: 'https://github.com/Dhruv1249',
  linkedin: 'https://linkedin.com/in/dhruv124',
  resume: 'https://drive.google.com/file/d/15CVRIhP6VVB5kUqO5F8Q3rXjhrVvOvqI/view?usp=sharing',
};

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certificates", href: "#certificates" },
  { label: "Achievements", href: "#achievements" },
];

export default function BrowserNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem', width: '100%' }}>
        {/* Logo */}
        <a href="#" className="text-xl font-bold tracking-tight shrink-0" style={{ color: "var(--text-primary)", fontSize: '1.5rem' }}>
          Dhruv<span style={{ color: "var(--accent-primary, #2dd4bf)" }}>.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center" style={{ gap: '2rem' }}>
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[var(--accent-primary, #2dd4bf)]"
              style={{ color: "var(--text-muted)", fontSize: '0.9rem' }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href={personalInfo.resume}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75 }}
            className="text-sm font-medium tracking-wide inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-[var(--accent-primary, #2dd4bf)]"
            style={{ color: "var(--text-muted)", fontSize: '0.9rem' }}
          >
            <FileText size={15} /> Resume
          </motion.a>

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

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
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
            className="md:hidden overflow-hidden"
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
              <motion.a
                href={personalInfo.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
                className="text-sm font-medium uppercase tracking-widest py-2 inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <FileText size={14} /> Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
