// app/components/apps/Browser.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { Globe, Bot, GitBranch, Wallet, FileText, Zap, Trophy, Medal, Monitor, Cloud, Brain, Search, ArrowLeft, ArrowRight, RotateCw, Lock } from 'lucide-react';

interface ProjectDetail {
  slug: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  gradient: string;
  description: string[];
  tech: string[];
  features: string[];
  github: string;
  live: string;
  highlight?: string;
}

const PROJECTS: ProjectDetail[] = [
  {
    slug: 'calyx',
    name: 'CALYX',
    icon: <Globe size={40} />,
    tagline: 'Global Phenology Forecasting Platform',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    description: [
      'Calyx is a climate analytics platform designed to forecast global phenological patterns using machine learning and environmental datasets.',
      'The platform integrates multiple large-scale data sources including NASA MERRA-2 climate data, ERA5 weather datasets, iNaturalist biological observations, and Köppen climate classifications.',
      'Three temporal regression models were trained to predict phenological events, achieving approximately seventy-five percent prediction accuracy.',
      'The application was containerized using Docker and deployed on Google Cloud Run, enabling scalable deployment and efficient resource management.',
    ],
    tech: ['Python', 'XGBoost', 'Pandas', 'Google Maps API', 'Docker', 'GCP Cloud Run'],
    features: ['Data Pipeline (MERRA-2 / ERA5)', 'Temporal Regression Models', 'Google Maps Overlay', 'Dockerized Deployment'],
    github: 'https://github.com/Dhruv1249/Plant-Phenology-State-Detector',
    live: 'https://plant-phenology-state-detector.vercel.app/',
    highlight: 'NASA Space Apps 2025 — Global Honorable Mention (Top 23 worldwide)',
  },
  {
    slug: 'urbanswap',
    name: 'UrbanSwap',
    icon: <Bot size={40} />,
    tagline: 'AI Marketplace Listing Generator',
    gradient: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
    description: [
      'UrbanSwap is an AI-powered marketplace assistant that automates the process of generating marketplace listings from product images.',
      'The platform integrates generative AI to analyze product images and produce structured listings including titles, descriptions, and categorized product information.',
      'Users can convert a single product image into a ready-to-publish marketplace entry, dramatically reducing listing creation time.',
    ],
    tech: ['Next.js', 'Firebase Auth', 'Firestore', 'Gemini Vision API', 'Google Cloud Run'],
    features: ['Image → Listing Generation', 'Structured Data Extraction', 'Firebase Auth Integration', 'AI Pipeline Orchestration'],
    github: 'https://github.com/Dhruv1249/ai-marketplace-assistant',
    live: 'https://ai-marketplace-assistant-162648101104.asia-south1.run.app/',
  },
  {
    slug: 'pr-tracker',
    name: 'PR Tracker',
    icon: <GitBranch size={40} />,
    tagline: 'Developer Collaboration Monitoring Tool',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    description: [
      'PR Tracker is a developer productivity platform designed to monitor pull request activity across repositories.',
      'The system aggregates pull request data and provides a centralized dashboard for tracking review status, merge progress, and repository activity.',
      'It integrates GitHub APIs with a web interface that presents collaboration insights and repository metrics.',
    ],
    tech: ['React', 'Node.js', 'GitHub API', 'REST APIs'],
    features: ['Multi-repo PR Dashboard', 'Review Status Tracking', 'Merge Progress Visualization', 'GitHub API Integration'],
    github: 'https://github.com/Dhruv1249/Pr-Tracker',
    live: 'https://pr-tracker-client.vercel.app/',
  },
  {
    slug: 'expense-tracker',
    name: 'Expense Tracker',
    icon: <Wallet size={40} />,
    tagline: 'Full-Stack Financial Management',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    description: [
      'A MERN-based web application for personal expense tracking with categorization and interactive dashboards.',
      'Users can create, update, and manage expense records while viewing structured summaries of their financial data.',
      'The project demonstrates full-stack architecture with RESTful API design, authentication, and responsive interfaces.',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'REST API'],
    features: ['Expense CRUD Operations', 'Category Management', 'Interactive Dashboard', 'RESTful Backend'],
    github: 'https://github.com/Dhruv1249/expense-react-client',
    live: 'https://expense-react-client.vercel.app/',
  },
  {
    slug: 'llm-parser',
    name: 'LLM Document Parser',
    icon: <FileText size={40} />,
    tagline: 'Enterprise Unstructured Data Pipeline',
    gradient: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
    description: [
      'A semantic parsing pipeline that converts PDFs and images into strictly validated JSON schemas using Large Language Models.',
      'Features intelligent chunking that splits documents into semantic sections rather than arbitrary page breaks.',
      'Every extracted data point includes source coordinates highlighting exactly where in the original PDF the data came from.',
    ],
    tech: ['Python', 'LangChain', 'Pydantic', 'GPT-4', 'LayoutLMv3'],
    features: ['Semantic Chunking', 'Citation Mapping', 'Schema Validation', 'Multi-format Support'],
    github: 'https://github.com/Dhruv1249/LLM-Document-Processing-System',
    live: 'https://github.com/Dhruv1249/LLM-Document-Processing-System',
  },
  {
    slug: 'neovim-config',
    name: 'Neovim Config',
    icon: <Zap size={40} />,
    tagline: 'Personal Development Environment',
    gradient: 'linear-gradient(135deg, #1a1b26 0%, #24283b 100%)',
    description: [
      'A fully customized Neovim configuration designed to optimize developer productivity within a terminal-based editor.',
      'Integrates language server support, syntax highlighting via Treesitter, plugin management via lazy.nvim, and custom keybindings.',
      'Startup time optimized to under 20ms through byte-compilation and deferred loading.',
    ],
    tech: ['Lua', 'Lazy.nvim', 'Treesitter', 'LSP', 'Telescope'],
    features: ['<20ms Startup', 'AST Syntax Highlighting', 'Fuzzy Finding', 'Custom LSP Handlers'],
    github: 'https://github.com/Dhruv1249/my-customized-nvim-config',
    live: 'https://github.com/Dhruv1249/my-customized-nvim-config',
  },
];

