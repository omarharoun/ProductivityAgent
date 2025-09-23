'use client';

import Link from 'next/link';
import { useState } from 'react';
import AIEditor from '../components/AIEditor';
import NotionAIEditor from '../components/NotionAIEditor';

export default function DashboardPage() {
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [aiEditorText, setAiEditorText] = useState('');
  const [showNotionEditor, setShowNotionEditor] = useState(false);

  const handleOpenAIEditor = (text: string = '') => {
    setAiEditorText(text);
    setShowAIEditor(true);
  };

  const handleSaveAIEditor = (text: string) => {
    setAiEditorText(text);
    setShowAIEditor(false);
    // Here you would typically save to Notion or your backend
    console.log('Saving AI edited text:', text);
  };
  return (
    <div className="app-container">
      <main className="main-content">
        <div className="notion-page">
          <div className="notion-header">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="notion-title">Dashboard</h1>
                <p className="notion-subtitle">Your productivity overview and workspace</p>
              </div>
              <Link href="/api/notion/connect" className="notion-button">
                🔗 Connect Notion
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="notion-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="notion-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: 'var(--notion-accent)' }}>12</h3>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>Active Tasks</p>
            </div>
            <div className="notion-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: 'var(--notion-accent)' }}>5</h3>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>Goals in Progress</p>
            </div>
            <div className="notion-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: 'var(--notion-accent)' }}>28</h3>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>Journal Entries</p>
            </div>
            <div className="notion-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '32px', margin: '0 0 8px 0', color: 'var(--notion-accent)' }}>85%</h3>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>Productivity Score</p>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="notion-grid">
            <div className="notion-card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="notion-card-title">📝 Recent Journal Entries</h3>
                <div className="row" style={{ gap: '8px' }}>
                  <button 
                    onClick={() => handleOpenAIEditor('Today I had a productive day working on the new project. I completed the initial design phase and started implementing the core features. The team meeting went well and we aligned on the next steps.')}
                    className="notion-button" 
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    🤖 AI Edit
                  </button>
                  <Link href="/api/notion/databases?type=journal" className="notion-button-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                    View All
                  </Link>
                </div>
              </div>
              <div className="stack">
                <div style={{ padding: '12px', background: 'var(--notion-dark-bg-tertiary)', borderRadius: '6px', border: '1px solid var(--notion-dark-border)' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Today&apos;s Reflection</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: 'var(--notion-dark-text-secondary)' }}>Had a productive day working on the new project...</p>
                </div>
                <div style={{ padding: '12px', background: 'var(--notion-dark-bg-tertiary)', borderRadius: '6px', border: '1px solid var(--notion-dark-border)' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Weekly Goals Review</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: 'var(--notion-dark-text-secondary)' }}>Completed 3 out of 5 planned tasks this week...</p>
                </div>
              </div>
            </div>

            <div className="notion-card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="notion-card-title">✅ Today&apos;s Tasks</h3>
                <Link href="/api/notion/databases?type=tasks" className="notion-button" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  View All
                </Link>
              </div>
              <div className="stack">
                <div className="row" style={{ alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" style={{ margin: '0' }} />
                  <span style={{ fontSize: '14px' }}>Review project proposal</span>
                </div>
                <div className="row" style={{ alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" style={{ margin: '0' }} />
                  <span style={{ fontSize: '14px' }}>Call with client at 2 PM</span>
                </div>
                <div className="row" style={{ alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" style={{ margin: '0' }} />
                  <span style={{ fontSize: '14px' }}>Update documentation</span>
                </div>
                <div className="row" style={{ alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked style={{ margin: '0' }} />
                  <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--notion-dark-text-tertiary)' }}>Morning standup</span>
                </div>
              </div>
            </div>

            <div className="notion-card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="notion-card-title">🎯 Current Goals</h3>
                <Link href="/api/notion/databases?type=goals" className="notion-button" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  View All
                </Link>
              </div>
              <div className="stack">
                <div style={{ padding: '12px', background: 'var(--notion-dark-bg-tertiary)', borderRadius: '6px', border: '1px solid var(--notion-dark-border)' }}>
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: '0', fontSize: '14px' }}>Complete Q1 Project</h4>
                    <span style={{ fontSize: '12px', color: 'var(--notion-accent)' }}>75%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--notion-dark-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', background: 'var(--notion-accent)', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div style={{ padding: '12px', background: 'var(--notion-dark-bg-tertiary)', borderRadius: '6px', border: '1px solid var(--notion-dark-border)' }}>
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: '0', fontSize: '14px' }}>Learn New Technology</h4>
                    <span style={{ fontSize: '12px', color: 'var(--notion-accent)' }}>40%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--notion-dark-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '40%', height: '100%', background: 'var(--notion-accent)', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* AI Assistant */}
              <div style={{ marginTop: '32px', padding: '24px', background: 'var(--notion-dark-bg-secondary)', borderRadius: '8px', border: '1px solid var(--notion-dark-border)' }}>
                <h2 style={{ margin: '0 0 16px 0' }}>🤖 AI Assistant</h2>
                <p style={{ margin: '0 0 16px 0', color: 'var(--notion-dark-text-secondary)' }}>
                  Edit your Notion content with AI assistance. Click below to start editing your pages and databases.
                </p>
                <button 
                  className="notion-button"
                  onClick={() => setShowNotionEditor(true)}
                  style={{ marginRight: '12px' }}
                >
                  ✏️ Edit Notion Content
                </button>
                <button 
                  className="notion-button-secondary"
                  onClick={() => setShowAIEditor(true)}
                >
                  📝 General AI Editor
                </button>
              </div>

              {/* AI Insights */}
              <div style={{ marginTop: '32px', padding: '24px', background: 'var(--notion-dark-bg-secondary)', borderRadius: '8px', border: '1px solid var(--notion-dark-border)' }}>
                <h2 style={{ margin: '0 0 16px 0' }}>📊 AI Insights</h2>
            <div className="stack">
              <div style={{ padding: '16px', background: 'var(--notion-dark-bg-tertiary)', borderRadius: '6px', border: '1px solid var(--notion-dark-border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Productivity Pattern</h4>
                <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>
                  You&apos;re most productive in the morning. Consider scheduling your most important tasks between 9-11 AM.
                </p>
              </div>
              <div style={{ padding: '16px', background: 'var(--notion-dark-bg-tertiary)', borderRadius: '6px', border: '1px solid var(--notion-dark-border)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Goal Progress</h4>
                <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>
                  You&apos;re ahead of schedule on your Q1 project. Great job! Consider adding a stretch goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

          {showAIEditor && (
            <AIEditor
              initialText={aiEditorText}
              onSave={handleSaveAIEditor}
              onClose={() => setShowAIEditor(false)}
            />
          )}

          {showNotionEditor && (
            <NotionAIEditor
              onClose={() => setShowNotionEditor(false)}
            />
          )}
        </div>
      );
    }

