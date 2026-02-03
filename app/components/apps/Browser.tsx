// app/components/apps/Browser.tsx
'use client';
import React from 'react';

export default function Browser() {
  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="browser-nav">
          <button className="browser-nav-btn">←</button>
          <button className="browser-nav-btn">→</button>
          <button className="browser-nav-btn">↻</button>
        </div>
        <div className="browser-url-bar">
          <span className="browser-url-lock">🔒</span>
          <span className="browser-url-text">https://dhruv.dev</span>
        </div>
      </div>

      <div className="browser-content">
        <div className="portfolio">
          {/* Status Badge */}
          <div className="portfolio-badge">
            <span style={{ color: '#4ade80' }}>●</span> AVAILABLE FOR ROLES
          </div>

          {/* Hero */}
          <h1 className="portfolio-title">
            Engineering <span className="highlight">Intelligent</span><br />
            Web Systems.
          </h1>

          <p className="portfolio-subtitle">
            I am a **Full Stack Engineer** and **NASA Space Apps Winner** specializing in complex data visualization and Generative AI pipelines. I don't just build websites; I build systems that process data.
          </p>

          <div className="portfolio-buttons">
            <a href="#projects" className="portfolio-btn primary">View Case Studies</a>
            <a href="mailto:dhr1249.lm@gmail.com" className="portfolio-btn secondary">Hire Me</a>
          </div>

          {/* NASA Badge */}
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(122, 162, 247, 0.1), rgba(187, 154, 247, 0.05))',
            borderRadius: '16px',
            border: '1px solid rgba(122, 162, 247, 0.2)',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ fontSize: '42px' }}>🏆</div>
            <div>
              <div style={{ color: 'var(--accent-warning)', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
                NASA Space Apps Challenge 2025
              </div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                Global Honorable Mention (Top 23 Worldwide)
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                Selected from 11,500+ submissions for <strong>CALYX</strong> — an ecological forecasting engine processing 10TB+ of NASA climate data.
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <section className="portfolio-section" id="projects">
            <h2 className="portfolio-section-title">Selected Case Studies</h2>
            <div className="projects-grid">
              
              {/* CALYX */}
              <a href="https://plant-phenology-state-detector.vercel.app/" target="_blank" className="project-card" style={{ textDecoration: 'none' }}>
                <div className="project-image" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                  <span style={{ fontSize: '48px' }}>🌍</span>
                </div>
                <div className="project-info">
                  <div className="project-name">CALYX (NASA Winner)</div>
                  <div className="project-desc">
                    Ecological forecasting engine.
                    <br/>
                    <span style={{color: 'var(--accent-tertiary)', fontSize: '12px'}}>XGBoost • Python • Google Maps API</span>
                  </div>
                </div>
              </a>

              {/* UrbanSwap */}
              <a href="https://ai-marketplace-assistant-162648101104.asia-south1.run.app/" target="_blank" className="project-card" style={{ textDecoration: 'none' }}>
                <div className="project-image" style={{ background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)' }}>
                  <span style={{ fontSize: '36px' }}>🤖</span>
                </div>
                <div className="project-info">
                  <div className="project-name">UrbanSwap</div>
                  <div className="project-desc">
                    Generative UI Commerce Platform.
                    <br/>
                    <span style={{color: 'var(--accent-tertiary)', fontSize: '12px'}}>Gemini Vision API • Next.js • Firebase</span>
                  </div>
                </div>
              </a>

              {/* LLM Parser */}
              <a href="https://github.com/Dhruv1249/LLM-Document-Processing-System" target="_blank" className="project-card" style={{ textDecoration: 'none' }}>
                <div className="project-image" style={{ background: 'linear-gradient(135deg, #171717 0%, #262626 100%)' }}>
                  <span style={{ fontSize: '36px' }}>📄</span>
                </div>
                <div className="project-info">
                  <div className="project-name">LLM Data Pipeline</div>
                  <div className="project-desc">
                    Unstructured Doc to JSON converter.
                    <br/>
                    <span style={{color: 'var(--accent-tertiary)', fontSize: '12px'}}>Python • LangChain • Pydantic</span>
                  </div>
                </div>
              </a>

              {/* Neovim */}
              <a href="https://github.com/Dhruv1249/my-customized-nvim-config" target="_blank" className="project-card" style={{ textDecoration: 'none' }}>
                <div className="project-image" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
                  <span style={{ fontSize: '36px' }}>⚡</span>
                </div>
                <div className="project-info">
                  <div className="project-name">Neovim Config</div>
                  <div className="project-desc">
                    Lua-based PDE with custom LSP integration.
                    <br/>
                    <span style={{color: 'var(--accent-tertiary)', fontSize: '12px'}}>Lua • Lazy.nvim • Treesitter</span>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Work Experience */}
          <section className="portfolio-section">
            <h2 className="portfolio-section-title">Professional Experience</h2>
            <div style={{ marginTop: '16px', padding: '24px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-bright)', fontWeight: 700, fontSize: '18px' }}>
                    Contract Full Stack Engineer
                  </div>
                  <div style={{ color: 'var(--accent-cyan)', marginTop: '4px' }}>Remote • Self-Employed</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px', background: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: '4px' }}>Nov 2025 – Present</span>
              </div>
              <ul style={{ color: 'var(--text-secondary)', margin: 0, paddingLeft: '20px', lineHeight: 1.8, fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Legacy Migration:</strong> Rebuilt <em>varanasitoursindia.com</em> from PHP to <strong>Next.js 14</strong>, achieving a <strong style={{color: 'var(--accent-tertiary)'}}>99 Performance Score</strong> on Core Web Vitals.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Process Automation:</strong> Engineered a background worker using <strong>Gmail API</strong> to intercept booking inquiries and auto-sync them to the admin dashboard, reducing data entry time by <strong>100%</strong>.
                </li>
                <li>
                  <strong>SEO Engineering:</strong> Deployed semantic HTML5 and JSON-LD schemas, resulting in a <strong>40% organic traffic increase</strong> within 3 months.
                </li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            <p>Designed & Engineered by Dhruv</p>
            <p style={{ marginTop: '8px', opacity: 0.6 }}>Built with Next.js 14, React 19, and TypeScript</p>
          </footer>
        </div>
      </div>
    </div>
  );
}