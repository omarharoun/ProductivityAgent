import { z } from 'zod';

const EnvSchema = z.object({
  // For internal integration
  NOTION_INTERNAL_TOKEN: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  NOTION_INTERNAL_TOKEN: process.env.NOTION_INTERNAL_TOKEN || process.env.NOTION_CLIENT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
});

