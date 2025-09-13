import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';

type NotionTokenResponse = {
  access_token: string;
  token_type: string;
  bot_id: string;
  workspace_name?: string;
  workspace_icon?: string;
  workspace_id: string;
  duplicated_template_id?: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const tokenUrl = 'https://api.notion.com/v1/oauth/token';
  const basicAuth = Buffer.from(`${env.NOTION_CLIENT_ID}:${env.NOTION_CLIENT_SECRET}`).toString('base64');

  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.NOTION_REDIRECT_URI
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: 'Token exchange failed', detail: text }, { status: 400 });
  }

  const data = (await resp.json()) as NotionTokenResponse;

  const { error: dbError } = await supabase
    .from('notion_credentials')
    .upsert({
      workspace_id: data.workspace_id,
      access_token: data.access_token,
      bot_id: data.bot_id,
      duplicated_template_id: data.duplicated_template_id ?? null,
      workspace_name: data.workspace_name ?? null,
      workspace_icon: data.workspace_icon ?? null
    }, {
      onConflict: 'workspace_id'
    });

  if (dbError) {
    return NextResponse.json({ error: 'Failed to save token', detail: dbError.message }, { status: 500 });
  }

  const site = env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return NextResponse.redirect(`${site}/dashboard`);
}

