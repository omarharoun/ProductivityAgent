import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Only create Supabase client if environment variables are available
export const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false
      }
    })
  : null;

export type NotionCredential = {
  id: string;
  user_id: string | null;
  workspace_id: string;
  access_token: string;
  bot_id: string | null;
  duplicated_template_id: string | null;
  workspace_name: string | null;
  workspace_icon: string | null;
  created_at: string;
  updated_at: string;
};

