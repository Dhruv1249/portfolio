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
  Mail, Github, Linkedin, ArrowUpRight, Calendar
} from 'lucide-react';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiPython,
  SiNodedotjs, SiDocker, SiGooglecloud, SiFirebase, SiMongodb,
  SiTailwindcss, SiGit, SiGithub, SiFastapi, SiHtml5, SiCss,
  SiScikitlearn, SiNumpy, SiPandas, SiCplusplus, SiPostgresql, SiTensorflow
} from "react-icons/si";
import { TbBinaryTree } from "react-icons/tb";
import TiltedCard from '../ui/TiltedCard';
import BrowserNavbar from './BrowserNavbar';
import { useWindowManager } from '@/app/contexts/WindowContext';
import Image from 'next/image';

/* ═══════════════ Mongo-first portfolio data with neutral fallbacks ═══════════════ */

const personalInfo = {
  name: 'Portfolio',
  roles: ['Profile not configured'],
  tagline: 'Portfolio data is loading or not configured.',
  email: '',
  github: '',
  linkedin: '',
  resume: '',
};

const aboutText = 'Portfolio data is not configured yet.';

const engineeringFocus = [
  { title: 'Build Systems', short: 'Define your stack in MongoDB portfolio data' },
  { title: 'Ship Products', short: 'Projects and experience are loaded from API' },
  { title: 'Evolve Profile', short: 'Achievements and certificates are data-driven' },
];

const focusIcons = [<Code2 key="c" size={22} />, <Cloud key="cl" size={22} />, <Brain key="b" size={22} />];

interface FeaturedProject {
  title: string; subtitle: string; description: string; tech: string[];
  badge?: string; github: string; live?: string; image?: string;
  period?: string;
}

interface AdditionalProject {
  title: string;
  short: string;
  tech: string[];
  github: string;
  live?: string;
  period?: string;
}

interface ExperienceData {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  tech: string[];
}

interface EducationItem {
  institution: string;
  location: string;
  degree: string;
  score: string;
  period?: string;
}

interface AchievementItem {
  title: string;
  award: string;
  detail: string;
  period?: string;
  link?: string;
}

interface CertificationItem {
  title: string;
  issuer: string;
  link: string;
  period?: string;
  image?: string;
}

const featuredProjects: FeaturedProject[] = [];

const additionalProjects: AdditionalProject[] = [];

const experience: ExperienceData = {
  role: 'Experience not configured',
  company: 'Company not configured',
  period: '',
  bullets: ['Add experience bullets in MongoDB portfolio data.'],
  tech: [],
};

const education: EducationItem[] = [];

const achievements: AchievementItem[] = [];

const certifications: CertificationItem[] = [];

interface SkillItem { name: string; icon: React.ReactNode; color: string; }
interface SkillCategory { title: string; skills: SkillItem[]; }

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: <SiReact size={28} />, color: "#61DAFB" },
      { name: "Next.js", icon: <SiNextdotjs size={28} />, color: "#ffffff" },
      { name: "TypeScript", icon: <SiTypescript size={28} />, color: "#3178C6" },
      { name: "JavaScript", icon: <SiJavascript size={28} />, color: "#F7DF1E" },
      { name: "Tailwind", icon: <SiTailwindcss size={28} />, color: "#06B6D4" },
      { name: "HTML/CSS", icon: <SiHtml5 size={28} />, color: "#E34F26" },
    ],
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: "Node.js", icon: <SiNodedotjs size={28} />, color: "#339933" },
      { name: "FastAPI", icon: <SiFastapi size={28} />, color: "#009688" },
      { name: "MongoDB", icon: <SiMongodb size={28} />, color: "#47A248" },
      { name: "Firebase", icon: <SiFirebase size={28} />, color: "#FFCA28" },
    ],
  },
  {
    title: "ML & Data Science",
    skills: [
      { name: "Python", icon: <SiPython size={28} />, color: "#3776AB" },
      { name: "scikit-learn", icon: <SiScikitlearn size={28} />, color: "#F7931E" },
      { name: "NumPy", icon: <SiNumpy size={28} />, color: "#013243" },
      { name: "Pandas", icon: <SiPandas size={28} />, color: "#150458" },
      { name: "XGBoost", icon: <TbBinaryTree size={28} />, color: "#FF6600" },
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      { name: "Docker", icon: <SiDocker size={28} />, color: "#2496ED" },
      { name: "GCP", icon: <SiGooglecloud size={28} />, color: "#4285F4" },
      { name: "Git", icon: <SiGit size={28} />, color: "#F05032" },
      { name: "GitHub", icon: <SiGithub size={28} />, color: "#ffffff" },
      { name: "CI/CD", icon: <SiGit size={28} />, color: "#E44332" },
      { name: "Cloud Run", icon: <SiGooglecloud size={28} />, color: "#4285F4" },
    ],
  },
];

