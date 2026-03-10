// app/api/github/tree/route.ts
// Server-side GitHub tree fetching with Next.js unstable_cache (1-day revalidation)

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

const fetchTreeFromGitHub = unstable_cache(
  async (owner: string, repo: string) => {
    // Try main branch first, then master
    let response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (!response.ok) {
      response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      );
    }
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const items: GitHubTreeItem[] = data.tree || [];

    // Filter out noise
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
      }));

    return filtered;
  },
  // Cache key parts — will be combined automatically
  undefined,
  {
    revalidate: 86400, // 1 day in seconds
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
    const tree = await fetchTreeFromGitHub(owner, repo);
    return NextResponse.json({ tree });
  } catch (err) {
    console.error('GitHub tree fetch error:', err);
    return NextResponse.json({ tree: [], error: 'Failed to fetch' }, { status: 500 });
  }
}
