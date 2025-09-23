'use client';

import { useState, useEffect, useCallback } from 'react';
import { aiClient } from '@/lib/ai-client';

interface NotionPage {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'database';
}

interface NotionAIEditorProps {
  onClose: () => void;
}

export default function NotionAIEditor({ onClose }: NotionAIEditorProps) {
  const [notionPages, setNotionPages] = useState<NotionPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<NotionPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [userInput, setUserInput] = useState('');

  const loadNotionContent = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch databases
      const dbResponse = await fetch('/api/notion/databases');
      const { databases } = await dbResponse.json();
      
      const pages: NotionPage[] = [];
      
      // For each database, fetch some pages
      for (const db of databases.slice(0, 3)) { // Limit to 3 databases
        try {
          const queryResponse = await fetch(`/api/notion/query?databaseId=${db.id}`);
          const queryData = await queryResponse.json();
          
          // Convert database entries to pages
          queryData.results?.slice(0, 5).forEach((result: any) => {
            const title = extractTitle(result);
            pages.push({
              id: result.id,
              title: title,
              content: `Content from ${db.title}: ${title}`,
              type: 'database'
            });
          });
        } catch (error) {
          console.error(`Error fetching database ${db.id}:`, error);
        }
      }
      
      setNotionPages(pages);
    } catch (error) {
      console.error('Error loading Notion content:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotionContent();
  }, [loadNotionContent]);

  const extractTitle = (obj: any): string => {
    const titleProp = obj?.properties?.Name?.title || obj?.properties?.Title?.title || [];
    if (Array.isArray(titleProp) && titleProp.length > 0) {
      return titleProp.map((t: any) => t?.plain_text ?? '').join('');
    }
    return 'Untitled';
  };

  const handleAIChat = async () => {
    if (!userInput.trim()) return;
    
    setIsAITyping(true);
    try {
      const context = selectedPage 
        ? `You are editing: "${selectedPage.title}"\nContent: ${selectedPage.content}\n\nUser request: ${userInput}`
        : `Available Notion pages: ${notionPages.map(p => p.title).join(', ')}\n\nUser request: ${userInput}`;
      
      const response = await aiClient.generateText(context);
      setAiResponse(response);
    } catch (error) {
      console.error('AI chat error:', error);
      setAiResponse('Sorry, I had trouble processing your request. Please try again.');
    } finally {
      setIsAITyping(false);
    }
  };

  const handleEditPage = async (instruction: string) => {
    if (!selectedPage) return;
    
    setIsAITyping(true);
    try {
      const editedContent = await aiClient.editText(selectedPage.content, instruction);
      setAiResponse(`Here's your edited content:\n\n${editedContent}`);
    } catch (error) {
      console.error('Edit error:', error);
      setAiResponse('Sorry, I had trouble editing the content. Please try again.');
    } finally {
      setIsAITyping(false);
    }
  };

  return (
    <div className="ai-editor-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ai-editor-popup" style={{ width: '800px', height: '600px' }}>
        <div className="ai-editor-header">
          <h2>🤖 Notion AI Editor</h2>
          <div className="ai-status">
            <span className="ai-status-indicator online"></span>
            Connected to Notion
          </div>
          <button className="ai-editor-close" onClick={onClose}>✕</button>
        </div>

        <div className="ai-editor-body" style={{ display: 'flex', height: 'calc(100% - 120px)' }}>
          {/* Left Panel - Notion Content */}
          <div style={{ width: '300px', borderRight: '1px solid var(--notion-dark-border)', padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>📄 Your Notion Content</h3>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="ai-spinner"></div>
                <p>Loading your Notion pages...</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notionPages.length === 0 ? (
                  <p style={{ color: 'var(--notion-dark-text-secondary)', fontSize: '14px' }}>
                    No Notion content found. Make sure you&apos;re connected to Notion.
                  </p>
                ) : (
                  notionPages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      style={{
                        padding: '12px',
                        margin: '8px 0',
                        background: selectedPage?.id === page.id ? 'var(--notion-accent)' : 'var(--notion-dark-bg-tertiary)',
                        color: selectedPage?.id === page.id ? 'white' : 'var(--notion-dark-text)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: '1px solid var(--notion-dark-border)',
                        fontSize: '14px'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{page.title}</div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>{page.type}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Panel - AI Chat */}
          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>
              {selectedPage ? `Editing: ${selectedPage.title}` : 'What would you like to edit?'}
            </h3>
            
            {/* AI Response */}
            <div style={{ 
              flex: 1, 
              background: 'var(--notion-dark-bg-tertiary)', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '16px',
              overflowY: 'auto',
              border: '1px solid var(--notion-dark-border)'
            }}>
              {aiResponse ? (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{aiResponse}</div>
              ) : (
                <div style={{ color: 'var(--notion-dark-text-secondary)' }}>
                  {selectedPage 
                    ? `I can help you edit "${selectedPage.title}". What would you like me to do with this content?`
                    : 'Select a page from the left to start editing, or tell me what you want to work on.'
                  }
                </div>
              )}
              {isAITyping && (
                <div className="voice-chat-typing" style={{ marginTop: '8px' }}>
                  <span></span><span></span><span></span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {selectedPage && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Quick Actions:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleEditPage('improve clarity and grammar')}
                    className="ai-action-btn"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    ✨ Improve
                  </button>
                  <button
                    onClick={() => handleEditPage('make it more professional')}
                    className="ai-action-btn"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    💼 Professional
                  </button>
                  <button
                    onClick={() => handleEditPage('make it more concise')}
                    className="ai-action-btn"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    📝 Concise
                  </button>
                </div>
              </div>
            )}

            {/* User Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={selectedPage ? "What would you like me to do with this content?" : "What would you like to edit?"}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--notion-dark-bg-tertiary)',
                  border: '1px solid var(--notion-dark-border)',
                  borderRadius: '6px',
                  color: 'var(--notion-dark-text)',
                  fontSize: '14px'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
              />
              <button
                onClick={handleAIChat}
                disabled={!userInput.trim() || isAITyping}
                className="notion-button"
                style={{ padding: '12px 16px' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
