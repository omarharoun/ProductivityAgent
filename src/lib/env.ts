import { z } from 'zod';

const EnvSchema = z.object({
  // For internal integration
  NOTION_INTERNAL_TOKEN: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_BASE_URL: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  NOTION_INTERNAL_TOKEN: process.env.NOTION_INTERNAL_TOKEN || process.env.NOTION_CLIENT_SECRET || undefined,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || undefined,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || undefined,
  AI_BASE_URL: process.env.AI_BASE_URL || 'https://api.openai.com/v1'
});

