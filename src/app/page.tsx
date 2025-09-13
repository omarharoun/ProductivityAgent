import Link from 'next/link';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="container">
      <div className="stack">
        <header className="stack">
          <h1>Life Productivity Planner Agent</h1>
          <p style={{ color: 'var(--muted)' }}>
            Connect your Notion to plan, reflect, and write smarter with AI.
          </p>
          <div className="row">
            <Link href="/api/notion/connect">
              <button>Connect Notion</button>
            </Link>
            <Link href="/dashboard">
              <button className="secondary">Open Dashboard</button>
            </Link>
          </div>
        </header>
        <section className="card stack">
          <h2>What you can do</h2>
          <ul>
            <li>Plan your week from tasks and goals</li>
            <li>Reflect on your journal entries with mood and trends</li>
            <li>Rewrite text for tone and clarity</li>
          </ul>
        </section>
        <Suspense>
          <EnvironmentInfo />
        </Suspense>
      </div>
    </main>
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

