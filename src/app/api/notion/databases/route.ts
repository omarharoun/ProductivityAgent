import { NextRequest, NextResponse } from 'next/server';
import { createNotionClient } from '@/lib/notion';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'journal';
  try {
    const notion = createNotionClient();
    const search = await notion.search({ query: '', filter: { property: 'object', value: 'database' } });
    const databases = (search.results || []).map(r => ({ id: (r as any).id, title: extractTitle(r) }));
    const filtered = databases.filter(d => matchDbType(d.title, type));
    return NextResponse.json({ databases: filtered.length ? filtered : databases });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function extractTitle(obj: any): string {
  const titleProp = obj?.title ?? [];
  if (Array.isArray(titleProp) && titleProp.length > 0) {
    return titleProp.map((t: any) => t?.plain_text ?? '').join('');
  }
  // fallback name
  return obj?.properties ? Object.keys(obj.properties)[0] ?? 'Untitled' : 'Untitled';
}

function matchDbType(title: string, type: string): boolean {
  const t = title.toLowerCase();
  if (type === 'journal') return t.includes('journal');
  if (type === 'tasks') return t.includes('task') || t.includes('todo');
  if (type === 'goals') return t.includes('goal') || t.includes('okr');
  return false;
}

