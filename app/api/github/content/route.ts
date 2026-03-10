// app/api/github/content/route.ts
// Server-side GitHub file content fetching
// Uses raw.githubusercontent.com (no API rate limits!) with unstable_cache (1-day)

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const IMAGE_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'bmp',
]);

const NON_TEXT_EXTENSIONS = new Set([
  'mp4', 'webm', 'avi', 'mov', 'mp3', 'wav', 'ogg',
  'woff', 'woff2', 'ttf', 'eot', 'otf',
  'zip', 'tar', 'gz', 'rar', '7z',
  'pdf', 'doc', 'docx', 'xls', 'xlsx',
  'exe', 'dll', 'so', 'dylib', 'o',
  'pyc', 'class', 'jar', 'tiff',
]);

function getExt(path: string): string {
  return path.split('.').pop()?.toLowerCase() || '';
}

// Fetch from raw.githubusercontent.com — NO API rate limits!
const fetchContentRaw = unstable_cache(
  async (owner: string, repo: string, path: string, branch: string) => {
    const branches = [branch, branch === 'main' ? 'master' : 'main'];

    for (const br of branches) {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${br}/${path}`;
      const response = await fetch(url);
      if (response.ok) {
        return { content: await response.text(), branch: br };
      }
    }

    return { content: '(Unable to load file content)', branch };
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
  const branch = searchParams.get('branch') || 'main';

  if (!owner || !repo || !path) {
    return NextResponse.json({ error: 'Missing owner, repo, or path' }, { status: 400 });
  }

  const ext = getExt(path);

  // Images: return the raw URL so the frontend can render an <img>
  if (IMAGE_EXTENSIONS.has(ext)) {
    const imageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    return NextResponse.json({ content: '', imageUrl });
  }

  // Non-text binary files: show a placeholder
  if (NON_TEXT_EXTENSIONS.has(ext)) {
    return NextResponse.json({ content: `(Binary file: ${path.split('/').pop()})` });
  }

  try {
    const result = await fetchContentRaw(owner, repo, path, branch);
    return NextResponse.json({ content: result.content });
  } catch (err) {
    console.error('GitHub content fetch error:', err);
    return NextResponse.json(
      { content: `(Error loading file: ${err instanceof Error ? err.message : 'Unknown error'})` },
      { status: 500 }
    );
  }
}
