-- Notion credentials storage
create table if not exists notion_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  workspace_id text not null,
  access_token text not null,
  bot_id text,
  duplicated_template_id text,
  workspace_name text,
  workspace_icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notion_credentials_workspace_id on notion_credentials(workspace_id);

-- Simple profiles to bind a user to a workspace (optional MVP)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);

-- Rudimentary memory context for personalization
create table if not exists user_memory (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  key text not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

