import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  const params = new URLSearchParams({
    client_id: env.NOTION_CLIENT_ID,
    redirect_uri: env.NOTION_REDIRECT_URI,
    response_type: 'code',
    owner: 'user'
  });
  const url = `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}

