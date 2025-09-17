"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RecognitionType = typeof window extends any
  ? (window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition | SpeechRecognition | null
  : any;

export default function VoiceAgent(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
    const rec: SpeechRecognition = new SpeechRecognitionImpl();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
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
      setTranscript("");
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

  const handleSend = useCallback(async () => {
    const userText = transcript.trim();
    if (!userText) return;
    // Placeholder: echo response. Replace with API call to your AI backend if available.
    const reply = `I heard: "${userText}". How can I help with your Notion planning?`;
    setResponse(reply);
    speak(reply);
  }, [speak, transcript]);

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
            <div className="voice-agent-body">
              <div className="voice-agent-stt">
                <label htmlFor="transcript">You</label>
                <textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={supportsSpeech ? "Speak or type your request..." : "Type your request..."}
                  rows={4}
                />
                <div className="voice-agent-actions">
                  <button onClick={toggleListening} disabled={!supportsSpeech}>
                    {isListening ? "Stop" : "Start"} Listening
                  </button>
                  <button onClick={handleSend}>
                    Send
                  </button>
                </div>
              </div>
              <div className="voice-agent-tts">
                <label htmlFor="response">Agent</label>
                <textarea id="response" value={response} readOnly rows={4} placeholder="Response will appear here" />
                <div className="voice-agent-actions">
                  <button onClick={() => speak(response)} disabled={!response}>
                    Play Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

