'use client';

import { useState, useEffect } from 'react';

interface AIEditorProps {
  initialText?: string;
  onSave?: (text: string) => void;
  onClose?: () => void;
}

export default function AIEditor({ initialText = '', onSave, onClose }: AIEditorProps) {
  const [text, setText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [customInstruction, setCustomInstruction] = useState('');

  useEffect(() => {
    checkAIStatus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const checkAIStatus = async () => {
    try {
      const response = await fetch('/api/ai/health');
      const data = await response.json();
      setAiStatus(data.healthy ? 'online' : 'offline');
    } catch (error) {
      setAiStatus('offline');
    }
  };

  const handleAIAction = async (action: string, data: any) => {
    if (aiStatus !== 'online') {
      alert('AI service is offline. Please start the Docker container first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        setText(result.response);
      } else {
        alert(`AI Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to process AI request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = () => {
    handleAIAction('improve', { text });
  };

  const handleRewrite = () => {
    handleAIAction('rewrite', { text, tone: selectedTone });
  };

  const handleCustomEdit = () => {
    if (!customInstruction.trim()) {
      alert('Please enter an instruction');
      return;
    }
    handleAIAction('edit', { text, instruction: customInstruction });
  };

  const handleGenerateIdeas = async () => {
    if (!text.trim()) {
      alert('Please enter some text first to generate ideas');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Generate 5 creative ideas related to: ${text}` 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setText(text + '\n\nIdeas:\n' + result.response);
      } else {
        alert(`AI Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to generate ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div className="ai-editor-overlay" onClick={handleOverlayClick}>
      <div className="ai-editor-popup">
        <div className="ai-editor-header">
          <h2>🤖 AI Editor</h2>
          <div className="ai-status">
            <span className={`ai-status-indicator ${aiStatus}`}></span>
            {aiStatus === 'online' ? 'Online' : 'Offline'}
          </div>
          {onClose && (
            <button className="ai-editor-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="ai-editor-body">
          <div className="ai-editor-main">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here for AI editing..."
              className="ai-editor-textarea"
              rows={8}
            />
          </div>

          <div className="ai-editor-sidebar">
            <div className="ai-actions">
              <h3>Quick Actions</h3>
              
              <button 
                onClick={handleImprove} 
                disabled={isLoading || !text.trim()}
                className="ai-action-btn"
              >
                ✨ Improve
              </button>

              <div className="ai-rewrite-section">
                <label>Rewrite Tone:</label>
                <select 
                  value={selectedTone} 
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="ai-tone-select"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="concise">Concise</option>
                </select>
                <button 
                  onClick={handleRewrite} 
                  disabled={isLoading || !text.trim()}
                  className="ai-action-btn"
                >
                  🔄 Rewrite
                </button>
              </div>

              <div className="ai-custom-section">
                <label>Custom:</label>
                <input
                  type="text"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="e.g., make it more engaging"
                  className="ai-custom-input"
                />
                <button 
                  onClick={handleCustomEdit} 
                  disabled={isLoading || !text.trim() || !customInstruction.trim()}
                  className="ai-action-btn"
                >
                  ✏️ Custom
                </button>
              </div>

              <button 
                onClick={handleGenerateIdeas} 
                disabled={isLoading || !text.trim()}
                className="ai-action-btn"
              >
                💡 Ideas
              </button>
            </div>

            {isLoading && (
              <div className="ai-loading">
                <div className="ai-spinner"></div>
                <span>AI thinking...</span>
              </div>
            )}
          </div>
        </div>

        <div className="ai-editor-footer">
          <button 
            onClick={() => onSave?.(text)} 
            className="notion-button"
            disabled={!text.trim()}
          >
            💾 Save
          </button>
          <button 
            onClick={onClose} 
            className="notion-button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
