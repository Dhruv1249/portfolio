// app/lib/filesystem.ts

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

export const fileSystem: FileNode = {
  name: '~',
  type: 'directory',
  children: [
    {
      name: 'projects',
      type: 'directory',
      children: [
        {
          name: 'calyx',
          type: 'directory',
          children: [
            { name: 'README.md', type: 'file', content: `# CALYX 🌍
## Ecological Forecasting Engine via NASA Earth Data

> 🏆 **NASA Space Apps 2025 Global Honorable Mention**
> Top 23 projects worldwide selected from 11,500+ submissions.

### Executive Summary
CALYX is a geospatial intelligence platform that predicts global plant phenology (blooming, seeding, dormancy) by correlating decadal climate data with biological observations. It solves the "data gap" in ecological forecasting by using machine learning to fill in missing ground-truth observations.

### System Architecture
1. **Data Ingestion Pipeline (Python/Pandas)**
   - Ingested **10TB+** of raw NetCDF data from **NASA MERRA-2** (2015-2025).
   - Extracted key variables: *Surface Temperature (T2M)*, *Total Precipitation (PRECTOT)*, and *Downwelling Shortwave Radiation (SWGDN)*.
   - Normalized data to a standardized **0.5° x 0.5° global grid**.

2. **Machine Learning Core (XGBoost)**
   - **Training Data**: 900+ target flora species and 100+ pest species sourced from iNaturalist research-grade observations.
   - **Feature Engineering**: Mapped species occurrences to **Köppen-Geiger climate biomes** to improve generalization in data-scarce regions.
   - **Model Ensemble**: Trained 4 separate XGBoost regressor models (Temp, Precip, Rad, Species-Presence) to handle non-linear climate interactions.

3. **Visualization Layer (React/Google Maps)**
   - Built a high-performance **Google Maps JavaScript API** overlay.
   - Implemented **Quadtree clustering** to handle rendering of 50,000+ data points without browser lag.
   - Designed a "Time-Slider" UI to visualize seasonal shifts dynamically.

### Challenges Solved
- **The "Big Data" Problem**: Browser memory crashed when loading global datasets.
  - *Solution*: Implemented a backend tiling service that only fetches climate data for the user's current viewport (View Frustum Culling).

### Tech Stack
- **Languages**: Python (Data Science), TypeScript (Frontend)
- **ML**: XGBoost, Scikit-Learn, Pandas, Xarray
- **Cloud**: Google Cloud Run (Containerized Inference), Docker` },
          ],
        },
        {
          name: 'urbanswap',
          type: 'directory',
          children: [
            { name: 'README.md', type: 'file', content: `# UrbanSwap 🤖
## Generative AI Commerce Platform ("Text-to-Storefront")

### Executive Summary
UrbanSwap democratizes e-commerce for non-technical artisans. Instead of using complex drag-and-drop builders, users simply upload a product photo. The system uses Multimodal LLMs to generate a fully coded, branded, and deployed storefront in <30 seconds.

### The "Generative UI" Pipeline
1. **Input Analysis (Gemini Pro Vision)**
   - User uploads a raw image (e.g., a handmade vase).
   - Gemini analyzes the image for: *Color Palette (Hex Codes)*, *Product Material*, *Brand Vibe (Minimalist/Rustic)*, and *Marketing Copy*.
   
2. **Code Synthesis**
   - The system injects these parameters into a structured **JSON Schema**.
   - A Next.js engine maps the JSON to pre-built **Tailwind CSS components** (Hero, Features, Pricing).
   - *Result*: A unique website layout generated on-the-fly, not just a template swap.

3. **Hybrid CMS**
   - **Problem**: AI isn't perfect. Users need control.
   - **Solution**: Built a "Hybrid Editor" where users can click any AI-generated text to manually override it, syncing state back to **Firebase Firestore** in real-time.

### Infrastructure
- **Compute**: Google Cloud Run (Stateless containers for scalability).
- **Database**: Firebase Firestore (NoSQL document store for dynamic schemas).
- **Auth**: Firebase Auth (Social login integration).

### Impact
- Reduced "Time-to-Shop" setup from **3 hours** (Shopify standard) to **45 seconds**.` },
          ],
        },
        {
          name: 'llm-parser',
          type: 'directory',
          children: [
            { name: 'README.md', type: 'file', content: `# LLM Document Processing System 📄
## Enterprise Unstructured Data Pipeline

### The Problem
Traditional OCR (Tesseract) fails on complex, unstructured documents like legal contracts or insurance claims. It extracts text but loses *meaning* and *relationships*.

### The Solution
A "Semantic Parsing Pipeline" that converts PDFs/Images into strictly validated JSON schemas using Large Language Models.

### Key Features
- **Intelligent Chunking**: Splits large documents into semantic sections (clauses, headers) rather than arbitrary page breaks, preserving context window limits.
- **Citation Mapping**: The "Black Box" problem solver. Every extracted data point includes a \`source_coordinates\` field, highlighting exactly *where* in the original PDF the data came from.
- **Schema Validation**: Uses **Pydantic** to enforce strict typing on the LLM output. If the LLM hallucinates a field, the validator rejects it and triggers a retry.

### Tech Stack
- **Core**: Python, LangChain
- **Models**: GPT-4-Turbo (Reasoning), LayoutLMv3 (Visual Layout Understanding)
- **Validation**: Pydantic, JSON Schema` },
          ],
        },
        {
          name: 'nvim-config',
          type: 'directory',
          children: [
            { name: 'README.md', type: 'file', content: `# Custom Neovim Config ⚡
## Personal Development Environment (PDE)

> "The editor is an extension of the mind."

### Philosophy
I moved from VS Code to Neovim to reduce mouse latency and build a keyboard-centric workflow. This config is the result of 2 years of iteration, focusing on **LSP integration** and **startup speed**.

### Performance Optimization
- **Startup Time**: ~18ms (Achieved via \`lazy.nvim\` byte-compilation and deferring non-essential plugins).
- **LSP Handlers**: Custom \`on_attach\` functions that map buffer-local keybinds only when a language server attaches.

### Key Plugins
- **Telescope**: Fuzzy finding everything (files, git logs, LSP symbols).
- **Treesitter**: AST-based syntax highlighting (better than Regex).
- **Harpoon**: For lightning-fast context switching between working files.
- **Undotree**: Visualizes the undo history graph (never lose code again).

### Links
- **Dotfiles Repo**: https://github.com/Dhruv1249/my-customized-nvim-config` },
          ],
        },
      ],
    },
    {
      name: 'documents',
      type: 'directory',
      children: [
        { name: 'resume.txt', type: 'file', content: `DHRUV
Full Stack Engineer | NASA Space Apps Winner
+91 7876503573 | dhr1249.lm@gmail.com

PROFESSIONAL SUMMARY
Data-driven Full Stack Engineer with a strong foundation in Cloud Architecture (GCP) and Generative AI. Proven track record of shipping production web apps (95+ Lighthouse scores) and solving complex data problems (NASA Space Apps Winner). Expert in Next.js ecosystems and Python backend services.

EXPERIENCE
------------------------------------------------------------
Contract Full Stack Engineer (Remote) | Nov 2025 - Present
------------------------------------------------------------
* **Project**: varanasitoursindia.com
  - Re-architected a legacy PHP site into a modern **Next.js 14** application.
  - Implemented **ISR (Incremental Static Regeneration)** to handle 100+ dynamic tour pages, reducing server costs by 60%.
  - Achieved **99/100 Core Web Vitals** by optimizing LCP (Largest Contentful Paint) via next/image and font optimization.

* **Project**: Automation Suite
  - Built a serverless Node.js pipeline using **Gmail API** and OAuth2.
  - Automated the parsing of incoming booking inquiries, extracting dates/pax, and auto-drafting confirmation emails.
  - Reduced manual administrative workload by **~20 hours/week**.

EDUCATION
------------------------------------------------------------
Lovely Professional University (2023 - Present)
B.Tech in Computer Science & Engineering | CGPA: 8.72
* **Coursework**: Data Structures, Algorithms, OS, DBMS, Cloud Computing (NPTEL), LLMs (NPTEL).

TECHNICAL SKILLS
------------------------------------------------------------
* **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
* **Backend**: Node.js, Python (FastAPI), Firebase, PostgreSQL
* **Data/AI**: XGBoost, Pandas, Google Gemini API, LangChain
* **DevOps**: Docker, Google Cloud Run, Git, Linux (Arch)` },
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
            { name: 'init.lua', type: 'file', content: `-- This is a simulation! 
-- To see the real engineered config, check the repo:
-- https://github.com/Dhruv1249/my-customized-nvim-config` },
          ],
        },
      ],
    },
    { name: 'README.md', type: 'file', content: `# Welcome to Dhruv's Portfolio OS 👋

> **System Status**: All Systems Operational
> **Kernel**: Linux 6.x (Simulated)

I created this interactive terminal portfolio to demonstrate my love for **systems engineering** and **clean UI**. 

## How to navigate?
- Use \`ls\` to see files.
- Use \`cd projects\` to go into the projects folder.
- Use \`cat calyx/README.md\` to read about my NASA project.
- Or just type \`projects\` for a quick summary!

## Why "Portfolio OS"?
Because static websites are boring. I wanted to build something that feels "alive" and respects the developer workflow.` },
  ],
};

export function getNode(path: string): FileNode | null {
  if (path === '~' || path === '') return fileSystem;
  
  const parts = path.replace('~/', '').split('/').filter(Boolean);
  let current: FileNode | null = fileSystem;

  for (const part of parts) {
    if (!current || current.type !== 'directory' || !current.children) {
      return null;
    }
    current = current.children.find(child => child.name === part) || null;
  }

  return current;
}

export function listDirectory(path: string): FileNode[] {
  const node = getNode(path);
  if (!node || node.type !== 'directory' || !node.children) {
    return [];
  }
  return node.children;
}