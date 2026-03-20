// app/lib/github.ts
// Client-side GitHub utility — fetches via our cached API routes (not GitHub directly)

export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  isSubmodule?: boolean;
  submoduleUrl?: string;
  submoduleOwner?: string;
  submoduleRepo?: string;
  children?: RepoFile[];
}

export interface RepoInfo {
  owner: string;
  repo: string;
  label: string;
  icon: string;
}

export const REPOS: RepoInfo[] = [
  { owner: 'Dhruv1249', repo: 'Plant-Phenology-State-Detector', label: 'CALYX', icon: 'globe' },
  { owner: 'Dhruv1249', repo: 'ai-marketplace-assistant', label: 'UrbanSwap', icon: 'bot' },
  { owner: 'Dhruv1249', repo: 'Pr-Tracker', label: 'PR Tracker', icon: 'git-branch' },
  { owner: 'Dhruv1249', repo: 'expense-react-client', label: 'Expense Tracker', icon: 'wallet' },
  { owner: 'Dhruv1249', repo: 'LLM-Document-Processing-System', label: 'LLM Parser', icon: 'file-text' },
  { owner: 'Dhruv1249', repo: 'my-customized-nvim-config', label: 'Neovim Config', icon: 'zap' },
];

// Client-side in-memory cache (avoids repeat fetches within the same session)
const treeCache = new Map<string, RepoFile[]>();
const TREE_CACHE_VERSION = 'v2-submodule-map';
export interface FileContentResult {
  content: string;
  imageUrl?: string;
}

const contentCache = new Map<string, FileContentResult>();
const branchCache = new Map<string, string>();

interface TreeItem {
  path: string;
  type: 'blob' | 'tree' | 'commit';
  submoduleUrl?: string;
  submoduleOwner?: string;
  submoduleRepo?: string;
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

    const isDirectoryLike = item.type === 'tree' || item.type === 'commit';
    const hasInlineChildren = item.type === 'tree';

    const node: RepoFile = {
      name,
      path: item.path,
      type: isDirectoryLike ? 'directory' : 'file',
      ...(item.type === 'commit'
        ? {
            isSubmodule: true,
            submoduleUrl: item.submoduleUrl,
            submoduleOwner: item.submoduleOwner,
            submoduleRepo: item.submoduleRepo,
          }
        : {}),
      ...(hasInlineChildren ? { children: [] } : {}),
    };

    if (hasInlineChildren) {
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
  const cacheKey = `${TREE_CACHE_VERSION}:${owner}/${repo}`;
  if (treeCache.has(cacheKey)) {
    return treeCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`/api/github/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const tree = buildFileTree(data.tree || []);
    treeCache.set(cacheKey, tree);
    // Store the branch so content fetches can use raw.githubusercontent.com
    if (data.branch) {
      branchCache.set(cacheKey, data.branch);
    }
    return tree;
  } catch (err) {
    console.error('Failed to fetch repo tree:', err);
    return [];
  }
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<FileContentResult> {
  const cacheKey = `${owner}/${repo}/${path}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }

  try {
    const branch = branchCache.get(`${owner}/${repo}`) || 'main';
    const response = await fetch(
      `/api/github/content?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}&branch=${encodeURIComponent(branch)}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const result: FileContentResult = {
      content: data.content || '(empty)',
      imageUrl: data.imageUrl,
    };
    contentCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Failed to fetch file content:', err);
    return { content: `(Error loading file: ${err instanceof Error ? err.message : 'Unknown error'})` };
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
