// app/components/apps/Browser.tsx
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Home, Folder, File, Server, Terminal as TermIcon, User, Layers,
  Globe, Search, ArrowLeft, ArrowRight, RotateCw,
  Lock, ExternalLink, X, Plus,
  ChevronDown, FileText, Briefcase, GraduationCap, MapPin,
  Trophy, Award, Code2, Cloud, Brain, Cpu, Database,
  Mail, Github, Linkedin, ArrowUpRight
} from 'lucide-react';
import TiltedCard from '../ui/TiltedCard';
import BrowserNavbar from './BrowserNavbar';
import Image from 'next/image';

/* ═══════════════ Exact Data from non-tech portfolio-data.ts ═══════════════ */

const personalInfo = {
  name: 'Dhruv',
  roles: ['Full-Stack Developer', 'DevOps Enthusiast', 'ML Engineer'],
  tagline: 'I build intelligent, scalable systems — from data pipelines to cloud-deployed AI applications.',
  email: 'dhruv1249.lm@gmail.com',
  github: 'https://github.com/Dhruv1249',
  linkedin: 'https://linkedin.com/in/dhruv124',
  resume: 'https://drive.google.com/file/d/15CVRIhP6VVB5kUqO5F8Q3rXjhrVvOvqI/view?usp=sharing',
};

const aboutText = 'CS undergraduate at Lovely Professional University. I design end-to-end systems that combine data, infrastructure, and intelligent applications — from raw data through ML pipelines to production-ready platforms.';

const engineeringFocus = [
  { title: 'Full-Stack Development', short: 'React • Next.js • Node.js • TypeScript • MongoDB' },
  { title: 'DevOps & Cloud', short: 'Docker • GCP • Firebase • CI/CD • Git' },
  { title: 'Machine Learning', short: 'Regression • Time-Series • Data Pipelines • Python' },
];

const focusIcons = [<Code2 key="c" size={22} />, <Cloud key="cl" size={22} />, <Brain key="b" size={22} />];

interface FeaturedProject {
  title: string; subtitle: string; description: string; tech: string[];
  badge?: string; github: string; live?: string; image?: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    title: 'CALYX', subtitle: 'Global Phenology Forecasting',
    description: 'Climate analytics platform forecasting phenological patterns using ML and NASA MERRA-2, ERA5, iNaturalist datasets. ~75% prediction accuracy. Docker + GCP deployment.',
    tech: ['Python', 'Docker', 'GCP', 'ML', 'NASA APIs'],
    badge: 'NASA Global Honorable Mention',
    github: 'https://github.com/Dhruv1249/Plant-Phenology-State-Detector',
    live: 'https://plant-phenology-state-detector.vercel.app/',
    image: '/calyx.png',
  },
  {
    title: 'UrbanSwap', subtitle: 'AI Marketplace Listing Generator',
    description: 'AI-powered platform converting product images into structured marketplace listings with titles, descriptions, and categories automatically.',
    tech: ['Next.js', 'Firebase', 'Gen AI', 'TypeScript'],
    github: 'https://github.com/Dhruv1249/ai-marketplace-assistant',
    live: 'https://ai-marketplace-assistant-162648101104.asia-south1.run.app/',
    image: '/urbanswap.png',
  },
  {
    title: 'PR Tracker', subtitle: 'Developer Collaboration Monitor',
    description: 'Centralized dashboard tracking pull request activity, review status, and merge progress across repositories using GitHub APIs.',
    tech: ['React', 'Node.js', 'GitHub API', 'REST'],
    github: 'https://github.com/Dhruv1249/Pr-Tracker',
    live: 'https://pr-tracker-client.vercel.app/',
    image: '/pr-tracker.png',
  },
];

const additionalProjects = [
  { title: 'Expense Tracker', short: 'MERN-stack financial management with interactive dashboards', tech: ['React', 'Node.js', 'MongoDB', 'REST'], github: 'https://github.com/Dhruv1249/expense-react-client', live: 'https://expense-react-client.vercel.app/' },
  { title: 'Neovim Config', short: 'Custom dev environment with LSP, plugins & keybindings', tech: ['Lua', 'Neovim', 'LSP'], github: 'https://github.com/Dhruv1249/my-customized-nvim-config' },
];

