// app/api/github/content/route.ts
// Server-side GitHub file content fetching with Next.js unstable_cache (1-day revalidation)

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'bmp', 'tiff',
  'mp4', 'webm', 'avi', 'mov', 'mp3', 'wav', 'ogg',
  'woff', 'woff2', 'ttf', 'eot', 'otf',
  'zip', 'tar', 'gz', 'rar', '7z',
  'pdf', 'doc', 'docx', 'xls', 'xlsx',
  'exe', 'dll', 'so', 'dylib', 'o',
  'pyc', 'class', 'jar',
]);

function isBinaryFile(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  return BINARY_EXTENSIONS.has(ext);
}

const fetchContentFromGitHub = unstable_cache(
  async (owner: string, repo: string, path: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.encoding === 'base64' && data.content) {
      // Decode base64 content on the server
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    }

    // If too large, try raw download
    if (data.download_url) {
      const rawResponse = await fetch(data.download_url);
      const content = await rawResponse.text();
      return content;
    }

    return '(Unable to decode file content)';
  },
  undefined,
  {
    revalidate: 86400, // 1 day
    tags: ['github-content'],
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const path = searchParams.get('path');

  if (!owner || !repo || !path) {
    return NextResponse.json({ error: 'Missing owner, repo, or path' }, { status: 400 });
  }

  // Skip binary files entirely — they can't be cached (>2MB limit) and aren't useful as text
  if (isBinaryFile(path)) {
    return NextResponse.json({ content: `(Binary file: ${path.split('/').pop()})` });
  }

  try {
    const content = await fetchContentFromGitHub(owner, repo, path);
    return NextResponse.json({ content });
  } catch (err) {
    console.error('GitHub content fetch error:', err);
    return NextResponse.json(
      { content: `(Error loading file: ${err instanceof Error ? err.message : 'Unknown error'})` },
      { status: 500 }
    );
  }
}
