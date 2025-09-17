"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type WebSpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type WebSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export default function VoiceAgent(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content: "Hi! I’m your AI planner. Ask me anything about your Notion workspace.",
    },
  ]);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const supportsSpeech = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      "webkitSpeechRecognition" in window ||
      "SpeechRecognition" in window
    );
  }, []);

  const ensureRecognition = useCallback(() => {
    if (!supportsSpeech) return null;
    if (recognitionRef.current) return recognitionRef.current;
    const SpeechRecognitionImpl =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) return null;
    const rec: WebSpeechRecognition = new SpeechRecognitionImpl();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (event: WebSpeechRecognitionEvent) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setInputText(text.trim());
    };
    rec.onerror = () => {
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = rec;
    return rec;
  }, [supportsSpeech]);

  const toggleListening = useCallback(() => {
    if (!supportsSpeech) return;
    const rec = ensureRecognition();
    if (!rec) return;
    if (isListening) {
      try { rec.stop(); } catch {}
      setIsListening(false);
    } else {
      setInputText("");
      try { rec.start(); setIsListening(true); } catch {}
    }
  }, [ensureRecognition, isListening, supportsSpeech]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    try {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    } catch {}
  }, [messages]);

  const handleSend = useCallback(async () => {
    const userText = inputText.trim();
    if (!userText) return;
    const newUser: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: userText };
    setMessages((prev) => [...prev, newUser]);
    setInputText("");
    // Placeholder assistant reply. Replace with a real API.
    const replyText = `You said: "${userText}". I can help find Notion databases, structure tasks, or draft entries.`;
    const newAssistant: ChatMessage = { id: `a-${Date.now()}`, role: "assistant", content: replyText };
    setMessages((prev) => [...prev, newAssistant]);
    speak(replyText);
  }, [inputText, speak]);

  return (
    <>
      <button
        aria-label="Open Voice Agent"
        className="voice-agent-fab"
        onClick={() => setIsOpen(true)}
      >
        🎙️
      </button>

      {isOpen && (
        <div className="voice-agent-overlay" role="dialog" aria-modal="true">
          <div className="voice-agent-modal">
            <div className="voice-agent-header">
              <h3 style={{ margin: 0 }}>AI Voice Agent</h3>
              <button className="voice-agent-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="voice-agent-chat">
              <div className="voice-agent-messages" ref={listRef}>
                {messages.map((m) => (
                  <div key={m.id} className={`voice-agent-message ${m.role}`}>
                    {m.content}
                  </div>
                ))}
              </div>
              <div className="voice-agent-inputRow">
                <button
                  className="voice-agent-mic"
                  onClick={toggleListening}
                  disabled={!supportsSpeech}
                  aria-pressed={isListening}
                  title={supportsSpeech ? (isListening ? "Stop listening" : "Start listening") : "Speech not supported"}
                >
                  {isListening ? "■" : "🎤"}
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={supportsSpeech ? "Speak or type your message" : "Type your message"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

