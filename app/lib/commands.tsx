// app/lib/commands.tsx

import React from 'react';
import { listDirectory, getNode, FileNode } from './filesystem';

export interface CommandResult {
  output: React.ReactNode;
  newPath?: string;
}

type CommandHandler = (args: string[], currentPath: string) => CommandResult;

// ... (Keep ASCII Art logic same) ...
const ARCH_ASCII = `                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \``;

const PROJECTS = [
  { 
    name: 'CALYX (NASA Space Apps)', 
    desc: 'Ecological Forecasting Engine',
    details: 'Processed 10TB+ of MERRA-2/ERA-5 climate data to predict plant phenology. Won Global Honorable Mention (Top 23/11,500).', 
    tech: 'Python, XGBoost, Google Maps API, Docker',
    link: 'https://plant-phenology-state-detector.vercel.app/'
  },
  { 
    name: 'UrbanSwap', 
    desc: 'Generative AI Commerce Platform',
    details: 'A "Text-to-Storefront" engine. Uses Google Gemini Vision API to convert product photos into deployed Next.js websites.',
    tech: 'Next.js, Firebase (Auth/Firestore), Gemini API',
    link: 'https://ai-marketplace-assistant-162648101104.asia-south1.run.app/'
  },
  { 
    name: 'LLM Document Parser', 
    desc: 'Unstructured Data Pipeline',
    details: 'Enterprise-grade pipeline extracting structured JSON from complex legal/insurance PDFs using semantic chunking.', 
    tech: 'Python, LangChain, Pydantic, OCR',
    link: 'https://github.com/Dhruv1249/LLM-Document-Processing-System'
  },
  { 
    name: 'Neovim Config', 
    desc: 'Personal Development Environment',
    details: 'Byte-compiled Lua config with <20ms startup time. Custom LSP handlers for TypeScript/Rust/Python.', 
    tech: 'Lua, Lazy.nvim, Treesitter',
    link: 'https://github.com/Dhruv1249/my-customized-nvim-config'
  },
];

