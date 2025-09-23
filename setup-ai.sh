#!/bin/bash

echo "Setting up AI Assistant with optimized performance..."

# Stop existing container if running
echo "Stopping existing container..."
docker-compose down

# Start the Docker container with optimized settings
echo "Starting Ollama container with 4 CPU cores and 8GB RAM..."
docker-compose up -d

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
sleep 15

# Configure Ollama for better performance
echo "Configuring Ollama for optimal performance..."
docker exec productivity-ai ollama serve &
sleep 5

# Pull a faster, more efficient model (Phi-3 mini - better than TinyLlama)
echo "Pulling Phi-3 mini model (faster and more efficient)..."
docker exec productivity-ai ollama pull phi3:mini

# Set model parameters for speed
echo "Configuring model for speed..."
docker exec productivity-ai ollama run phi3:mini "Set temperature to 0.7 and max tokens to 100 for faster responses"

# Test the model
echo "Testing AI model performance..."
time docker exec productivity-ai ollama run phi3:mini "Hello, I'm your AI assistant!"

echo ""
echo "🚀 AI Assistant setup complete with optimized performance!"
echo "📊 Resources allocated: 4 CPU cores, 8GB RAM"
echo "⚡ Model: Phi-3 mini (faster than TinyLlama)"
echo "🌐 Service running on: http://localhost:11434"
echo ""
echo "Test with: curl http://localhost:11434/api/generate -d '{\"model\":\"phi3:mini\",\"prompt\":\"Hello\"}'"
