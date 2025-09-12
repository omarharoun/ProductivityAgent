import { Client } from '@notionhq/client';
import { supabase } from './supabase';

export async function createNotionClientByWorkspace(workspaceId: string) {
  const { data, error } = await supabase
    .from('notion_credentials')
    .select('access_token')
    .eq('workspace_id', workspaceId)
    .maybeSingle();
  if (error || !data) {
    throw new Error('Notion credentials not found for workspace');
  }
  return new Client({ auth: data.access_token });
}

export async function createNotionClientAny() {
  const { data, error } = await supabase
    .from('notion_credentials')
    .select('access_token')
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    throw new Error('No Notion credentials found');
  }
  return new Client({ auth: data.access_token });
}

