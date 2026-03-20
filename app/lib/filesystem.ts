// app/lib/filesystem.ts

import { REPOS, fetchRepoTree, fetchFileContent, RepoFile } from './github';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  isSubmodule?: boolean;
  content?: string;
  children?: FileNode[];
  repoOwner?: string;
  repoName?: string;
  repoPath?: string;
}

function mapRepoToNode(files: RepoFile[], owner: string, repo: string): FileNode[] {
  return files.map(f => ({
    name: f.name,
    type: f.type,
    isSubmodule: f.isSubmodule,
    repoOwner: f.isSubmodule && f.submoduleOwner ? f.submoduleOwner : owner,
    repoName: f.isSubmodule && f.submoduleRepo ? f.submoduleRepo : repo,
    repoPath: f.path,
    children: f.children ? mapRepoToNode(f.children, owner, repo) : undefined
  }));
}

export const fileSystem: FileNode = {
  name: '~',
  type: 'directory',
  children: [
    {
      name: 'projects',
      type: 'directory',
      children: [
        { name: 'README.md', type: 'file', content: '# Projects Directory\\n\\nNavigate into any of these project folders (e.g. `cd calyx`) to explore the actual source code streamed live from GitHub!' },
        ...REPOS.map(repo => ({
          name: repo.repo.toLowerCase(),
          type: 'directory' as const,
          repoOwner: repo.owner,
          repoName: repo.repo,
        }))
      ],
    },
    {
      name: 'documents',
      type: 'directory',
      children: [
        { name: 'resume.pdf', type: 'file', content: `[Binary PDF Graphic Data]\n\nTry running "resume" to view this interactive document.` },
        { name: 'resume.txt', type: 'file', content: `DHRUV\nFull Stack Engineer | NASA Space Apps Winner\n+91 7876503573 | dhr1249.lm@gmail.com\n\nPROFESSIONAL SUMMARY\nData-driven Full Stack Engineer with a strong foundation in Cloud Architecture (GCP) and Generative AI. Proven track record of shipping production web apps and solving complex data problems (NASA Space Apps Winner). Expert in Next.js ecosystems and Python backend services.\n\nEXPERIENCE\n------------------------------------------------------------\nFreelance Full Stack Developer (Remote) | Nov 2025 - Present\n------------------------------------------------------------\n* Developed responsive client websites focusing on UI/UX, mobile-first layouts, and performance optimization.\n* Built front-end systems using Next.js, Tailwind CSS, and semantic HTML/CSS with clean component architecture.\n* Automated enquiry workflows using NodeMailer and integrated Firebase with Google Sheets API for centralized lead management.\n* Implemented structured JSON-LD schemas and semantic HTML5, driving 40% increase in organic search traffic.\n* Managed end-to-end project delivery from requirement gathering through deployment, using Git-based workflows and CI/CD pipelines.\n\nEDUCATION\n------------------------------------------------------------\nLovely Professional University (2023 - Present)\nB.Tech in Computer Science & Engineering | CGPA: 8.66\n* **Coursework**: Data Structures, Algorithms, OS, DBMS, Cloud Computing (NPTEL), LLMs (NPTEL).\n\nG.A.V Sr. Sec. School, Kangra, Himachal Pradesh\nIntermediate | Percentage: 83% | Apr 2022 – Mar 2023\n\nM.V.M Public High School, Kangra, Himachal Pradesh\nMatriculation | Percentage: 96% | Apr 2020 – Mar 2021\n\nCERTIFICATIONS\n------------------------------------------------------------\n* **Cloud Computing (NPTEL)**: https://drive.google.com/file/d/1oC01o8KJWbJgoAvF1imNXfG5KLEQgu9r/view?usp=sharing\n* **Large Language Models (NPTEL)**: https://drive.google.com/file/d/1Ypk5IU8V_YzrDsZ1wsVm00OnfqWnwZol/view?usp=sharing\n\nTECHNICAL SKILLS\n------------------------------------------------------------\n* **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Framer Motion\n* **Backend**: Node.js, Python (FastAPI), Firebase, PostgreSQL\n* **Data/AI**: XGBoost, Pandas, Google Gemini API, LangChain\n* **DevOps**: Docker, Google Cloud Run, Git, Linux (Arch)` },
      ],
    },
    {
      name: '.config',
      type: 'directory',
      children: [
        {
          name: 'nvim',
          type: 'directory',
          children: [
             { name: 'init.lua', type: 'file', content: `-- This is a simulation! \n-- To see the real engineered config, check the repo:\n-- https://github.com/Dhruv1249/my-customized-nvim-config` },
          ]
        }
      ]
    },
    { name: 'README.md', type: 'file', content: `# Welcome to Dhruv's Portfolio OS 👋\n\n> **System Status**: All Systems Operational\n> **Kernel**: Linux 6.x (Simulated)\n\nI created this interactive terminal portfolio to demonstrate my love for **systems engineering** and **clean UI**. \n\n## How to navigate?\n- Use \`ls\` to see files.\n- Use \`cd projects\` to go into the projects folder.\n- Use \`cat calyx/README.md\` to read about my NASA project.\n- Or just type \`projects\` for a quick summary!\n\n## Why "Portfolio OS"?\nBecause static websites are boring. I wanted to build something that feels "alive" and respects the developer workflow.` },
  ],
};

export async function getNode(path: string): Promise<FileNode | null> {
  if (path === '~' || path === '') return fileSystem;
  
  const parts = path.replace('~/', '').split('/').filter(Boolean);
  let current: FileNode | null = fileSystem;

  for (const part of parts) {
    if (!current || current.type !== 'directory') return null;

    if (current.repoOwner && current.repoName && !current.children) {
      const tree = await fetchRepoTree(current.repoOwner, current.repoName);
      current.children = mapRepoToNode(tree, current.repoOwner, current.repoName);
    }
    
    if (!current.children) return null;
    current = current.children.find(child => child.name === part) || null;
  }

  if (current?.type === 'directory' && current.repoOwner && current.repoName && !current.children) {
      const tree = await fetchRepoTree(current.repoOwner, current.repoName);
      current.children = mapRepoToNode(tree, current.repoOwner, current.repoName);
  }

  if (current?.type === 'file' && current.repoOwner && current.repoName && current.repoPath && (current.content === undefined)) {
      const res = await fetchFileContent(current.repoOwner, current.repoName, current.repoPath);
      current.content = res.content || '(empty fetch)';
  }

  return current;
}

export async function listDirectory(path: string): Promise<FileNode[]> {
  const node = await getNode(path);
  if (!node || node.type !== 'directory' || !node.children) {
    return [];
  }
  return node.children;
}