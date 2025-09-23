#!/bin/bash

echo "🚀 AI Performance Monitor"
echo "========================"
echo ""

# Test AI response time
echo "Testing AI response time..."
start_time=$(date +%s.%N)
response=$(curl -s -X POST http://localhost:3000/api/ai/generate -H "Content-Type: application/json" -d '{"prompt":"Quick productivity tip"}')
end_time=$(date +%s.%N)

# Calculate response time
response_time=$(echo "$end_time - $start_time" | bc)
echo "Response time: ${response_time}s"

# Extract response content
echo "$response" | jq -r '.response' 2>/dev/null || echo "Response: $(echo "$response" | grep -o '"response":"[^"]*"' | cut -d'"' -f4)"

echo ""
echo "Container Resource Usage:"
docker stats productivity-ai --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "Available Models:"
docker exec productivity-ai ollama list 2>/dev/null || echo "Could not list models"

echo ""
echo "AI Service Health:"
curl -s http://localhost:11434/api/tags > /dev/null && echo "✅ AI Service: Online" || echo "❌ AI Service: Offline"
curl -s http://localhost:3000/api/ai/health > /dev/null && echo "✅ Next.js API: Online" || echo "❌ Next.js API: Offline"