const experience = {
  role: 'Freelance Full-Stack Developer',
  description: 'Building responsive client websites with Next.js, Tailwind, and Firebase. Automated enquiry systems and lead management pipelines.',
  tech: ['Next.js', 'Tailwind CSS', 'Firebase', 'NodeMailer'],
};

const education = [
  { institution: 'Lovely Professional University', location: 'Punjab, India', degree: 'B.Tech in Computer Science & Engineering', score: 'CGPA: 8.72', period: "Aug '23 – Present" },
  { institution: 'G.A.V Sr. Sec. School', location: 'Kangra, Himachal Pradesh', degree: 'Intermediate', score: 'Percentage: 83%', period: "Apr '22 – Mar '23" },
  { institution: 'M.V.M Public High School', location: 'Kangra, Himachal Pradesh', degree: 'Matriculation', score: 'Percentage: 96%', period: "Apr '20 – Mar '21" },
];

const achievements = [
  { title: 'NASA Space Apps Challenge', award: 'Global Honorable Mention', detail: 'One of the top 23 teams worldwide out of 11,000+ submissions' },
  { title: 'Innov-a-thon (NIT Rourkela)', award: 'National Top 100', detail: 'Competitive hackathon — rapid prototyping & system design' },
];

const certifications = [
  { title: 'Cloud Computing', issuer: 'NPTEL', link: 'https://drive.google.com/file/d/1oC01o8KJWbJgoAvF1imNXfG5KLEQgu9r/view?usp=sharing' },
  { title: 'Introduction to Large Language Models', issuer: 'NPTEL', link: 'https://drive.google.com/file/d/1Ypk5IU8V_YzrDsZ1wsVm00OnfqWnwZol/view?usp=sharing' },
];

/* ═══════════════ Non-tech CSS Variables (inline) ═══════════════ */

const V = {
  bgPrimary: 'var(--bg-primary)',
  bgSecondary: 'var(--bg-secondary)',
  bgCard: 'var(--bg-tertiary, rgba(17,17,17,0.6))',
  borderSubtle: 'var(--border-color, rgba(255,255,255,0.06))',
  borderGlass: 'var(--border-color, rgba(255,255,255,0.08))',
  textPrimary: 'var(--text-primary, #f5f5f5)',
  textSecondary: 'var(--text-secondary, #a1a1aa)',
  textMuted: 'var(--text-muted, #52525b)',
  accent: 'var(--accent-primary)',
  accentSecondary: 'var(--accent-secondary)',
  accentDim: 'var(--accent-dim, rgba(45,212,191,0.12))',
  accentGlow: 'var(--accent-glow, rgba(45,212,191,0.25))',
};

/* ═══════════════ Shared Style Objects (matching non-tech classes) ═══════════════ */

const sectionPadding: React.CSSProperties = { padding: '80px 24px', maxWidth: '1152px', margin: '0 auto' };
const sectionDivider: React.CSSProperties = { height: '1px', background: `linear-gradient(90deg, transparent, ${V.borderSubtle}, transparent)`, margin: '0 auto', maxWidth: '80%' };

const glassCard: React.CSSProperties = {
  background: V.bgCard, backdropFilter: 'blur(12px)', border: `1px solid ${V.borderGlass}`,
  borderRadius: '16px', transition: 'all 0.4s cubic-bezier(0.25,0.4,0.25,1)',
};

const badgeGlow: React.CSSProperties = {
  display: 'inline-block', padding: '5px 16px', borderRadius: '999px', fontSize: '11px',
  fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em',
  background: V.accentDim, color: V.accent, border: `1px solid ${V.accentGlow}`,
};

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, var(--text-muted, #52525b) 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
};

const techPill: React.CSSProperties = {
  padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 500,
  background: V.accentDim, color: V.accent, border: `1px solid ${V.borderGlass}`,
};

const sectionLabel: React.CSSProperties = { fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', color: V.accent, marginBottom: '12px' };
const sectionTitle: React.CSSProperties = { fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '48px', lineHeight: 1.1 };

/* ═══════════════ AnimateOnScroll (same as non-tech) ═══════════════ */

function AnimateOnScroll({ children, delay = 0, direction = 'up', style }: {
  children: React.ReactNode; delay?: number; direction?: 'up' | 'right'; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const initial = direction === 'right' ? { opacity: 0, x: 40 } : { opacity: 0, y: 30 };
  const animate = isInView ? { opacity: 1, x: 0, y: 0 } : initial;

  return (
    <motion.div ref={ref} initial={initial} animate={animate}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }} style={style}>
      {children}
    </motion.div>
  );
}

