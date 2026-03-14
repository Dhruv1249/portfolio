import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const TOGGLE_FILE = '/tmp/photo-toggle.json';

function getState(): boolean {
  try {
    if (existsSync(TOGGLE_FILE)) {
      const data = JSON.parse(readFileSync(TOGGLE_FILE, 'utf-8'));
      return data.visible ?? true;
    }
  } catch {}
  return true;
}

function setState(visible: boolean) {
  writeFileSync(TOGGLE_FILE, JSON.stringify({ visible }), 'utf-8');
}

export async function GET() {
  return NextResponse.json({ visible: getState() });
}

export async function POST() {
  const current = getState();
  const next = !current;
  setState(next);
  return NextResponse.json({ visible: next });
}
