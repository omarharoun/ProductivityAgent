import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="container stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>
        <Link href="/api/notion/connect"><button>Connect Notion</button></Link>
      </div>
      <div className="row" style={{ gap: 20 }}>
        <section className="card" style={{ flex: 1 }}>
          <h3>Journal</h3>
          <p style={{ color: 'var(--muted)' }}>Fetched via API once connected.</p>
          <Link href="/api/notion/databases?type=journal">Load</Link>
        </section>
        <section className="card" style={{ flex: 1 }}>
          <h3>Tasks</h3>
          <p style={{ color: 'var(--muted)' }}>Fetched via API once connected.</p>
          <Link href="/api/notion/databases?type=tasks">Load</Link>
        </section>
        <section className="card" style={{ flex: 1 }}>
          <h3>Goals</h3>
          <p style={{ color: 'var(--muted)' }}>Fetched via API once connected.</p>
          <Link href="/api/notion/databases?type=goals">Load</Link>
        </section>
      </div>
    </main>
  );
}

