'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="stack">
        <div className="notion-header">
          <h1 style={{ fontSize: '20px', margin: '0 0 16px 0' }}>Productivity Agent</h1>
        </div>
        
        <nav className="stack">
          <Link href="/" className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
            🏠 Home
          </Link>
          <Link href="/dashboard" className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
            📊 Dashboard
          </Link>
          <Link href="/api/notion/connect" className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
            🔗 Connect Notion
          </Link>
        </nav>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--notion-dark-border)' }}>
          <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', color: 'var(--notion-dark-text-tertiary)' }}>
            Workspace
          </h3>
          <div className="stack">
            <Link href="/api/notion/databases?type=journal" className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              📝 Journal
            </Link>
            <Link href="/api/notion/databases?type=tasks" className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              ✅ Tasks
            </Link>
            <Link href="/api/notion/databases?type=goals" className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              🎯 Goals
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--notion-dark-border)' }}>
          <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', color: 'var(--notion-dark-text-tertiary)' }}>
            AI Features
          </h3>
          <div className="stack">
            <button className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              🤖 AI Assistant
            </button>
            <button className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              ✍️ Text Rewriter
            </button>
            <button className="notion-button-secondary" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




