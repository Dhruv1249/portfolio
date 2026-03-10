// app/lib/github.ts
// Client-side GitHub utility — fetches via our cached API routes (not GitHub directly)

export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: RepoFile[];
}

export interface RepoInfo {
  owner: string;
  repo: string;
  label: string;
  emoji: string;
}

export const REPOS: RepoInfo[] = [
  { owner: 'Dhruv1249', repo: 'Plant-Phenology-State-Detector', label: 'CALYX', emoji: '🌍' },
  { owner: 'Dhruv1249', repo: 'ai-marketplace-assistant', label: 'UrbanSwap', emoji: '🤖' },
  { owner: 'Dhruv1249', repo: 'Pr-Tracker', label: 'PR Tracker', emoji: '🔀' },
  { owner: 'Dhruv1249', repo: 'expense-react-client', label: 'Expense Tracker', emoji: '💰' },
  { owner: 'Dhruv1249', repo: 'LLM-Document-Processing-System', label: 'LLM Parser', emoji: '📄' },
  { owner: 'Dhruv1249', repo: 'my-customized-nvim-config', label: 'Neovim Config', emoji: '⚡' },
];

// Client-side in-memory cache (avoids repeat fetches within the same session)
const treeCache = new Map<string, RepoFile[]>();
const contentCache = new Map<string, string>();

interface TreeItem {
  path: string;
  type: 'blob' | 'tree';
}

function buildFileTree(items: TreeItem[]): RepoFile[] {
  const root: RepoFile[] = [];
  const dirMap = new Map<string, RepoFile>();

  const sorted = [...items].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'tree' ? -1 : 1;
    return a.path.localeCompare(b.path);
  });

  for (const item of sorted) {
    const parts = item.path.split('/');
    const name = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('/');

    const node: RepoFile = {
      name,
      path: item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
      ...(item.type === 'tree' ? { children: [] } : {}),
    };

    if (item.type === 'tree') {
      dirMap.set(item.path, node);
    }

    if (parentPath === '') {
      root.push(node);
    } else {
      const parent = dirMap.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  }

  return root;
}

export async function fetchRepoTree(owner: string, repo: string): Promise<RepoFile[]> {
  const cacheKey = `${owner}/${repo}`;
  if (treeCache.has(cacheKey)) {
    return treeCache.get(cacheKey)!;
  }

  try {
    // Fetch from our cached API route (server uses unstable_cache with 1-day TTL)
    const response = await fetch(`/api/github/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const tree = buildFileTree(data.tree || []);
    treeCache.set(cacheKey, tree);
    return tree;
  } catch (err) {
    console.error('Failed to fetch repo tree:', err);
    return [];
  }
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
  const cacheKey = `${owner}/${repo}/${path}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }

  try {
    // Fetch from our cached API route
    const response = await fetch(
      `/api/github/content?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content || '(empty)';
    contentCache.set(cacheKey, content);
    return content;
  } catch (err) {
    console.error('Failed to fetch file content:', err);
    return `(Error loading file: ${err instanceof Error ? err.message : 'Unknown error'})`;
  }
}

// Detect language from file extension
export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    py: 'python', lua: 'lua', rs: 'rust', go: 'go',
    json: 'json', md: 'markdown', css: 'css', html: 'html',
    yml: 'yaml', yaml: 'yaml', toml: 'toml', sh: 'shell',
    bash: 'shell', zsh: 'shell', fish: 'shell',
    c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
    java: 'java', kt: 'kotlin', rb: 'ruby', php: 'php',
    sql: 'sql', graphql: 'graphql', proto: 'protobuf',
    dockerfile: 'dockerfile', makefile: 'makefile',
  };
  return langMap[ext] || 'text';
}