const allSkills = skillCategories.flatMap((c) => c.skills);
const trailRow1 = [...allSkills.slice(0, 12), ...allSkills.slice(0, 12)];
const trailRow2 = [...allSkills.slice(12), ...allSkills.slice(12)];

const FALLBACK_PORTFOLIO_DATA = {
  personalInfo,
  aboutText,
  engineeringFocus,
  featuredProjects,
  additionalProjects,
  experience,
  education,
  achievements,
  certifications,
  skillCategories,
  trailRow1,
  trailRow2,
};

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

const sectionPadding: React.CSSProperties = { padding: '5rem 1.5rem', maxWidth: '72rem', margin: '0 auto' };
const sectionDivider: React.CSSProperties = { height: '1px', background: `linear-gradient(90deg, transparent, ${V.borderSubtle}, transparent)`, margin: '0 auto', maxWidth: '80%' };

const glassCard: React.CSSProperties = {
  background: V.bgCard, backdropFilter: 'blur(12px)', border: `1px solid ${V.borderGlass}`,
  borderRadius: '16px', transition: 'all 0.4s cubic-bezier(0.25,0.4,0.25,1)',
};

const badgeGlow: React.CSSProperties = {
  display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem',
  fontWeight: 600, letterSpacing: '0.05em',
  background: V.accentDim, color: V.accent, border: `1px solid ${V.accentGlow}`,
};

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, var(--text-muted, #52525b) 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
};

const techPill: React.CSSProperties = {
  padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500,
  background: V.accentDim, color: V.accent, border: `1px solid ${V.borderGlass}`,
};

const sectionLabel: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.1em', color: V.accent, marginBottom: '1rem' };
const sectionTitle: React.CSSProperties = { fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 700, letterSpacing: '-0.05em', marginBottom: '3rem', lineHeight: 0.9 };

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

