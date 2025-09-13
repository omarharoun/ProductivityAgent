'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, PlusIcon, FileIcon, DatabaseIcon, UserIcon } from './icons';

interface Page {
  id: string;
  title: string;
  icon?: any;
  lastEdited: string;
  parent: any;
}

interface Database {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user info
      const userResponse = await fetch('/api/notion/connect');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
        }
      }

      // Load pages
      const pagesResponse = await fetch('/api/notion/pages');
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        setPages(pagesData.pages || []);
      }

      // Load databases
      const dbResponse = await fetch('/api/notion/databases');
      if (dbResponse.ok) {
        const dbData = await dbResponse.json();
        setDatabases(dbData.databases || []);
      }
    } catch (error) {
      console.error('Failed to load sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isCollapsed) {
    return (
      <div className="sidebar collapsed">
        <button className="sidebar-toggle" onClick={onToggle}>
          <ChevronRightIcon />
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={onToggle}>
          <ChevronRightIcon />
        </button>
        
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              <UserIcon />
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              {user.email && <div className="user-email">{user.email}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="sidebar-section">
              <div className="section-header">
                <span>Pages</span>
                <button className="add-button">
                  <PlusIcon />
                </button>
              </div>
              <div className="page-list">
                {pages.map((page) => (
                  <Link key={page.id} href={`/page/${page.id}`} className="page-item">
                    <div className="page-icon">
                      {page.icon?.emoji || <FileIcon />}
                    </div>
                    <div className="page-info">
                      <div className="page-title">{page.title}</div>
                      <div className="page-date">{formatDate(page.lastEdited)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <div className="section-header">
                <span>Databases</span>
                <button className="add-button">
                  <PlusIcon />
                </button>
              </div>
              <div className="page-list">
                {databases.map((db) => (
                  <Link key={db.id} href={`/database/${db.id}`} className="page-item">
                    <div className="page-icon">
                      <DatabaseIcon />
                    </div>
                    <div className="page-info">
                      <div className="page-title">{db.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}