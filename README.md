## Life Productivity Planner Agent (MVP)

Next.js + Supabase + Notion OAuth scaffold.

### Setup

1) Copy environment variables:

```bash
cp .env.example .env.local
```

2) Fill in values:
- NOTION_CLIENT_ID / NOTION_CLIENT_SECRET from your Notion integration
- NOTION_REDIRECT_URI: `http://localhost:3000/api/notion/callback`
- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from your Supabase project
- NEXT_PUBLIC_SITE_URL: `http://localhost:3000`

3) Apply Supabase schema (SQL):

```sql
-- Run in Supabase SQL editor
-- Use the contents of supabase.sql
```

4) Install and run:

```bash
npm install
npm run dev
```

### OAuth Flow
- GET `/api/notion/connect` → redirect to Notion consent
- GET `/api/notion/callback` → exchange code, store token in `notion_credentials`

### Database Reader APIs
- GET `/api/notion/databases?type=journal|tasks|goals` → list matching databases
- GET `/api/notion/query?databaseId=...` → query database rows

### Roadmap
- Add OpenAI-powered planning, reflection, and rewriting endpoints
- Build dashboard views for Journal, Tasks, Goals
- Add session auth to bind users to workspaces

