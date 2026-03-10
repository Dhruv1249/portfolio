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

const fetchTreeFromGitHub = unstable_cache(
  async (owner: string, repo: string) => {
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

    // Filter out noise AND submodules (type === 'commit')
    const filtered = items
      .filter(item => {
        // Skip submodules entirely
        if (item.type === 'commit') return false;
        
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
    const { tree, branch } = await fetchTreeFromGitHub(owner, repo);
    return NextResponse.json({ tree, branch });
  } catch (err) {
    console.error('GitHub tree fetch error:', err);
    return NextResponse.json({ tree: [], error: 'Failed to fetch' }, { status: 500 });
  }
}
