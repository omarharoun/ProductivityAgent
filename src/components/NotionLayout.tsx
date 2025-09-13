'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon } from './icons';

interface NotionLayoutProps {
  children: React.ReactNode;
}

export default function NotionLayout({ children }: NotionLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="notion-layout">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="top-bar">
          {sidebarCollapsed && (
            <button 
              className="sidebar-toggle-main"
              onClick={() => setSidebarCollapsed(false)}
            >
              <MenuIcon />
            </button>
          )}
        </div>
        
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}