/* ═══════════════ HomePage (exact non-tech replica) ═══════════════ */

function HomePage({ openTab }: { openTab: (url: string, title: string) => void }) {
  const [photoVisible, setPhotoVisible] = useState(true);

  useEffect(() => {
    fetch('/api/photo-toggle').then(r => r.json()).then(d => setPhotoVisible(d.visible)).catch(() => {});
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <BrowserNavbar />
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '48px 24px' }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.07, background: V.accent }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '300px', height: '300px', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.05, background: V.accent }} />
        </div>

        {/* Floating shapes */}
        <motion.div style={{ position: 'absolute', right: '12%', top: '25%', width: '100px', height: '100px', border: `1px solid ${V.accent}`, borderRadius: '16px', opacity: 0.06 }}
          animate={{ rotate: [45, 55, 45], y: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div style={{ position: 'absolute', left: '10%', bottom: '30%', width: '60px', height: '60px', border: `1px solid ${V.accent}`, borderRadius: '50%', opacity: 0.05 }}
          animate={{ scale: [1, 1.15, 1], y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

        {/* Content: text left (or centered), photo right */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: photoVisible ? '1100px' : '800px', width: '100%', display: 'flex', flexDirection: photoVisible ? 'row' : 'column', alignItems: 'center', justifyContent: photoVisible ? 'flex-start' : 'center', gap: '48px', textAlign: photoVisible ? 'left' : 'center' }}>
          {/* Text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: photoVisible ? 'flex-start' : 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}>
              <span style={badgeGlow}>Available for work</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
              style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, marginTop: '32px' }}>
              <span style={gradientText}>{personalInfo.name}</span>
              <span style={{ color: V.accent }}>.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ color: V.textMuted, fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '24px' }}>
              {personalInfo.roles.join(' • ')}
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              style={{ color: V.textSecondary, lineHeight: 1.7, maxWidth: '500px', marginTop: '24px', textAlign: photoVisible ? 'left' : 'center' }}>
              {personalInfo.tagline}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px', justifyContent: photoVisible ? 'flex-start' : 'center' }}>
              <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer" style={{
                padding: '14px 28px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: V.accentDim, color: V.accent, fontWeight: 600, fontSize: '14px',
                border: `1px solid ${V.accentGlow}`, textDecoration: 'none',
              }}><FileText size={16} /> View CV</a>
              <a href={`mailto:${personalInfo.email}`} style={{
                padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                border: `1px solid ${V.borderSubtle}`, color: V.textSecondary,
                background: 'rgba(255,255,255,0.03)', textDecoration: 'none',
              }}>Get In Touch</a>
            </motion.div>
          </div>

          {/* Photo — right side, bigger, rounded */}
          {photoVisible && (
            <motion.div initial={{ opacity: 0, scale: 0.85, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
              style={{ flexShrink: 0 }}>
              <div style={{
                width: '240px', height: '240px', borderRadius: '50%', overflow: 'hidden',
                border: `3px solid ${V.accent}`,
                boxShadow: `0 0 60px ${V.accentGlow}, 0 0 120px ${V.accentDim}`,
              }}>
                <Image src="/dhruv.png" alt="Dhruv" width={200} height={200}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={20} style={{ color: V.textMuted }} />
          </motion.div>
        </motion.div>
      </section>

      <div style={sectionDivider} />

      {/* ── STANDARD PORTFOLIO LINK ── */}
      <section style={{ ...sectionPadding, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <AnimateOnScroll>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{ ...glassCard, padding: '48px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
            onClick={() => window.open('https://dhruv-portfolio-nontech.vercel.app', '_blank')}
          >
            <div style={{ padding: '16px', borderRadius: '16px', background: V.accentDim, color: V.accent }}>
              <FileText size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: V.textPrimary, marginBottom: '12px' }}>Standard View</h3>
              <p style={{ color: V.textSecondary, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                Experience my streamlined, non-technical portfolio tailored for recruiters and HR professionals.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: V.accent, fontWeight: 600, marginTop: '8px' }}>
              <span>View Standard Portfolio</span> <ArrowRight size={16} />
            </div>
          </motion.div>
        </AnimateOnScroll>
      </section>

      <div style={sectionDivider} />

      {/* ── ABOUT ── */}
      <section id="about" style={sectionPadding}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <AnimateOnScroll>
              <p style={sectionLabel}>About Me</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <h2 style={{ ...sectionTitle, fontSize: 'clamp(28px, 3vw, 40px)' }}>
                <span style={gradientText}>Engineering end-to-end intelligent software systems</span>
                <span style={{ color: V.accent }}>.</span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <p style={{ color: V.textSecondary, lineHeight: 1.7 }}>{aboutText}</p>
            </AnimateOnScroll>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {engineeringFocus.map((focus, i) => (
              <AnimateOnScroll key={focus.title} delay={0.15 + i * 0.1} direction="right">
                <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ ...glassCard, padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: 'default' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}>
                    {focusIcons[i]}
                  </div>
                  <div>
                    <h3 style={{ color: V.textPrimary, fontWeight: 700, marginBottom: '6px' }}>{focus.title}</h3>
                    <p style={{ color: V.textMuted, fontSize: '12px', fontFamily: 'monospace', lineHeight: 1.5, margin: 0 }}>{focus.short}</p>
                  </div>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── PROJECTS ── */}
      <section id="projects" style={sectionPadding}>
        <AnimateOnScroll>
          <p style={sectionLabel}>Projects</p>
          <h2 style={sectionTitle}><span style={gradientText}>Featured Engineering Work</span></h2>
          <p style={{ color: V.textMuted, marginTop: '-36px', marginBottom: '64px' }}>
            A selection of projects I&apos;ve built — from climate forecasting to AI-powered marketplaces.
          </p>
        </AnimateOnScroll>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '96px' }}>
          {featuredProjects.map((project, i) => {
            const isEven = i % 2 === 0;
            return (
              <AnimateOnScroll key={project.title} delay={0.1}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                  {/* Image */}
                  <div style={{ order: isEven ? 1 : 2, position: 'relative', aspectRatio: '16/10', width: '100%' }}>
                    {project.image ? (
                      <TiltedCard
                        imageSrc={project.image}
                        altText={project.title}
                        containerHeight="100%"
                        containerWidth="100%"
                        imageHeight="100%"
                        imageWidth="100%"
                        rotateAmplitude={12}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip={false}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: V.bgCard, borderRadius: '16px', border: `1px solid ${V.borderGlass}` }}>
                        <span style={{ fontSize: '32px', color: V.accent, opacity: 0.4, fontWeight: 700 }}>{project.title}</span>
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div style={{ order: isEven ? 2 : 1 }}>
                    {project.badge && <span style={{ ...badgeGlow, marginBottom: '16px' }}>{project.badge}</span>}
                    <h3 style={{ color: V.textPrimary, fontSize: '24px', fontWeight: 700, marginBottom: '8px', marginTop: project.badge ? '16px' : 0 }}>
                      {project.title} — {project.subtitle}
                    </h3>
                    <p style={{ color: V.textSecondary, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>{project.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      {project.tech.map(t => <span key={t} style={techPill}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {project.live && (
                        <button onClick={() => openTab(project.live!, `${project.title} — Live`)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                          borderRadius: '12px', background: V.accent, color: V.bgPrimary,
                          fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer',
                        }}><ExternalLink size={15} /> Live Demo</button>
                      )}
                      <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                        borderRadius: '12px', border: `1px solid ${V.borderSubtle}`, color: V.textSecondary,
                        background: 'rgba(255,255,255,0.03)', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                      }}><Github size={15} /> Source Code</a>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Additional Projects */}
        <div style={{ marginTop: '96px' }}>
          <AnimateOnScroll>
            <p style={{ ...sectionLabel, color: V.textMuted }}>Also Built</p>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '40px' }}>
              <span style={gradientText}>Other Engineering Experiments</span>
            </h3>
          </AnimateOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {additionalProjects.map((proj, i) => (
              <AnimateOnScroll key={proj.title} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ ...glassCard, padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'default' }}>
                  <div>
                    <h4 style={{ color: V.textPrimary, fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{proj.title}</h4>
                    <p style={{ color: V.textMuted, fontSize: '14px', marginBottom: '16px' }}>{proj.short}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {proj.tech.map(t => <span key={t} style={techPill}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.live && (
                      <button onClick={() => openTab(proj.live!, `${proj.title} — Live`)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                        color: V.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}><ExternalLink size={13} /> Live</button>
                    )}
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                      color: V.textMuted, textDecoration: 'none',
                    }}><Github size={13} /> GitHub</a>
                  </div>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={sectionPadding}>
        <AnimateOnScroll>
          <p style={sectionLabel}>Experience</p>
          <h2 style={sectionTitle}><span style={gradientText}>Professional</span></h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <motion.div whileHover={{ x: 4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ ...glassCard, padding: '32px 40px', display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: 'default' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}><Briefcase size={22} /></div>
            <div>
              <h3 style={{ color: V.textPrimary, fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{experience.role}</h3>
              <p style={{ color: V.textMuted, fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>{experience.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {experience.tech.map(t => <span key={t} style={techPill}>{t}</span>)}
              </div>
            </div>
          </motion.div>
        </AnimateOnScroll>
      </section>

      <div style={sectionDivider} />

      {/* ── EDUCATION ── */}
      <section style={sectionPadding}>
        <AnimateOnScroll>
          <p style={sectionLabel}>Education</p>
          <h2 style={sectionTitle}><span style={gradientText}>Background</span></h2>
        </AnimateOnScroll>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {education.map((edu, i) => (
            <AnimateOnScroll key={edu.institution} delay={0.1 + i * 0.1}>
              <motion.div whileHover={{ x: 4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ ...glassCard, padding: '28px', display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'default' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}><GraduationCap size={20} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ color: V.textPrimary, fontWeight: 700, margin: 0 }}>{edu.institution}</h3>
                    <span style={{ color: V.textMuted, fontSize: '12px', fontFamily: 'monospace' }}>{edu.period}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                    <MapPin size={12} style={{ color: V.textMuted }} />
                    <span style={{ color: V.textMuted, fontSize: '12px' }}>{edu.location}</span>
                  </div>
                  <p style={{ color: V.textSecondary, margin: 0, fontSize: '14px' }}>
                    {edu.degree} · <span style={{ color: V.accent }}>{edu.score}</span>
                  </p>
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── ACHIEVEMENTS ── */}
      <section style={sectionPadding}>
        <AnimateOnScroll>
          <p style={sectionLabel}>Recognition</p>
          <h2 style={sectionTitle}><span style={gradientText}>Achievements</span></h2>
        </AnimateOnScroll>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {achievements.map((ach, i) => (
            <AnimateOnScroll key={ach.title} delay={0.1 + i * 0.1}>
              <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ ...glassCard, padding: '28px', display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'default', height: '100%' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}>
                  {i === 0 ? <Trophy size={22} /> : <Award size={22} />}
                </div>
                <div>
                  <p style={{ color: V.accent, fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{ach.award}</p>
                  <h4 style={{ color: V.textPrimary, fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{ach.title}</h4>
                  <p style={{ color: V.textMuted, fontSize: '14px', margin: 0 }}>{ach.detail}</p>
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── CERTIFICATIONS ── */}
      <section style={sectionPadding}>
        <AnimateOnScroll>
          <p style={sectionLabel}>Continuous Learning</p>
          <h2 style={sectionTitle}><span style={gradientText}>Certifications</span></h2>
        </AnimateOnScroll>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {certifications.map((cert, i) => (
            <AnimateOnScroll key={cert.title} delay={0.1 + i * 0.1}>
              <motion.a href={cert.link} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ ...glassCard, padding: '28px', display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', height: '100%', textDecoration: 'none' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}>
                  <Award size={22} />
                </div>
                <div>
                  <p style={{ color: V.accent, fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{cert.issuer}</p>
                  <h4 style={{ color: V.textPrimary, fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{cert.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: V.textMuted, marginTop: '12px' }}>
                    <span>View Certificate</span> <ExternalLink size={12} />
                  </div>
                </div>
              </motion.a>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ ...sectionPadding, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.06, background: V.accent }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <AnimateOnScroll>
            <p style={sectionLabel}>Contact</p>
            <h2 style={sectionTitle}>
              <span style={gradientText}>Let&apos;s build the future</span>
              <span style={{ color: V.accent }}>.</span>
            </h2>
            <p style={{ color: V.textMuted, marginTop: '-36px', marginBottom: '64px', maxWidth: '500px' }}>
              Interested in collaborating, discussing technology, or building impactful systems?
            </p>
          </AnimateOnScroll>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '560px' }}>
            {[
              { icon: <Mail size={20} />, label: 'Email', href: `mailto:${personalInfo.email}`, display: personalInfo.email },
              { icon: <Github size={20} />, label: 'GitHub', href: personalInfo.github, display: 'Dhruv1249' },
              { icon: <Linkedin size={20} />, label: 'LinkedIn', href: personalInfo.linkedin, display: 'dhruv124' },
            ].map(link => (
              <AnimateOnScroll key={link.label} delay={0.1}>
                <motion.a href={link.href} target={link.label !== 'Email' ? '_blank' : undefined}
                  rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  whileHover={{ x: 6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ ...glassCard, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent }}>{link.icon}</div>
                    <div>
                      <p style={{ color: V.textMuted, fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{link.label}</p>
                      <p style={{ color: V.textPrimary, fontSize: '14px', fontWeight: 500, margin: 0 }}>{link.display}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} style={{ color: V.accent, opacity: 0.5 }} />
                </motion.a>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── FOOTER ── */}
      <div style={{ padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: V.textMuted, fontSize: '12px' }}>© 2026 Dhruv. Crafted with Next.js & Tailwind CSS.</p>
      </div>
    </div>
  );
}

/* ═══════════════ Tab Types ═══════════════ */

interface BrowserTab {
  id: string;
  url: string;
  title: string;
  type: 'portfolio' | 'iframe';
}

/* ═══════════════ Main Browser ═══════════════ */

export default function Browser() {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: 'main', url: 'dhruv.dev', title: 'Dhruv — Portfolio', type: 'portfolio' },
  ]);
  const [activeTabId, setActiveTabId] = useState('main');
  const [urlInput, setUrlInput] = useState('dhruv.dev');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const openTab = useCallback((url: string, title: string) => {
    const id = `tab-${Date.now()}`;
    const newTab: BrowserTab = { id, url, title, type: 'iframe' };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
    setUrlInput(url);
  }, []);

  const closeTab = useCallback((id: string) => {
    if (tabs.length <= 1) return;
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeTabId === id) {
      const remaining = tabs.filter(t => t.id !== id);
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  }, [tabs, activeTabId]);

  useEffect(() => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) setUrlInput(tab.url);
  }, [activeTabId, tabs]);

  const renderContent = () => {
    if (activeTab.type === 'iframe') {
      return (
        <iframe src={activeTab.url}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={activeTab.title}
          sandbox="allow-scripts allow-same-origin allow-popups" />
      );
    }
    return <HomePage openTab={openTab} />;
  };

  return (
    <div className="browser">
      {/* Tab Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)', padding: '0 8px', height: '32px',
        gap: '2px', overflow: 'hidden',
      }}>
        {tabs.map(tab => (
          <div key={tab.id} onClick={() => setActiveTabId(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '6px 6px 0 0', cursor: 'pointer',
              background: tab.id === activeTabId ? 'var(--bg-tertiary)' : 'transparent',
              color: tab.id === activeTabId ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '11px', maxWidth: '180px', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0,
              borderTop: tab.id === activeTabId ? '2px solid var(--accent-primary)' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}>
            {tab.type === 'iframe' ? <Globe size={11} /> : <Lock size={11} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.title}</span>
            {tabs.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 2px', display: 'flex', lineHeight: 1 }}>
                <X size={10} />
              </button>
            )}
          </div>
        ))}
        <button onClick={() => openTab('about:blank', 'New Tab')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <Plus size={12} />
        </button>
      </div>

      {/* URL Bar */}
      <div className="browser-toolbar">
        <div className="browser-nav">
          <button className="browser-nav-btn"><ArrowLeft size={14} /></button>
          <button className="browser-nav-btn"><ArrowRight size={14} /></button>
          <button className="browser-nav-btn"><RotateCw size={14} /></button>
        </div>
        <div className="browser-url-bar">
          <span className="browser-url-lock">
            {activeTab.type === 'iframe' ? <Globe size={12} /> : <Lock size={12} />}
          </span>
          <input type="text" className="browser-url-input" value={urlInput} readOnly
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px', flex: 1, outline: 'none' }} />
        </div>
      </div>

      {/* Content */}
      <div className="browser-content">
        <AnimatePresence mode="wait">
          <motion.div key={activeTabId}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ height: '100%' }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}