function HomePage({ openTab, openResume }: { openTab: (url: string, title: string) => void; openResume: () => void }) {
  const [photoVisible, setPhotoVisible] = useState(true);
  const [portfolioData, setPortfolioData] = useState(FALLBACK_PORTFOLIO_DATA);

  const {
    personalInfo,
    aboutText,
    engineeringFocus,
    featuredProjects,
    additionalProjects,
    experience,
    education,
    achievements,
    certifications,
    skillCategories,
    trailRow1,
    trailRow2,
  } = portfolioData;

  const githubDisplay = personalInfo.github
    ? personalInfo.github.replace(/^https?:\/\/(www\.)?/i, '')
    : 'Not configured';
  const linkedinDisplay = personalInfo.linkedin
    ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/i, '')
    : 'Not configured';

  useEffect(() => {
    fetch('/api/photo-toggle').then(r => r.json()).then(d => setPhotoVisible(d.visible)).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolioData = async () => {
      try {
        const response = await fetch('/api/portfolio-data', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        const data = payload?.data;
        if (!data || cancelled) return;

        setPortfolioData(prev => ({
          ...prev,
          personalInfo: data.personalInfo ? { ...prev.personalInfo, ...data.personalInfo } : prev.personalInfo,
          aboutText: data.aboutText || prev.aboutText,
          engineeringFocus: Array.isArray(data.engineeringFocus) ? data.engineeringFocus : prev.engineeringFocus,
          featuredProjects: Array.isArray(data.featuredProjects) ? data.featuredProjects : prev.featuredProjects,
          additionalProjects: Array.isArray(data.additionalProjects) ? data.additionalProjects : prev.additionalProjects,
          experience: data.experience ? { ...prev.experience, ...data.experience } : prev.experience,
          education: Array.isArray(data.education) ? data.education : prev.education,
          achievements: Array.isArray(data.achievements) ? data.achievements : prev.achievements,
          certifications: Array.isArray(data.certifications) ? data.certifications : prev.certifications,
        }));
      } catch {
        // Keep fallback data when API is unavailable.
      }
    };

    loadPortfolioData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <BrowserNavbar name={personalInfo.name || 'Portfolio'} resumeUrl={personalInfo.resume} onOpenResume={openResume} />
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
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, marginTop: '32px' }}>
              <span style={gradientText}>{personalInfo.name}</span>
              <span style={{ color: V.accent }}>.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ color: V.textMuted, fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.05em', marginTop: '24px' }}>
              {personalInfo.roles.join(' • ')}
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              style={{ color: V.textSecondary, lineHeight: 1.7, maxWidth: '500px', marginTop: '24px', textAlign: photoVisible ? 'left' : 'center' }}>
              {personalInfo.tagline}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px', justifyContent: photoVisible ? 'flex-start' : 'center' }}>
              {personalInfo.resume && (
                <button type="button" onClick={openResume} style={{
                  padding: '14px 28px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: V.accentDim, color: V.accent, fontWeight: 600, fontSize: '0.875rem',
                  border: `1px solid ${V.accentGlow}`, textDecoration: 'none',
                  cursor: 'pointer',
                }}><FileText size={16} /> View CV</button>
              )}
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} style={{
                  padding: '1rem 2.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600,
                  border: `1px solid ${V.borderSubtle}`, color: V.textSecondary,
                  background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)',
                  textDecoration: 'none', transition: 'all 0.4s', cursor: 'pointer'
                }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.borderColor = V.accent;
                     e.currentTarget.style.color = '#050505';
                     e.currentTarget.style.background = V.accent;
                     e.currentTarget.style.transform = 'translateY(-2px)';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.borderColor = V.borderSubtle;
                     e.currentTarget.style.color = V.textSecondary;
                     e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                     e.currentTarget.style.transform = 'translateY(0)';
                   }}
                >Get in Touch</a>
              )}
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
                <Image src="/dhruv.png" alt={personalInfo.name || 'Profile'} width={200} height={200}
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
            onClick={() => window.open(process.env.NEXT_PUBLIC_NON_TECH_PORTFOLIO_URL, '_blank')}
          >
            <div style={{ padding: '16px', borderRadius: '16px', background: V.accentDim, color: V.accent }}>
              <FileText size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: V.textPrimary, marginBottom: '12px' }}>Standard View</h3>
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
              <p style={{ ...sectionTitle, fontSize: 'clamp(2rem, 5vw, 4rem)' }}>About Me</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <h2 style={{ ...sectionLabel, color: V.accent, fontSize: '1.1rem' }}>
                <span style={gradientText}>Engineering end-to-end intelligent software systems</span>
                <span style={{ color: V.accent }}>.</span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <p style={{ color: V.textSecondary, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{aboutText}</p>
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
                    <p style={{ color: V.textMuted, fontSize: '0.75rem', fontFamily: 'monospace', lineHeight: 1.5, margin: 0 }}>{focus.short}</p>
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
          <p style={{ ...sectionTitle, fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '12px' }}>Projects</p>
          <h2 style={{ ...sectionLabel, fontSize: '1.2rem', marginBottom: '40px' }}><span style={gradientText}>Featured Engineering Work</span></h2>
          <p style={{ color: V.textMuted, marginTop: '-24px', marginBottom: '64px' }}>
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
                        <span style={{ fontSize: '2rem', color: V.accent, opacity: 0.4, fontWeight: 700 }}>{project.title}</span>
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div style={{ order: isEven ? 2 : 1 }}>
                    {project.badge && <span style={{ ...badgeGlow, marginBottom: '16px' }}>{project.badge}</span>}
                    <h3 style={{ color: V.textPrimary, fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', marginTop: project.badge ? '16px' : 0 }}>
                      {project.title} — {project.subtitle}
                    </h3>
                    {project.period && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'monospace', color: V.accent, marginBottom: '16px' }}>
                        <Calendar size={14} /> {project.period}
                      </div>
                    )}
                    <p style={{ color: V.textSecondary, fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>{project.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      {project.tech.map(t => <span key={t} style={techPill}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {project.live && (
                        <button onClick={() => openTab(project.live!, `${project.title} — Live`)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                          borderRadius: '12px', background: V.accent, color: '#050505',
                          fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer',
                        }}><ExternalLink size={15} /> Live Demo</button>
                      )}
                      <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                        borderRadius: '12px', border: `1px solid ${V.borderSubtle}`, color: V.textSecondary,
                        background: 'rgba(255,255,255,0.03)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
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
            <p style={{ ...sectionTitle, fontSize: '2.5rem', marginBottom: '8px' }}>Also Built</p>
            <h3 style={{ ...sectionLabel, fontSize: '1.1rem', marginBottom: '40px' }}>
              <span style={gradientText}>Other Engineering Experiments</span>
            </h3>
          </AnimateOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {additionalProjects.map((proj, i) => (
              <AnimateOnScroll key={proj.title} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ ...glassCard, padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'default' }}>
                  <div>
                    <h4 style={{ color: V.textPrimary, fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>{proj.title}</h4>
                    {proj.period && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'monospace', color: V.accent, marginBottom: '12px' }}>
                        <Calendar size={12} /> {proj.period}
                      </div>
                    )}
                    <p style={{ color: V.textMuted, fontSize: '0.875rem', marginBottom: '16px' }}>{proj.short}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {proj.tech.map(t => <span key={t} style={techPill}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.live && (
                      <button onClick={() => openTab(proj.live!, `${proj.title} — Live`)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem',
                        color: V.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}><ExternalLink size={13} /> Live</button>
                    )}
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem',
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

      {/* ── SKILLS ── */}
      <section id="skills" style={sectionPadding}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <AnimateOnScroll>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <p style={{ ...sectionTitle, fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '12px' }}>Tech Stack</p>
              <h2 style={{ ...sectionLabel, fontSize: '1.2rem' }}>
                <span style={gradientText}>Core Toolkit</span>
              </h2>
              <p style={{ fontSize: '1rem', color: V.textMuted, maxWidth: '600px', margin: '16px auto 0' }}>
                Technologies I work with daily to build production-ready systems.
              </p>
            </div>
          </AnimateOnScroll>

          {/* 2×2 Symmetric Category Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {skillCategories.map((category, catIdx) => (
              <AnimateOnScroll key={category.title} delay={catIdx * 0.1}>
                <div style={{ ...glassCard, padding: '32px', height: '100%' }}>
                  <h3 style={{ fontSize: '0.875rem', fontFamily: 'monospace', letterSpacing: '0.2em', marginBottom: '32px', textAlign: 'center', color: V.accent }}>
                    {category.title}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                    {category.skills.map(skill => (
                      <motion.div key={skill.name}
                        whileHover={{ scale: 1.08, y: -4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(255,255,255,0.02)', border: `1px solid ${V.borderGlass}`, borderRadius: '16px',
                          padding: '16px', gap: '12px', transition: 'all 0.3s', cursor: 'default',
                          width: 'calc(33.333% - 11px)', minWidth: '80px'
                        }}
                      >
                        <span style={{ color: skill.color, transition: 'all 0.3s' }}>{skill.icon}</span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 500, textAlign: 'center', color: V.textMuted, lineHeight: 1.1 }}>
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Moving Icon Trail */}
        <div style={{ marginTop: '80px', padding: '40px 0', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.div style={{ display: 'flex', gap: '24px', width: 'max-content' }}
              animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }}>
              {trailRow1.map((skill, i) => (
                <div key={`r1-${skill.name}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '999px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${V.borderSubtle}`, flexShrink: 0 }}>
                  <span style={{ color: skill.color, opacity: 0.7 }}>{skill.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', color: V.textMuted }}>{skill.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.div style={{ display: 'flex', gap: '24px', width: 'max-content' }}
              animate={{ x: [-1000, 0] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }}>
              {trailRow2.map((skill, i) => (
                <div key={`r2-${skill.name}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '999px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${V.borderSubtle}`, flexShrink: 0 }}>
                  <span style={{ color: skill.color, opacity: 0.7 }}>{skill.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', color: V.textMuted }}>{skill.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={sectionPadding}>
        <AnimateOnScroll>
          <p style={{ ...sectionTitle, fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '12px' }}>Experience</p>
          <h2 style={{ ...sectionLabel, fontSize: '1.2rem' }}><span style={gradientText}>Professional</span></h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <motion.div whileHover={{ x: 4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ ...glassCard, padding: '32px 40px', display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: 'default' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}><Briefcase size={22} /></div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                <h3 style={{ color: V.textPrimary, fontSize: '1.25rem', fontWeight: 700 }}>{experience.role}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: V.textMuted, fontSize: '0.75rem' }}>
                    <MapPin size={12} /> {experience.company}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: V.accent, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    <Calendar size={12} /> {experience.period}
                  </span>
                </div>
              </div>
              <ul style={{ padding: 0, margin: '0 0 20px 0', listStyle: 'none' }}>
                {experience.bullets.map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: V.textMuted, fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '8px' }}>
                    <span style={{ marginTop: '8px', width: '6px', height: '6px', borderRadius: '50%', background: V.accent, flexShrink: 0 }} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {experience.tech.map(t => <span key={t} style={techPill}>{t}</span>)}
              </div>
            </div>
          </motion.div>
        </AnimateOnScroll>
      </section>

      <div style={sectionDivider} />

      {/* ── EDUCATION ── */}
      <section id="education" style={sectionPadding}>
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
                    <span style={{ color: V.accent, fontSize: '0.75rem', fontFamily: 'monospace' }}>{edu.period}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                    <MapPin size={12} style={{ color: V.textMuted }} />
                    <span style={{ color: V.textMuted, fontSize: '0.75rem' }}>{edu.location}</span>
                  </div>
                  <p style={{ color: V.textSecondary, margin: 0, fontSize: '0.875rem' }}>
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
      <section id="achievements" style={sectionPadding}>
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
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <p style={{ color: V.accent, fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>{ach.award}</p>
                    {ach.period && (
                      <span style={{ color: V.accent, fontSize: '0.75rem', fontFamily: 'monospace' }}>{ach.period}</span>
                    )}
                  </div>
                  <h4 style={{ color: V.textPrimary, fontWeight: 700, fontSize: '1.125rem', marginBottom: '8px' }}>{ach.title}</h4>
                  <p style={{ color: V.textMuted, fontSize: '0.875rem', margin: 0 }}>{ach.detail}</p>
                  {ach.link && (
                    <a
                      href={ach.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.75rem', color: V.textMuted, textDecoration: 'none' }}
                    >
                      <span>View Proof</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <div style={sectionDivider} />

      {/* ── CERTIFICATES ── */}
      <section id="certificates" style={sectionPadding}>
        <AnimateOnScroll>
          <p style={sectionLabel}>Continuous Learning</p>
          <h2 style={sectionTitle}><span style={gradientText}>Certificates</span></h2>
        </AnimateOnScroll>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {certifications.map((cert, i) => (
            <AnimateOnScroll key={cert.title} delay={0.1 + i * 0.1}>
              <motion.a href={cert.link} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ ...glassCard, padding: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%', textDecoration: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '220px', borderBottom: `1px solid ${V.borderSubtle}` }}>
                  {cert.image ? (
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: V.bgSecondary }}>
                      <Award size={46} style={{ color: V.accent, opacity: 0.45 }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start', flexGrow: 1 }}>
                  <div style={{ padding: '10px', borderRadius: '12px', background: V.accentDim, color: V.accent, flexShrink: 0 }}>
                    <Award size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ color: V.accent, fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>{cert.issuer}</p>
                      {cert.period && (
                        <span style={{ color: V.accent, fontSize: '0.75rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{cert.period}</span>
                      )}
                    </div>
                    <h4 style={{ color: V.textPrimary, fontWeight: 700, fontSize: '1.125rem', marginBottom: '8px' }}>{cert.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: V.textMuted, marginTop: '12px' }}>
                      <span>View Certificate</span>
                      <ExternalLink size={12} />
                    </div>
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
              { icon: <Github size={20} />, label: 'GitHub', href: personalInfo.github, display: githubDisplay },
              { icon: <Linkedin size={20} />, label: 'LinkedIn', href: personalInfo.linkedin, display: linkedinDisplay },
            ].filter(link => link.href).map(link => (
              <AnimateOnScroll key={link.label} delay={0.1}>
                <motion.a href={link.href} target={link.label !== 'Email' ? '_blank' : undefined}
                  rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  whileHover={{ x: 6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ ...glassCard, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: V.accentDim, color: V.accent }}>{link.icon}</div>
                    <div>
                      <p style={{ color: V.textMuted, fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{link.label}</p>
                      <p style={{ color: V.textPrimary, fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{link.display}</p>
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
        <p style={{ color: V.textMuted, fontSize: '0.75rem' }}>© 2026 {personalInfo.name || 'Portfolio'}. Crafted with Next.js & Tailwind CSS.</p>
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
  const { openWindow } = useWindowManager();
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: 'main', url: 'portfolio.dev', title: 'Portfolio', type: 'portfolio' },
  ]);
  const [activeTabId, setActiveTabId] = useState('main');
  const [urlInput, setUrlInput] = useState('portfolio.dev');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const openTab = useCallback((url: string, title: string) => {
    const id = `tab-${Date.now()}`;
    const newTab: BrowserTab = { id, url, title, type: 'iframe' };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
    setUrlInput(url);
  }, []);

  const openResume = useCallback(() => {
    openWindow('pdfviewer', 'resume.pdf');
  }, [openWindow]);

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
    return <HomePage openTab={openTab} openResume={openResume} />;
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
              fontSize: '0.6875rem', maxWidth: '180px', whiteSpace: 'nowrap',
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
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', flex: 1, outline: 'none' }} />
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