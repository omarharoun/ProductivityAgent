import Link from 'next/link';
import { Suspense } from 'react';
import TaskBox from './components/TaskBox';

export default function HomePage() {
  return (
    <div className="app-container">
      <main className="main-content">
        <div className="notion-page">
          <div className="notion-header">
            <h1 className="notion-title">Life Productivity Planner Agent</h1>
            <p className="notion-subtitle">
              Connect your Notion to plan, reflect, and write smarter with AI.
            </p>
            <div className="row" style={{ gap: '12px' }}>
              <Link href="/api/notion/connect" className="notion-button">
                🔗 Connect Notion
              </Link>
              <Link href="/dashboard" className="notion-button-secondary">
                📊 Open Dashboard
              </Link>
            </div>
          </div>

          <div className="notion-grid">
            <div className="notion-card">
              <h3 className="notion-card-title">📝 Journal & Reflection</h3>
              <p className="notion-card-description">
                Analyze your journal entries for mood patterns, insights, and personal growth trends.
              </p>
              <Link href="/api/notion/databases?type=journal" className="notion-button">
                View Journal
              </Link>
            </div>

            <div className="notion-card">
              <h3 className="notion-card-title">✅ Task Management</h3>
              <p className="notion-card-description">
                Organize and prioritize your tasks with AI-powered suggestions and smart scheduling.
              </p>
              <Link href="/api/notion/databases?type=tasks" className="notion-button">
                View Tasks
              </Link>
            </div>

            <div className="notion-card">
              <h3 className="notion-card-title">🎯 Goal Tracking</h3>
              <p className="notion-card-description">
                Set, track, and achieve your goals with intelligent progress monitoring and insights.
              </p>
              <Link href="/api/notion/databases?type=goals" className="notion-button">
                View Goals
              </Link>
            </div>

            <div className="notion-card">
              <h3 className="notion-card-title">🤖 AI Assistant</h3>
              <p className="notion-card-description">
                Get personalized productivity insights and recommendations based on your data.
              </p>
              <button className="notion-button">
                Start Chat
              </button>
            </div>

            <div className="notion-card">
              <h3 className="notion-card-title">✍️ Text Rewriter</h3>
              <p className="notion-card-description">
                Improve your writing with AI-powered tone adjustment and clarity enhancement.
              </p>
              <button className="notion-button">
                Rewrite Text
              </button>
            </div>

            <div className="notion-card">
              <h3 className="notion-card-title">📈 Analytics</h3>
              <p className="notion-card-description">
                View detailed analytics and reports on your productivity patterns and progress.
              </p>
              <button className="notion-button">
                View Analytics
              </button>
            </div>
          </div>

          <TaskBox />

          <div style={{ marginTop: '48px', padding: '24px', background: 'var(--notion-dark-bg-secondary)', borderRadius: '8px', border: '1px solid var(--notion-dark-border)' }}>
            <h2 style={{ margin: '0 0 16px 0' }}>Quick Start</h2>
            <div className="stack">
              <div className="row" style={{ alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ background: 'var(--notion-accent)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Connect Notion</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>Link your Notion workspace to get started</p>
                </div>
              </div>
              <div className="row" style={{ alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ background: 'var(--notion-accent)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Explore Dashboard</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>View your tasks, goals, and journal entries</p>
                </div>
              </div>
              <div className="row" style={{ alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ background: 'var(--notion-accent)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Use AI Features</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: 'var(--notion-dark-text-secondary)' }}>Leverage AI for insights and productivity</p>
                </div>
              </div>
            </div>
          </div>

          <Suspense>
            <EnvironmentInfo />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function EnvironmentInfo() {
  const connected = false;
  return (
    <p style={{ color: 'var(--muted)' }}>
      Notion connected: {connected ? 'Yes' : 'No'}
    </p>
  );
}

