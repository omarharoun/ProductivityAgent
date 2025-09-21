import { Client } from '@notionhq/client';
import { supabase } from './supabase';
import { env } from './env';

export function createNotionClient() {
  if (!env.NOTION_INTERNAL_TOKEN) {
    throw new Error('NOTION_INTERNAL_TOKEN is required');
  }
  return new Client({ auth: env.NOTION_INTERNAL_TOKEN });
}

