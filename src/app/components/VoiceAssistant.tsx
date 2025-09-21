'use client';

import { useState, useEffect } from 'react';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    setIsListening(true);
    
    // Simple speech recognition implementation
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input:', transcript);
      // Here you can add logic to process the voice input
      alert(`You said: ${transcript}`);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="voice-assistant-overlay">
      <button
        className={`voice-assistant-button ${isListening ? 'listening' : ''}`}
        onClick={startListening}
        disabled={isListening}
        title={isListening ? 'Listening...' : 'Click to speak'}
      >
        {isListening ? '🎤' : '🎙️'}
      </button>
    </div>
  );
}
