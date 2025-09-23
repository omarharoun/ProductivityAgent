# OpenAI GPT-4.1 Integration Setup

This guide will help you set up OpenAI GPT-4.1 integration for your Notion productivity app.

## Prerequisites

- OpenAI API account with access to GPT-4.1
- OpenAI API key

## Setup Steps

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

### 2. Configure Environment Variables

Create a `.env` file in your project root with the following content:

```bash
# Notion Configuration
NOTION_CLIENT_SECRET=your_notion_client_secret_here
NOTION_REDIRECT_URI=http://localhost:3000/api/notion/callbacK

# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 3. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the AI health endpoint:
   ```bash
   curl http://localhost:3000/api/ai/health
   ```

3. Test AI generation:
   ```bash
   curl -X POST http://localhost:3000/api/ai/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt":"Help me organize my day"}'
   ```

## Features

### GPT-4.1 Integration
- **Model**: GPT-4.1 (gpt-4o)
- **Response Time**: ~2-3 seconds (much faster than local AI)
- **Quality**: Professional-grade AI responses
- **Context**: Understands complex Notion content and editing requests

### AI Capabilities
- **Text Generation**: Create content from prompts
- **Text Editing**: Improve, rewrite, and modify text
- **Tone Adjustment**: Change writing style (professional, casual, etc.)
- **Content Summarization**: Create concise summaries
- **Idea Generation**: Generate creative ideas and suggestions

### Notion Integration
- **Content Access**: Fetches your actual Notion pages and databases
- **Context-Aware Editing**: AI understands what content you're editing
- **Smart Suggestions**: Provides relevant editing recommendations
- **Voice Commands**: "Edit my essay" opens the Notion AI Editor

## Usage

### Voice Assistant
1. Click the microphone button (🎙️)
2. Say: "I want to edit my Notion content"
3. Select a page from the Notion AI Editor
4. Tell the AI what you want to change

### Dashboard
1. Go to Dashboard
2. Click "✏️ Edit Notion Content"
3. Select a page from the left panel
4. Use AI chat or quick actions to edit

### Quick Actions
- ✨ **Improve**: Enhance clarity and grammar
- 💼 **Professional**: Make content more formal
- 📝 **Concise**: Make content shorter and clearer

## Troubleshooting

### API Key Issues
- **Error**: "OpenAI API key is not configured"
- **Solution**: Make sure OPENAI_API_KEY is set in your .env file

### Rate Limits
- **Error**: "Rate limit exceeded"
- **Solution**: Wait a moment and try again, or upgrade your OpenAI plan

### Model Access
- **Error**: "Model not found"
- **Solution**: Ensure you have access to GPT-4.1 in your OpenAI account

## Cost Considerations

- **GPT-4.1**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Typical Request**: ~$0.01-0.05 per interaction
- **Monthly Usage**: Depends on usage, typically $5-20 for moderate use

## Benefits Over Local AI

- **Quality**: Much higher quality responses
- **Speed**: 2-3x faster than local models
- **Context**: Better understanding of complex requests
- **Reliability**: No local resource management needed
- **Updates**: Always uses the latest AI capabilities