export const commands: Record<string, CommandHandler> = {
  // ... (Keep Help/Neovim/LS/CD/CAT same) ...
  help: () => ({
    output: (
      <div style={{ lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 600 }}>
          System Commands:
        </div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>ls</span> — List directory</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>cd</span> — Change directory</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>cat</span> — Read file</div>
        
        <div style={{ marginTop: '12px', color: 'var(--accent-tertiary)', fontWeight: 600 }}>
          Dhruv CLI Tools:
        </div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>projects</span> — Detailed project breakdown</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>experience</span> — Professional history</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>skills</span> — Technical stack analysis</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>contact</span> — Connect with me</div>
      </div>
    ),
  }),
  
  neofetch: () => ({
    output: (
      <div className="neofetch">
        <pre className="neofetch-ascii">{ARCH_ASCII}</pre>
        <div className="neofetch-info">
          <div className="neofetch-title">dhruv@portfolio</div>
          <div className="neofetch-separator">───────────────────</div>
          <div className="neofetch-row">
            <span className="neofetch-label">Host</span>
            <span className="neofetch-value">NASA Winner Workstation</span>
          </div>
          <div className="neofetch-row">
            <span className="neofetch-label">Kernel</span>
            <span className="neofetch-value">Engineering Mindset v1.0</span>
          </div>
          <div className="neofetch-row">
            <span className="neofetch-label">Uptime</span>
            <span className="neofetch-value">∞ (High Availability)</span>
          </div>
          <div className="neofetch-row">
            <span className="neofetch-label">Role</span>
            <span className="neofetch-value">Full Stack Engineer</span>
          </div>
           <div className="neofetch-row">
            <span className="neofetch-label">Focus</span>
            <span className="neofetch-value">AI-Native Web Apps</span>
          </div>
          <div className="neofetch-colors">
            {['#f7768e', '#ff9e64', '#e0af68', '#9ece6a', '#73daca', '#7dcfff', '#7aa2f7', '#bb9af7'].map((color, i) => (
              <div key={i} className="neofetch-color" style={{ background: color }} />
            ))}
          </div>
        </div>
      </div>
    ),
  }),
  
  ls: (args, currentPath) => {
    const targetPath = args[0] ? `${currentPath}/${args[0]}`.replace('~/', '') : currentPath;
    const contents = listDirectory(targetPath);
    if (contents.length === 0) {
      const node = getNode(targetPath);
      if (!node) return { output: <span style={{ color: 'var(--accent-error)' }}>ls: cannot access '{args[0]}': No such file</span> };
      return { output: '' };
    }
    return {
      output: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {contents.map((item, i) => (
            <span key={i} style={{ 
              color: item.type === 'directory' ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontWeight: item.type === 'directory' ? 600 : 400 
            }}>
              {item.name}{item.type === 'directory' ? '/' : ''}
            </span>
          ))}
        </div>
      ),
    };
  },

  cd: (args, currentPath) => {
    const target = args[0] || '~';
    if (target === '..') {
      const parts = currentPath === '~' ? ['~'] : currentPath.split('/');
      return { output: '', newPath: parts.slice(0, -1).join('/') || '~' };
    }
    const newPath = target === '~' ? '~' : (currentPath === '~' ? `~/${target}` : `${currentPath}/${target}`);
    const node = getNode(newPath);
    if (!node || node.type !== 'directory') return { output: <span style={{ color: 'var(--accent-error)' }}>cd: no such directory: {target}</span> };
    return { output: '', newPath };
  },

  cat: (args, currentPath) => {
    const filePath = currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`;
    const node = getNode(filePath);
    if (!node || node.type !== 'file') return { output: <span style={{ color: 'var(--accent-error)' }}>cat: {args[0]}: No such file</span> };
    return { output: <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>{node.content}</pre> };
  },

  about: () => ({
    output: (
      <div style={{ lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
          👋 Hey, I'm Dhruv!
        </div>
        <div style={{ marginBottom: '12px' }}>
          I'm a <span style={{ color: 'var(--accent-tertiary)' }}>Full Stack Engineer</span> who treats infrastructure as code and UI as art.
          I specialize in building **Data-Intensive Applications** that are fast, accessible, and resilient.
        </div>
         <div style={{ marginBottom: '12px' }}>
          Currently completing my B.Tech at <span style={{ color: 'var(--accent-cyan)' }}>LPU</span> (8.72 CGPA).
        </div>
        <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-warning)' }}>
          🏆 <span style={{ color: 'var(--accent-warning)' }}>NASA Space Apps 2025 Winner</span>
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Global Honorable Mention (Top 0.2%) for CALYX</span>
        </div>
      </div>
    ),
  }),

  projects: () => ({
    output: (
      <div>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '16px' }}>
          🚀 Featured Projects:
        </div>
        {PROJECTS.map((project, i) => (
          <div key={i} style={{ marginBottom: '24px', paddingLeft: '16px', borderLeft: '2px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '15px' }}>{project.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>— {project.tech}</span>
            </div>
            <div style={{ color: 'var(--text-primary)', marginTop: '4px', fontStyle: 'italic' }}>{project.desc}</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px', lineHeight: 1.6 }}>{project.details}</div>
            <div style={{ marginTop: '8px' }}>
              <a href={project.link} target="_blank" style={{ color: 'var(--accent-primary)', fontSize: '12px', textDecoration: 'underline' }}>View Project →</a>
            </div>
          </div>
        ))}
      </div>
    ),
  }),

  experience: () => ({
    output: (
      <div>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '12px' }}>
          💼 Professional History:
        </div>
        <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '16px' }}>
                Contract Full Stack Engineer
              </div>
              <div style={{ color: 'var(--accent-cyan)' }}>Remote</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nov 2025 – Present</span>
          </div>
          <ul style={{ color: 'var(--text-secondary)', margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
             <li>
                <strong style={{ color: 'var(--text-primary)' }}>Performance Engineering:</strong> Delivered <em>varanasitoursindia.com</em> using Next.js 14. 
                Optimized LCP/CLS to achieve <span style={{ color: 'var(--accent-tertiary)' }}>99/100 Core Web Vitals</span>.
             </li>
            <li>
               <strong style={{ color: 'var(--text-primary)' }}>Backend Automation:</strong> Built a Node.js/Gmail API microservice that intercepts booking emails and auto-generates database entries, cutting admin time by <span style={{ color: 'var(--accent-tertiary)' }}>100%</span>.
            </li>
            <li>
               <strong style={{ color: 'var(--text-primary)' }}>SEO Strategy:</strong> Implemented structured JSON-LD schemas and semantic HTML5, driving a 40% increase in organic traffic.
            </li>
          </ul>
        </div>
      </div>
    ),
  }),

  skills: () => ({
    output: (
       <div>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '12px' }}>
          🛠️ Technical Stack:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>LANGUAGES</div>
            <div style={{ color: 'var(--text-secondary)' }}>TypeScript, Python, JavaScript (ES6+), C++, Lua</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>FRAMEWORKS</div>
            <div style={{ color: 'var(--text-secondary)' }}>Next.js 14, React 19, FastAPI, Tailwind CSS</div>
          </div>
           <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>DATA & AI</div>
            <div style={{ color: 'var(--text-secondary)' }}>XGBoost, Pandas, LangChain, Google Gemini API</div>
          </div>
           <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>CLOUD & DEVOPS</div>
            <div style={{ color: 'var(--text-secondary)' }}>Docker, Google Cloud Run, Firebase, Git</div>
          </div>
        </div>
      </div>
    )
  }),

  contact: () => ({
    output: (
      <div style={{ lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '12px' }}>
          📬 Let's Build Something:
        </div>
        <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> dhr1249.lm@gmail.com</div>
        <div><span style={{ color: 'var(--text-muted)' }}>GitHub:</span> github.com/Dhruv1249</div>
        <div><span style={{ color: 'var(--text-muted)' }}>LinkedIn:</span> linkedin.com/in/dhruv124</div>
        <div style={{ marginTop: '12px', color: 'var(--accent-warning)', fontStyle: 'italic' }}>
          "Available for immediate joining."
        </div>
      </div>
    ),
  }),

  clear: () => ({ output: '__CLEAR__' }),
  pwd: (_args, currentPath) => ({ output: currentPath.replace('~', '/home/dhruv') }),
  echo: (args) => ({ output: args.join(' ') }),
};

export function executeCommand(input: string, currentPath: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const handler = commands[cmd];
  if (!handler) return { output: <span style={{ color: 'var(--accent-error)' }}>Command not found: {cmd}</span> };
  return handler(args, currentPath);
}