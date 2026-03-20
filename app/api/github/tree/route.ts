// app/api/github/tree/route.ts
// Server-side GitHub tree fetching with Next.js unstable_cache (1-day revalidation)

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

function githubHeaders() {
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree' | 'commit'; // commit = submodule
  sha: string;
  size?: number;
}

interface SubmoduleMeta {
  url: string;
  owner?: string;
  repo?: string;
}

function parseGitmodules(content: string): Map<string, SubmoduleMeta> {
  const map = new Map<string, SubmoduleMeta>();
  const lines = content.split('\n');
  let currentPath: string | null = null;
  let currentUrl: string | null = null;

  const flush = () => {
    if (!currentPath || !currentUrl) return;

    const url = currentUrl.trim();
    let owner: string | undefined;
    let repo: string | undefined;

    const githubMatch = url.match(/github\.com[:/]([^/]+)\/([^/.]+?)(?:\.git)?$/i);
    if (githubMatch) {
      owner = githubMatch[1];
      repo = githubMatch[2];
    }

    // Relative submodule URLs (e.g. ../repo.git) fall back to same owner.
    if (!owner || !repo) {
      const relMatch = url.match(/(?:\.\.\/|\.\/)?([^/]+?)(?:\.git)?$/);
      if (relMatch) {
        repo = relMatch[1];
      }
    }

    map.set(currentPath, { url, owner, repo });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('[submodule ')) {
      flush();
      currentPath = null;
      currentUrl = null;
      continue;
    }

    if (line.startsWith('path = ')) {
      currentPath = line.slice('path = '.length).trim();
      continue;
    }

    if (line.startsWith('url = ')) {
      currentUrl = line.slice('url = '.length).trim();
    }
  }

  flush();

  return map;
}

async function fetchGitmodules(owner: string, repo: string, branch: string): Promise<Map<string, SubmoduleMeta>> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/.gitmodules`;
  const response = await fetch(url);
  if (!response.ok) return new Map();
  const content = await response.text();
  return parseGitmodules(content);
}

const fetchTreeFromGitHub = unstable_cache(
  async (owner: string, repo: string, schemaVersion: string) => {
    void schemaVersion;
    // Try main branch first, then master
    let branch = 'main';
    let response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      { headers: githubHeaders() }
    );
    if (!response.ok) {
      branch = 'master';
      response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
        { headers: githubHeaders() }
      );
    }
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded — try again in a few minutes');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const items: GitHubTreeItem[] = data.tree || [];
    const submoduleMap = await fetchGitmodules(owner, repo, branch);

    // Filter out noise while preserving submodules (type === 'commit')
    const filtered = items
      .filter(item => {
        const parts = item.path.split('/');
        return !parts.some(p => p.startsWith('.') && p !== '.env.example') &&
          !parts.includes('node_modules') &&
          !parts.includes('dist') &&
          !parts.includes('build') &&
          !parts.includes('__pycache__') &&
          !parts.includes('.next');
      })
      .map(item => ({
        path: item.path,
        type: item.type,
        ...(item.type === 'commit' && submoduleMap.has(item.path)
          ? {
              submoduleUrl: submoduleMap.get(item.path)!.url,
              submoduleOwner: submoduleMap.get(item.path)!.owner || owner,
              submoduleRepo: submoduleMap.get(item.path)!.repo || item.path.split('/').pop(),
            }
          : item.type === 'commit'
            ? {
                submoduleOwner: owner,
                submoduleRepo: item.path.split('/').pop(),
              }
            : {}),
      }));

    return { tree: filtered, branch };
  },
  undefined,
  {
    revalidate: 86400, // 1 day
    tags: ['github-tree'],
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing owner or repo' }, { status: 400 });
  }

  try {
    const TREE_SCHEMA_VERSION = 'submodule-schema-v2';
    const { tree, branch } = await fetchTreeFromGitHub(owner, repo, TREE_SCHEMA_VERSION);
    return NextResponse.json({ tree, branch });
  } catch (err) {
    console.error('GitHub tree fetch error:', err);
    return NextResponse.json({ tree: [], error: 'Failed to fetch' }, { status: 500 });
  }
}
