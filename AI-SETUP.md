# AI Assistant Setup

This guide will help you set up the AI assistant for your Notion productivity app.

## Quick Start

1. **Start the AI service:**
   ```bash
   ./setup-ai.sh
   ```

2. **Verify the AI service is running:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. **Test the AI service:**
   ```bash
   curl http://localhost:11434/api/generate -d '{"model":"tinyllama","prompt":"Hello, how are you?"}'
   ```

## What's Included

- **Ollama**: Lightweight AI model server
- **TinyLlama**: Small, efficient language model (~1GB)
- **AI Editor**: Full-featured text editor with AI capabilities
- **API Endpoints**: RESTful API for AI operations

## AI Features

### Text Editing
- ✨ **Improve Text**: Enhance clarity, grammar, and flow
- 🔄 **Rewrite**: Change tone (professional, casual, formal, etc.)
- ✏️ **Custom Edit**: Provide specific instructions
- 💡 **Generate Ideas**: Get creative suggestions

### API Endpoints
- `POST /api/ai/generate` - Generate text from prompt
- `POST /api/ai/edit` - Edit text with custom instruction
- `POST /api/ai/improve` - Improve text quality
- `POST /api/ai/rewrite` - Rewrite with specific tone
- `GET /api/ai/health` - Check AI service status

## Usage

1. **Open the Dashboard** and click "🤖 AI Edit" on any content
2. **Enter your text** in the editor
3. **Choose an AI action** from the sidebar:
   - Improve text quality
   - Rewrite with different tone
   - Custom editing instructions
   - Generate ideas
4. **Save your changes** when satisfied

## Troubleshooting

### AI Service Offline
- Check if Docker is running: `docker ps`
- Restart the service: `docker-compose restart`
- Check logs: `docker logs productivity-ai`

### Model Not Found
- Pull the model: `docker exec productivity-ai ollama pull tinyllama`
- List models: `docker exec productivity-ai ollama list`

### Performance Issues
- The TinyLlama model is optimized for speed
- For better quality, you can use larger models like `llama2` or `codellama`
- Adjust the model in the AI client configuration

## Customization

### Using Different Models
Edit `src/lib/ai-client.ts` to change the default model:
```typescript
const response = await aiClient.generateText(prompt, 'llama2');
```

### Adding New AI Features
1. Add new methods to `AIClient` class
2. Create corresponding API routes
3. Update the AI Editor component

## Docker Commands

```bash
# Start the AI service
docker-compose up -d

# Stop the AI service
docker-compose down

# View logs
docker logs productivity-ai

# Access the container
docker exec -it productivity-ai bash

# Pull a different model
docker exec productivity-ai ollama pull llama2
```

## Model Options

- **tinyllama** (1GB) - Fast, basic quality
- **llama2** (4GB) - Better quality, slower
- **codellama** (4GB) - Good for code
- **mistral** (4GB) - Balanced performance

Choose based on your needs for speed vs. quality.




