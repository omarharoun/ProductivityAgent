'use client';

import { useState, useEffect } from 'react';
import NotionAIEditor from './NotionAIEditor';
import { taskStorage } from '@/lib/task-storage';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [showNotionEditor, setShowNotionEditor] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
    }
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await fetch('/api/ai/health');
      const data = await response.json();
      setAiStatus(data.healthy ? 'online' : 'offline');
    } catch (error) {
      setAiStatus('offline');
    }
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendToAI = async (text: string) => {
    if (aiStatus !== 'online') {
      addMessage('AI service is offline. Please check the Docker container.', false);
      return;
    }

    // Check if user wants to create a task
    const taskKeywords = ['task', 'todo', 'remind', 'add', 'create', 'need to', 'should', 'must'];
    const wantsToCreateTask = taskKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (wantsToCreateTask) {
      // Extract task text by removing common task keywords
      let taskText = text;
      const removePatterns = [
        /^(create|add|make)\s+a?\s*task\s*:?\s*/i,
        /^(remind me to|i need to|i should|i must)\s*/i,
        /^(todo|task)\s*:?\s*/i
      ];
      
      for (const pattern of removePatterns) {
        taskText = taskText.replace(pattern, '').trim();
      }

      if (taskText.length > 0) {
        // Determine priority based on urgency keywords
        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('asap') || text.toLowerCase().includes('important')) {
          priority = 'high';
        } else if (text.toLowerCase().includes('low priority') || text.toLowerCase().includes('sometime')) {
          priority = 'low';
        }

        const task = taskStorage.addTask(taskText, priority);
        addMessage(`✅ Task added: "${taskText}" (${priority} priority)`, false);
        return;
      }
    }

    // Check if user wants to edit Notion content
    const editKeywords = ['edit', 'change', 'modify', 'update', 'rewrite', 'improve', 'fix'];
    const wantsToEdit = editKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (wantsToEdit) {
      addMessage('I can help you edit your Notion content! Opening the editor...', false);
      setShowNotionEditor(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `You are a productivity assistant. MAXIMUM 2 sentences. Be direct and practical. NO long explanations.\n\nUser: "${text}"\nAssistant:` 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        addMessage(result.response, false);
      } else {
        addMessage(`AI Error: ${result.error}`, false);
      }
    } catch (error) {
      addMessage('Failed to get AI response. Please try again.', false);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    if (aiStatus !== 'online') {
      alert('AI service is offline. Please start the Docker container first.');
      return;
    }

    setIsListening(true);
    setShowChat(true);

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    // Increase timeout to give more time for speech
    recognition.timeout = 10000; // 10 seconds
    recognition.onspeechstart = () => {
      console.log('Speech started');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        addMessage(transcript, true);
        sendToAI(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Handle specific error types
      if (event.error === 'no-speech') {
        addMessage('No speech detected. Please try speaking again.', false);
      } else if (event.error === 'not-allowed') {
        addMessage('Microphone permission denied. Please allow microphone access.', false);
      } else if (event.error === 'network') {
        addMessage('Network error. Please check your connection.', false);
      } else {
        addMessage(`Speech recognition error: ${event.error}`, false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onsoundstart = () => {
      console.log('Sound detected');
    };

    recognition.onsoundend = () => {
      console.log('Sound ended');
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      addMessage('Failed to start speech recognition. Please try again.', false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="voice-assistant-overlay">
      {showChat && (
        <div className="voice-chat-box">
          <div className="voice-chat-header">
            <div className="voice-chat-title">
              <span className={`ai-status-indicator ${aiStatus}`}></span>
              AI Assistant
            </div>
            <div className="voice-chat-controls">
              <button 
                onClick={clearChat}
                className="voice-chat-clear"
                title="Clear chat"
              >
                🗑️
              </button>
              <button 
                onClick={() => setShowChat(false)}
                className="voice-chat-close"
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="voice-chat-messages">
            {messages.length === 0 ? (
              <div className="voice-chat-empty">
                <p>👋 Hi! Click the mic to start.</p>
                <p>I help with productivity tasks.</p>
                <p style={{ fontSize: '12px', color: 'var(--notion-text-tertiary)', marginTop: '8px' }}>
                  💡 Make sure your microphone is enabled and speak clearly
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`voice-chat-message ${message.isUser ? 'user' : 'ai'}`}
                >
                  <div className="voice-chat-message-content">
                    {message.text}
                  </div>
                  <div className="voice-chat-message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            
            {isListening && (
              <div className="voice-chat-message ai">
                <div className="voice-chat-message-content">
                  <div className="voice-chat-listening">
                    🎤 Listening... Speak now
                  </div>
                </div>
              </div>
            )}
            
            {isProcessing && (
              <div className="voice-chat-message ai">
                <div className="voice-chat-message-content">
                  <div className="voice-chat-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <button
        className={`voice-assistant-button ${isListening ? 'listening' : ''}`}
        onClick={startListening}
        disabled={isListening || isProcessing}
        title={isListening ? 'Listening...' : 'Click to speak with AI'}
      >
        {isListening ? '🎤' : '🎙️'}
      </button>

      {showNotionEditor && (
        <NotionAIEditor onClose={() => setShowNotionEditor(false)} />
      )}
    </div>
  );
}