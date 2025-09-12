import { NextRequest, NextResponse } from 'next/server';
import { createNotionClientAny } from '@/lib/notion';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const databaseId = searchParams.get('databaseId');
  if (!databaseId) {
    return NextResponse.json({ error: 'Missing databaseId' }, { status: 400 });
  }
  try {
    const notion = await createNotionClientAny();
    const result = await notion.databases.query({ database_id: databaseId });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