const CERTS = [
  { name: 'Cloud Computing', org: 'NPTEL', date: 'Apr. 2025' },
  { name: 'Introduction to Large Language Models', org: 'NPTEL', date: 'Apr. 2025' },
  { name: 'Coding for Everyone: C and C++', org: 'Coursera', date: 'Feb. 2024' },
];

// ─── Page Components ─────────────────────────────────
function HomePage({ navigate }: { navigate: (url: string) => void }) {
  return (
    <div className="portfolio">
      {/* Status */}
      <div className="portfolio-badge">
        <span style={{ color: '#4ade80' }}>●</span> AVAILABLE FOR ROLES
      </div>

      {/* Hero */}
      <h1 className="portfolio-title">
        Engineering <span className="highlight">Intelligent</span><br />
        Web Systems.
      </h1>

      <p className="portfolio-subtitle">
        Full-Stack Developer • DevOps Enthusiast • Machine Learning Engineer
      </p>

      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '680px' }}>
        I build intelligent, scalable systems by combining modern web technologies,
        machine learning models, and cloud infrastructure. My work spans full-stack platforms,
        data pipelines, and AI-driven applications deployed using containerized environments.
      </p>

      <div className="portfolio-buttons">
        <button onClick={() => navigate('dhruv.dev/projects')} className="portfolio-btn primary">View Case Studies</button>
        <a href="mailto:dhruv1249.lm@gmail.com" className="portfolio-btn secondary">Hire Me</a>
      </div>

      {/* NASA Badge */}
      <div style={{
        padding: '24px', background: 'linear-gradient(135deg, rgba(122, 162, 247, 0.1), rgba(187, 154, 247, 0.05))',
        borderRadius: '16px', border: '1px solid rgba(122, 162, 247, 0.2)', marginBottom: '48px',
        display: 'flex', alignItems: 'center', gap: '20px'
      }}>
        <Trophy size={42} style={{ color: 'var(--accent-warning)' }} />
        <div>
          <div style={{ color: 'var(--accent-warning)', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
            NASA Space Apps Challenge 2025
          </div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
            Global Honorable Mention (Top 23 Worldwide)
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
            Selected from 11,500+ submissions for <strong>CALYX</strong> — a climate forecasting platform integrating large-scale environmental datasets.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="portfolio-section" id="projects">
        <h2 className="portfolio-section-title">Featured Projects</h2>
        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <div
              key={project.slug}
              className="project-card"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              onClick={() => navigate(`dhruv.dev/projects/${project.slug}`)}
            >
              <div className="project-image" style={{ background: project.gradient }}>
                <span style={{ fontSize: '48px' }}>{project.icon}</span>
              </div>
              <div className="project-info">
                <div className="project-name">{project.name}</div>
                <div className="project-desc">
                  {project.tagline}
                  <br />
                  <span style={{ color: 'var(--accent-tertiary)', fontSize: '12px' }}>
                    {project.tech.slice(0, 3).join(' • ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Focus */}
      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Engineering Focus</h2>
        <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          {[
            { title: 'Full-Stack Development', icon: <Monitor size={24} style={{ color: 'var(--accent-primary)' }} />, desc: 'Modern web applications with scalable architecture, responsive interfaces, and maintainable backend systems using React, Next.js, Node.js, and REST APIs.' },
            { title: 'DevOps & Cloud', icon: <Cloud size={24} style={{ color: 'var(--accent-tertiary)' }} />, desc: 'Docker containerization, Google Cloud deployment, Firebase services, and Git-based CI/CD workflows for production-ready applications.' },
            { title: 'Data Science & ML', icon: <Brain size={24} style={{ color: 'var(--accent-warning)' }} />, desc: 'Data pipelines, regression models, time-series prediction, and deploying ML models within production software systems.' },
          ].map(area => (
            <div key={area.title} style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ display: 'flex' }}>{area.icon}</span>
                <h3 style={{ color: 'var(--text-bright)', fontWeight: 700, margin: 0 }}>{area.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{area.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Professional Experience</h2>
        <div style={{ marginTop: '16px', padding: '24px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ color: 'var(--text-bright)', fontWeight: 700, fontSize: '18px' }}>Freelance Full-Stack Developer</div>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '4px' }}>Remote</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', background: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: '4px' }}>Nov 2025 – Present</span>
          </div>
          <ul style={{ color: 'var(--text-secondary)', margin: 0, paddingLeft: '20px', lineHeight: 1.8, fontSize: '14px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Performance Engineering:</strong> Built responsive client websites using Next.js + Tailwind CSS, achieving <strong style={{ color: 'var(--accent-tertiary)' }}>99/100 Core Web Vitals</strong> scores.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Automation:</strong> Integrated NodeMailer + Firebase for automated enquiry systems and centralized lead management pipelines.
            </li>
            <li>
              <strong>SEO Strategy:</strong> Deployed semantic HTML5 and JSON-LD schemas, resulting in <strong>40% organic traffic increase</strong> within 3 months.
            </li>
          </ul>
        </div>
      </section>

      {/* Achievements */}
      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Achievements</h2>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid rgba(255, 158, 100, 0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Trophy size={28} style={{ color: 'var(--accent-warning)' }} />
            <div>
              <div style={{ color: 'var(--accent-warning)', fontWeight: 700 }}>NASA Space Apps Challenge — Global Honorable Mention</div>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '13px' }}>Top 23 worldwide from 11,500+ submissions for CALYX climate forecasting platform.</p>
            </div>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid rgba(122, 162, 247, 0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Medal size={28} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Innov-a-thon — National Top 100</div>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '13px' }}>NIT Rourkela national competition — strong problem-solving and rapid prototyping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Certifications</h2>
        <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
          {CERTS.map(cert => (
            <div key={cert.name} style={{ padding: '14px 20px', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cert.name}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '13px' }}>— {cert.org}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{cert.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        <p>Designed & Engineered by Dhruv</p>
        <p style={{ marginTop: '8px', opacity: 0.6 }}>Built with Next.js 14, React 19, and TypeScript</p>
      </footer>
    </div>
  );
}

function ProjectsPage({ navigate }: { navigate: (url: string) => void }) {
  return (
    <div className="portfolio">
      <h1 className="portfolio-title" style={{ fontSize: '32px' }}>All Projects</h1>
      <p className="portfolio-subtitle">Case studies and engineering deep-dives</p>
      <div className="projects-grid" style={{ marginTop: '24px' }}>
        {PROJECTS.map((project) => (
          <div
            key={project.slug}
            className="project-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`dhruv.dev/projects/${project.slug}`)}
          >
            <div className="project-image" style={{ background: project.gradient }}>
              <span style={{ fontSize: '48px' }}>{project.icon}</span>
            </div>
            <div className="project-info">
              <div className="project-name">{project.name}</div>
              <div className="project-desc">
                {project.tagline}
                <br />
                <span style={{ color: 'var(--accent-tertiary)', fontSize: '12px' }}>
                  {project.tech.slice(0, 3).join(' • ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailPage({ project, navigate }: { project: ProjectDetail; navigate: (url: string) => void }) {
  return (
    <div className="portfolio">
      {/* Back link */}
      <button onClick={() => navigate('dhruv.dev')} style={{
        background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer',
        fontSize: '14px', padding: 0, marginBottom: '24px', fontFamily: 'inherit'
      }}>
        ← Back to Home
      </button>

      {/* Hero */}
      <div style={{
        padding: '48px 32px', background: project.gradient, borderRadius: '16px',
        marginBottom: '32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{project.icon}</div>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 800, margin: 0 }}>{project.name}</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: '8px 0 0' }}>{project.tagline}</p>
        {project.highlight && (
          <div style={{
            marginTop: '16px', padding: '8px 16px', background: 'rgba(255,158,100,0.2)',
            borderRadius: '8px', display: 'inline-block', color: '#ff9e64', fontSize: '14px', fontWeight: 600
          }}>
            {project.highlight}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <a href={project.live} target="_blank" className="portfolio-btn primary">Live Demo ↗</a>
        <a href={project.github} target="_blank" className="portfolio-btn secondary">GitHub ↗</a>
      </div>

      {/* Description */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--text-bright)', fontSize: '20px', marginBottom: '16px' }}>Overview</h2>
        {project.description.map((para, i) => (
          <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px', fontSize: '14px' }}>{para}</p>
        ))}
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--text-bright)', fontSize: '20px', marginBottom: '16px' }}>Tech Stack</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {project.tech.map(t => (
            <span key={t} style={{
              padding: '6px 14px', background: 'var(--bg-tertiary)', borderRadius: '20px',
              fontSize: '13px', color: 'var(--accent-cyan)', border: '1px solid var(--border-color)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--text-bright)', fontSize: '20px', marginBottom: '16px' }}>Key Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {project.features.map(f => (
            <div key={f} style={{
              padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '10px',
              border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ color: 'var(--accent-tertiary)' }}>◆</span> {f}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function NotFoundPage({ navigate }: { navigate: (url: string) => void }) {
  return (
    <div className="portfolio" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <Search size={64} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
      <h1 style={{ color: 'var(--text-bright)', fontSize: '48px', margin: 0 }}>404</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Page not found</p>
      <button onClick={() => navigate('dhruv.dev')} className="portfolio-btn primary" style={{ marginTop: '24px' }}>
        Go Home
      </button>
    </div>
  );
}

// ─── Main Browser Component ──────────────────────────
export default function Browser() {
  const [url, setUrl] = useState('dhruv.dev');
  const [history, setHistory] = useState<string[]>(['dhruv.dev']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [urlInput, setUrlInput] = useState('dhruv.dev');

  const navigate = useCallback((newUrl: string) => {
    const cleanUrl = newUrl.replace(/^https?:\/\//, '');
    setUrl(cleanUrl);
    setUrlInput(cleanUrl);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(cleanUrl);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setUrlInput(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setUrlInput(history[newIndex]);
    }
  };

  const handleUrlSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(urlInput);
    }
  };

  const renderPage = () => {
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (cleanUrl === 'dhruv.dev') {
      return <HomePage navigate={navigate} />;
    }
    if (cleanUrl === 'dhruv.dev/projects') {
      return <ProjectsPage navigate={navigate} />;
    }
    // Match project detail pages
    const projectMatch = cleanUrl.match(/^dhruv\.dev\/projects\/(.+)$/);
    if (projectMatch) {
      const project = PROJECTS.find(p => p.slug === projectMatch[1]);
      if (project) {
        return <ProjectDetailPage project={project} navigate={navigate} />;
      }
    }
    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="browser-nav">
          <button
            className="browser-nav-btn"
            onClick={goBack}
            disabled={historyIndex <= 0}
            style={{ opacity: historyIndex <= 0 ? 0.4 : 1 }}
          ><ArrowLeft size={14} /></button>
          <button
            className="browser-nav-btn"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            style={{ opacity: historyIndex >= history.length - 1 ? 0.4 : 1 }}
          ><ArrowRight size={14} /></button>
          <button className="browser-nav-btn" onClick={() => navigate(url)}><RotateCw size={14} /></button>
        </div>
        <div className="browser-url-bar">
          <span className="browser-url-lock"><Lock size={12} /></span>
          <input
            type="text"
            className="browser-url-input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleUrlSubmit}
            spellCheck={false}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '12px', flex: 1, outline: 'none',
            }}
          />
        </div>
      </div>

      <div className="browser-content">
        {renderPage()}
      </div>
    </div>
  );
}