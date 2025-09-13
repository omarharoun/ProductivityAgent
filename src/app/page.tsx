import Link from 'next/link';
import NotionLayout from '@/components/NotionLayout';

export default function HomePage() {
  return (
    <NotionLayout>
      <div className="welcome-content">
        <div className="welcome-header">
          <h1>Life Productivity Planner Agent</h1>
          <p>Connect your Notion to plan, reflect, and write smarter with AI - now with a production-scale interface</p>
        </div>
        
        <div className="welcome-grid">
          <div className="welcome-card">
            <div className="card-icon">🚀</div>
            <h3>Production-Scale UI</h3>
            <p>Experience a professional Notion-like interface with advanced sidebar navigation, content rendering, and responsive design.</p>
          </div>
          
          <div className="welcome-card">
            <div className="card-icon">🔗</div>
            <h3>Notion Integration</h3>
            <p>Seamlessly connect to your Notion workspace and view all your pages, databases, and content in a familiar interface.</p>
            <Link href="/api/notion/connect">
              <button className="connect-button">Connect Notion</button>
            </Link>
          </div>
          
          <div className="welcome-card">
            <div className="card-icon">📊</div>
            <h3>Advanced Features</h3>
            <p>View pages with rich content rendering, browse databases in table format, and embed content with flexible options.</p>
            <Link href="/dashboard">
              <button className="dashboard-button">Open Dashboard</button>
            </Link>
          </div>
          
          <div className="welcome-card">
            <div className="card-icon">✨</div>
            <h3>What you can do</h3>
            <ul className="feature-list">
              <li>📝 Plan your week from tasks and goals</li>
              <li>💭 Reflect on your journal entries with mood and trends</li>
              <li>✍️ Rewrite text for tone and clarity</li>
              <li>🗂️ Organize content in a Notion-like interface</li>
              <li>📱 Access everything on mobile and desktop</li>
            </ul>
          </div>
        </div>
        
        <div className="welcome-footer">
          <p>Ready to experience the new interface?</p>
          <div className="action-buttons">
            <Link href="/dashboard">
              <button className="primary-action">Explore Dashboard</button>
            </Link>
            <Link href="/api/notion/connect">
              <button className="secondary-action">Test Connection</button>
            </Link>
          </div>
        </div>
      </div>
    </NotionLayout>
  );
}