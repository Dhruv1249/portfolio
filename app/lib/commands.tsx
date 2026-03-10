// app/lib/commands.tsx

import React from 'react';
import { listDirectory, getNode, FileNode } from './filesystem';

export interface CommandResult {
  output: React.ReactNode;
  newPath?: string;
}

type CommandHandler = (args: string[], currentPath: string, commandHistory?: string[]) => CommandResult;

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
        .oossssso-\`\`\`/ossssss+\`
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
    desc: 'Global Phenology Forecasting Platform',
    details: 'Climate analytics platform integrating NASA MERRA-2, ERA5, iNaturalist, and Köppen data. Three temporal regression models trained for phenological event prediction (~75% accuracy). Dockerized + deployed on Cloud Run.',
    tech: 'Python, XGBoost, Google Maps API, Docker, GCP',
    link: 'https://plant-phenology-state-detector.vercel.app/',
    github: 'https://github.com/Dhruv1249/Plant-Phenology-State-Detector',
  },
  {
    name: 'UrbanSwap',
    desc: 'AI Marketplace Listing Generator',
    details: 'AI-powered assistant automating marketplace listing generation from product images using generative AI. Integrates Next.js + Firebase for auth/tracking.',
    tech: 'Next.js, Firebase, Gemini API',
    link: 'https://ai-marketplace-assistant-162648101104.asia-south1.run.app/',
    github: 'https://github.com/Dhruv1249/ai-marketplace-assistant',
  },
  {
    name: 'PR Tracker',
    desc: 'Developer Collaboration Monitoring Tool',
    details: 'Aggregates pull request data across repos into a centralized dashboard. Tracks review status, merge progress, and repository activity via GitHub API.',
    tech: 'React, Node.js, GitHub API',
    link: 'https://pr-tracker-client.vercel.app/',
    github: 'https://github.com/Dhruv1249/Pr-Tracker',
  },
  {
    name: 'Expense Tracker',
    desc: 'Full-Stack Financial Management',
    details: 'MERN-based app for personal expense tracking with categorization, interactive dashboard, and RESTful API backend.',
    tech: 'React, Node.js, MongoDB, REST API',
    link: 'https://expense-react-client.vercel.app/',
    github: 'https://github.com/Dhruv1249/expense-react-client',
  },
  {
    name: 'LLM Document Parser',
    desc: 'Unstructured Data Pipeline',
    details: 'Enterprise-grade pipeline extracting structured JSON from complex legal/insurance PDFs using semantic chunking.',
    tech: 'Python, LangChain, Pydantic, OCR',
    link: 'https://github.com/Dhruv1249/LLM-Document-Processing-System',
    github: 'https://github.com/Dhruv1249/LLM-Document-Processing-System',
  },
  {
    name: 'Neovim Config',
    desc: 'Personal Development Environment',
    details: 'Byte-compiled Lua config with <20ms startup time. Custom LSP handlers for TypeScript/Rust/Python.',
    tech: 'Lua, Lazy.nvim, Treesitter',
    link: 'https://github.com/Dhruv1249/my-customized-nvim-config',
    github: 'https://github.com/Dhruv1249/my-customized-nvim-config',
  },
];

const FORTUNES = [
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"The best error message is the one that never shows up." — Thomas Fuchs',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"Programs must be written for people to read, and only incidentally for machines to execute." — Abelson & Sussman',
  '"The most dangerous phrase in the language is, \'We\'ve always done it this way.\'" — Grace Hopper',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"It works on my machine." — Every developer ever',
  '"There are only two hard things in CS: cache invalidation and naming things." — Phil Karlton',
  '"The best way to predict the future is to implement it." — David Heinemeier Hansson',
  '"rm -rf / solves all problems, including the ones you didn\'t know you had." — Anonymous',
  '"I don\'t always test my code, but when I do, I do it in production." — The Most Interesting Dev',
];

// Track page load time for uptime command
const PAGE_LOAD_TIME = typeof window !== 'undefined' ? Date.now() : Date.now();

// Helper to build a directory tree view
function buildTree(node: FileNode, prefix: string = '', isLast: boolean = true): string {
  let result = '';
  const connector = isLast ? '└── ' : '├── ';
  const color = node.type === 'directory' ? node.name : node.name;
  result += prefix + connector + color + (node.type === 'directory' ? '/' : '') + '\n';

  if (node.children) {
    const children = node.children;
    children.forEach((child, index) => {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      result += buildTree(child, newPrefix, index === children.length - 1).slice(0); // remove leading newline
    });
  }
  return result;
}

function buildTreeColored(node: FileNode, prefix: string = '', isLast: boolean = true): React.ReactNode[] {
  const lines: React.ReactNode[] = [];
  const connector = isLast ? '└── ' : '├── ';
  const isDir = node.type === 'directory';

  lines.push(
    <div key={prefix + node.name}>
      <span style={{ color: 'var(--text-muted)' }}>{prefix}{connector}</span>
      <span style={{ color: isDir ? 'var(--accent-primary)' : 'var(--text-primary)', fontWeight: isDir ? 600 : 400 }}>
        {node.name}{isDir ? '/' : ''}
      </span>
    </div>
  );

  if (node.children) {
    node.children.forEach((child, index) => {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      lines.push(...buildTreeColored(child, newPrefix, index === node.children!.length - 1));
    });
  }
  return lines;
}

// Recursive search through filesystem
function searchFs(node: FileNode, pattern: string, path: string): { file: string; line: number; text: string }[] {
  const results: { file: string; line: number; text: string }[] = [];
  const regex = new RegExp(pattern, 'gi');

  if (node.type === 'file' && node.content) {
    const lines = node.content.split('\n');
    lines.forEach((line, i) => {
      if (regex.test(line)) {
        results.push({ file: `${path}/${node.name}`, line: i + 1, text: line.trim() });
      }
      regex.lastIndex = 0; // reset for global regex
    });
  }
  if (node.children) {
    node.children.forEach(child => {
      results.push(...searchFs(child, pattern, `${path}/${node.name}`));
    });
  }
  return results;
}

// Man pages
const MAN_PAGES: Record<string, { synopsis: string; description: string }> = {
  ls: { synopsis: 'ls [path]', description: 'List directory contents. Displays files and subdirectories in the specified path.' },
  cd: { synopsis: 'cd [directory]', description: 'Change the current working directory. Use ".." to go up one level, "~" to go home.' },
  cat: { synopsis: 'cat <file>', description: 'Concatenate and display file contents.' },
  tree: { synopsis: 'tree [path]', description: 'Display directory structure as a tree with colored output.' },
  grep: { synopsis: 'grep <pattern> [path]', description: 'Search for a pattern in file contents. Searches recursively through directories.' },
  help: { synopsis: 'help', description: 'Display available commands and their brief descriptions.' },
  projects: { synopsis: 'projects', description: 'Display detailed information about featured projects with tech stacks and links.' },
  experience: { synopsis: 'experience', description: 'Show professional work history and accomplishments.' },
  skills: { synopsis: 'skills', description: 'Display technical stack analysis organized by category.' },
  contact: { synopsis: 'contact', description: 'Show contact information and social links.' },
  about: { synopsis: 'about', description: 'Display personal introduction and background information.' },
  neofetch: { synopsis: 'neofetch', description: 'Display system information with ASCII art.' },
  whoami: { synopsis: 'whoami', description: 'Print the current user name.' },
  hostname: { synopsis: 'hostname', description: 'Print the system hostname.' },
  uname: { synopsis: 'uname [-a]', description: 'Print system information. Use -a for all info.' },
  date: { synopsis: 'date', description: 'Display the current date and time.' },
  uptime: { synopsis: 'uptime', description: 'Show how long the system has been running since page load.' },
  history: { synopsis: 'history', description: 'Display the command history for the current session.' },
  fortune: { synopsis: 'fortune', description: 'Display a random programming wisdom or quote.' },
  curl: { synopsis: 'curl <url>', description: 'Fetch data from a URL. Try: curl dhruv.dev/api' },
  which: { synopsis: 'which <command>', description: 'Locate a command and display its path.' },
  clear: { synopsis: 'clear', description: 'Clear the terminal screen.' },
  pwd: { synopsis: 'pwd', description: 'Print the current working directory.' },
  echo: { synopsis: 'echo <text>', description: 'Display a line of text.' },
  man: { synopsis: 'man <command>', description: 'Display the manual page for a command.' },
  sudo: { synopsis: 'sudo <command>', description: 'Execute a command as superuser. (Just kidding.)' },
};

export const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: (
      <div style={{ lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 600 }}>
          System Commands:
        </div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>ls</span> — List directory</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>cd</span> — Change directory</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>cat</span> — Read file</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>tree</span> — Directory tree view</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>grep</span> — Search file contents</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>pwd</span> — Print working directory</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>echo</span> — Print text</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>clear</span> — Clear terminal</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>history</span> — Command history</div>
        <div><span style={{ color: 'var(--accent-cyan)' }}>man</span> — Manual pages</div>

        <div style={{ marginTop: '12px', color: 'var(--accent-secondary)', fontWeight: 600 }}>
          System Info:
        </div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>neofetch</span> — System info + ASCII</div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>whoami</span> — Current user</div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>hostname</span> — System hostname</div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>uname</span> — System details</div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>date</span> — Current date/time</div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>uptime</span> — Session uptime</div>
        <div><span style={{ color: 'var(--accent-secondary)' }}>which</span> — Locate command</div>

        <div style={{ marginTop: '12px', color: 'var(--accent-tertiary)', fontWeight: 600 }}>
          Portfolio:
        </div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>projects</span> — Detailed project breakdown</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>experience</span> — Professional history</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>skills</span> — Technical stack</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>contact</span> — Connect with me</div>
        <div><span style={{ color: 'var(--accent-tertiary)' }}>about</span> — About me</div>

        <div style={{ marginTop: '12px', color: 'var(--accent-warning)', fontWeight: 600 }}>
          Fun:
        </div>
        <div><span style={{ color: 'var(--accent-warning)' }}>fortune</span> — Random dev wisdom</div>
        <div><span style={{ color: 'var(--accent-warning)' }}>curl</span> — Fetch data (try: curl dhruv.dev/api)</div>
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
            <span className="neofetch-value">Full Stack · DevOps · ML</span>
          </div>
          <div className="neofetch-row">
            <span className="neofetch-label">Focus</span>
            <span className="neofetch-value">AI-Native Web Systems</span>
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
      if (!node) return { output: <span style={{ color: 'var(--accent-error)' }}>ls: cannot access &apos;{args[0]}&apos;: No such file or directory</span> };
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
    if (target === '-') {
      return { output: '', newPath: '~' };
    }
    const newPath = target === '~' ? '~' : (currentPath === '~' ? `~/${target}` : `${currentPath}/${target}`);
    const node = getNode(newPath);
    if (!node || node.type !== 'directory') return { output: <span style={{ color: 'var(--accent-error)' }}>cd: no such directory: {target}</span> };
    return { output: '', newPath };
  },

  cat: (args, currentPath) => {
    if (!args[0]) return { output: <span style={{ color: 'var(--accent-error)' }}>cat: missing operand</span> };
    const filePath = currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`;
    const node = getNode(filePath);
    if (!node || node.type !== 'file') return { output: <span style={{ color: 'var(--accent-error)' }}>cat: {args[0]}: No such file</span> };
    return { output: <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>{node.content}</pre> };
  },

  tree: (args, currentPath) => {
    const targetPath = args[0] ? (currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`) : currentPath;
    const node = getNode(targetPath);
    if (!node || node.type !== 'directory') {
      return { output: <span style={{ color: 'var(--accent-error)' }}>tree: &apos;{args[0] || targetPath}&apos;: Not a directory</span> };
    }

    const displayName = targetPath === '~' ? '~' : targetPath.split('/').pop() || targetPath;
    const childLines = node.children
      ? node.children.flatMap((child, i) => buildTreeColored(child, '', i === node.children!.length - 1))
      : [];

    const dirCount = (function countDirs(n: FileNode): number {
      if (n.type !== 'directory' || !n.children) return 0;
      return n.children.reduce((sum, c) => sum + (c.type === 'directory' ? 1 + countDirs(c) : 0), 0);
    })(node);
    const fileCount = (function countFiles(n: FileNode): number {
      if (n.type !== 'directory' || !n.children) return 0;
      return n.children.reduce((sum, c) => sum + (c.type === 'file' ? 1 : countFiles(c)), 0);
    })(node);

    return {
      output: (
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{displayName}/</div>
          {childLines}
          <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {dirCount} directories, {fileCount} files
          </div>
        </div>
      ),
    };
  },

  grep: (args, currentPath) => {
    if (!args[0]) return { output: <span style={{ color: 'var(--accent-error)' }}>grep: missing pattern</span> };
    const pattern = args[0];
    const searchPath = args[1] ? (currentPath === '~' ? `~/${args[1]}` : `${currentPath}/${args[1]}`) : currentPath;
    const node = getNode(searchPath);
    if (!node) return { output: <span style={{ color: 'var(--accent-error)' }}>grep: {args[1] || searchPath}: No such file or directory</span> };

    const parentPath = searchPath.split('/').slice(0, -1).join('/') || '~';
    const results = node.type === 'file' && node.content
      ? node.content.split('\n').filter(line => new RegExp(pattern, 'i').test(line)).map((line, i) => ({ file: searchPath, line: i + 1, text: line.trim() }))
      : searchFs(node, pattern, parentPath);

    if (results.length === 0) {
      return { output: <span style={{ color: 'var(--text-muted)' }}>(no matches found)</span> };
    }

    return {
      output: (
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          {results.slice(0, 20).map((r, i) => (
            <div key={i}>
              <span style={{ color: 'var(--accent-primary)' }}>{r.file.replace(/^~\//, '')}</span>
              <span style={{ color: 'var(--text-muted)' }}>:{r.line}:</span>
              <span>{r.text.substring(0, 100)}</span>
            </div>
          ))}
          {results.length > 20 && (
            <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>... and {results.length - 20} more matches</div>
          )}
        </div>
      ),
    };
  },

  about: () => ({
    output: (
      <div style={{ lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
          👋 Hey, I&apos;m Dhruv!
        </div>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ color: 'var(--accent-tertiary)' }}>Full-Stack Developer</span> •{' '}
          <span style={{ color: 'var(--accent-tertiary)' }}>DevOps Enthusiast</span> •{' '}
          <span style={{ color: 'var(--accent-tertiary)' }}>Machine Learning Engineer</span>
        </div>
        <div style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>
          I build intelligent, scalable systems by combining modern web technologies,
          machine learning models, and cloud infrastructure. My work spans full-stack platforms,
          data pipelines, and AI-driven applications deployed using containerized environments.
        </div>
        <div style={{ marginBottom: '12px' }}>
          Currently completing B.Tech at <span style={{ color: 'var(--accent-cyan)' }}>LPU</span> (8.72 CGPA).
        </div>
        <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-warning)' }}>
          🏆 <span style={{ color: 'var(--accent-warning)' }}>NASA Space Apps 2025 — Global Honorable Mention</span>
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Recognized among top teams worldwide from 11,500+ submissions for CALYX</span>
        </div>
        <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
          🥇 <span style={{ color: 'var(--accent-cyan)' }}>Innov-a-thon — National Top 100</span>
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>NIT Rourkela national competition</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '15px' }}>{project.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>— {project.tech}</span>
            </div>
            <div style={{ color: 'var(--text-primary)', marginTop: '4px', fontStyle: 'italic' }}>{project.desc}</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px', lineHeight: 1.6 }}>{project.details}</div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '16px' }}>
              <a href={project.link} target="_blank" style={{ color: 'var(--accent-primary)', fontSize: '12px', textDecoration: 'underline' }}>Live →</a>
              <a href={project.github} target="_blank" style={{ color: 'var(--accent-secondary)', fontSize: '12px', textDecoration: 'underline' }}>GitHub →</a>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '16px' }}>
                Freelance Full-Stack Developer
              </div>
              <div style={{ color: 'var(--accent-cyan)' }}>Remote</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nov 2025 – Present</span>
          </div>
          <ul style={{ color: 'var(--text-secondary)', margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Performance Engineering:</strong> Built responsive client websites with Next.js + Tailwind CSS. Achieved <span style={{ color: 'var(--accent-tertiary)' }}>99/100 Core Web Vitals</span>.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Backend Automation:</strong> Integrated NodeMailer + Firebase for automated enquiry systems and centralized lead management pipelines.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>SEO Strategy:</strong> Implemented structured JSON-LD schemas and semantic HTML5, driving 40% increase in organic traffic.
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
            <div style={{ color: 'var(--text-secondary)' }}>Python, TypeScript, JavaScript, C, C++, HTML, CSS</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>FRONTEND</div>
            <div style={{ color: 'var(--text-secondary)' }}>React, Next.js, Tailwind CSS</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>BACKEND</div>
            <div style={{ color: 'var(--text-secondary)' }}>Node.js, FastAPI, REST APIs</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>DATA & ML</div>
            <div style={{ color: 'var(--text-secondary)' }}>Regression Models, Time-Series, Pandas, XGBoost</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>CLOUD & DEVOPS</div>
            <div style={{ color: 'var(--text-secondary)' }}>Docker, Google Cloud Platform, Firebase, Git</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '13px' }}>AI & TOOLS</div>
            <div style={{ color: 'var(--text-secondary)' }}>LangChain, Google Gemini API, Pydantic</div>
          </div>
        </div>
      </div>
    ),
  }),

  contact: () => ({
    output: (
      <div style={{ lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '12px' }}>
          📬 Let&apos;s Build Something:
        </div>
        <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> dhruv1249.lm@gmail.com</div>
        <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> +91 7876503573</div>
        <div><span style={{ color: 'var(--text-muted)' }}>GitHub:</span> <a href="https://github.com/Dhruv1249" target="_blank" style={{ color: 'var(--accent-cyan)' }}>github.com/Dhruv1249</a></div>
        <div><span style={{ color: 'var(--text-muted)' }}>LinkedIn:</span> <a href="https://linkedin.com/in/dhruv124" target="_blank" style={{ color: 'var(--accent-cyan)' }}>linkedin.com/in/dhruv124</a></div>
        <div style={{ marginTop: '12px', color: 'var(--accent-warning)', fontStyle: 'italic' }}>
          &quot;Available for immediate joining.&quot;
        </div>
      </div>
    ),
  }),

  // === New commands ===

  whoami: () => ({ output: 'dhruv' }),

  hostname: () => ({ output: 'portfolio-os' }),

  uname: (args) => {
    if (args.includes('-a')) {
      return { output: 'Linux portfolio-os 6.12.1-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' };
    }
    return { output: 'Linux' };
  },

  date: () => {
    const now = new Date();
    return { output: now.toString() };
  },

  uptime: () => {
    const elapsed = Date.now() - PAGE_LOAD_TIME;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const timeStr = hours > 0
      ? `${hours}h ${minutes % 60}m ${seconds % 60}s`
      : minutes > 0
        ? `${minutes}m ${seconds % 60}s`
        : `${seconds}s`;
    return {
      output: (
        <span>
          up {timeStr}, 1 user, load average: 0.42, 0.31, 0.27
        </span>
      ),
    };
  },

  history: (_args, _currentPath, commandHistory) => {
    if (!commandHistory || commandHistory.length === 0) {
      return { output: <span style={{ color: 'var(--text-muted)' }}>(no history yet)</span> };
    }
    return {
      output: (
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          {commandHistory.map((cmd, i) => (
            <div key={i}>
              <span style={{ color: 'var(--text-muted)', display: 'inline-block', width: '40px', textAlign: 'right', marginRight: '12px' }}>{i + 1}</span>
              {cmd}
            </div>
          ))}
        </div>
      ),
    };
  },

  fortune: () => {
    const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return {
      output: (
        <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
          {quote}
        </div>
      ),
    };
  },

  curl: (args) => {
    const url = args[0] || '';
    if (url.includes('dhruv.dev/api') || url.includes('dhruv.dev')) {
      const jsonData = {
        name: 'Dhruv',
        role: 'Full-Stack Developer | DevOps | ML Engineer',
        education: 'B.Tech CSE @ LPU (CGPA: 8.72)',
        achievements: ['NASA Space Apps 2025 — Global Honorable Mention', 'Innov-a-thon NIT Rourkela — National Top 100'],
        skills: { languages: ['Python', 'TypeScript', 'JavaScript', 'C++'], frameworks: ['React', 'Next.js', 'FastAPI', 'Node.js'], cloud: ['Docker', 'GCP', 'Firebase'] },
        contact: { email: 'dhruv1249.lm@gmail.com', github: 'github.com/Dhruv1249' },
        status: 'Available for hire',
      };
      return {
        output: (
          <div>
            <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
              HTTP/1.1 200 OK
              <br />
              Content-Type: application/json
            </div>
            <pre style={{ margin: 0, color: 'var(--accent-tertiary)', fontFamily: 'var(--font-mono)' }}>
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        ),
      };
    }
    return { output: <span style={{ color: 'var(--accent-error)' }}>curl: (6) Could not resolve host: {url || '(empty)'}</span> };
  },

  which: (args) => {
    if (!args[0]) return { output: <span style={{ color: 'var(--accent-error)' }}>which: missing argument</span> };
    const cmd = args[0].toLowerCase();
    if (commands[cmd] || cmd === 'sudo') {
      return { output: `/usr/bin/${cmd}` };
    }
    return { output: <span style={{ color: 'var(--accent-error)' }}>which: no {cmd} in (/usr/local/bin:/usr/bin:/bin)</span> };
  },

  man: (args) => {
    if (!args[0]) return { output: <span style={{ color: 'var(--accent-error)' }}>What manual page do you want?</span> };
    const cmd = args[0].toLowerCase();
    const page = MAN_PAGES[cmd];
    if (!page) return { output: <span style={{ color: 'var(--accent-error)' }}>No manual entry for {cmd}</span> };
    return {
      output: (
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '12px' }}>
            {cmd.toUpperCase()}(1) — User Commands
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>NAME</span>
            <div style={{ paddingLeft: '16px' }}>{cmd} — {page.description.split('.')[0].toLowerCase()}</div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>SYNOPSIS</span>
            <div style={{ paddingLeft: '16px' }}>{page.synopsis}</div>
          </div>
          <div>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>DESCRIPTION</span>
            <div style={{ paddingLeft: '16px', lineHeight: 1.6 }}>{page.description}</div>
          </div>
        </div>
      ),
    };
  },

  sudo: (args) => {
    const fullCmd = args.join(' ');
    if (fullCmd.includes('rm') && (fullCmd.includes('-rf') || fullCmd.includes('-fr')) && fullCmd.includes('/')) {
      return {
        output: (
          <div>
            <pre style={{ color: 'var(--accent-error)', margin: 0, fontFamily: 'var(--font-mono)' }}>{`
  ┌─────────────────────────────────────────┐
  │                                         │
  │   Nice try. 😈                          │
  │                                         │
  │   This is a portfolio, not a server.    │
  │   But I appreciate the audacity.        │
  │                                         │
  │   Incident reported to /dev/null.       │
  │                                         │
  └─────────────────────────────────────────┘`}</pre>
          </div>
        ),
      };
    }
    return {
      output: (
        <span style={{ color: 'var(--accent-warning)' }}>
          [sudo] password for dhruv: 🔒 Sorry, sudo is not available in this simulated environment.
        </span>
      ),
    };
  },

  clear: () => ({ output: '__CLEAR__' }),
  pwd: (_args, currentPath) => ({ output: currentPath.replace('~', '/home/dhruv') }),
  echo: (args) => ({ output: args.join(' ') }),
};

// Export command names for tab completion
export const commandNames = Object.keys(commands);

export function executeCommand(input: string, currentPath: string, commandHistory?: string[]): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const handler = commands[cmd];
  if (!handler) {
    return {
      output: (
        <span style={{ color: 'var(--accent-error)' }}>
          Command not found: {cmd}. Type <span style={{ color: 'var(--accent-cyan)' }}>help</span> for available commands.
        </span>
      ),
    };
  }
  return handler(args, currentPath, commandHistory);
}