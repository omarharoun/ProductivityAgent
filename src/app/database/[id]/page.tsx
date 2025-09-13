'use client';

import { useState, useEffect } from 'react';
import NotionLayout from '@/components/NotionLayout';

interface DatabasePageProps {
  params: {
    id: string;
  };
}

interface DatabaseEntry {
  id: string;
  properties: any;
  created_time: string;
  last_edited_time: string;
}

export default function DatabasePage({ params }: DatabasePageProps) {
  const [entries, setEntries] = useState<DatabaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDatabase();
  }, [params.id]);

  const loadDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/notion/query?databaseId=${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to load database');
      }
      
      const data = await response.json();
      setEntries(data.results || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyValue = (property: any) => {
    switch (property.type) {
      case 'title':
        return property.title?.map((t: any) => t.plain_text).join('') || '';
      case 'rich_text':
        return property.rich_text?.map((t: any) => t.plain_text).join('') || '';
      case 'number':
        return property.number?.toString() || '';
      case 'select':
        return property.select?.name || '';
      case 'multi_select':
        return property.multi_select?.map((s: any) => s.name).join(', ') || '';
      case 'date':
        return property.date?.start || '';
      case 'checkbox':
        return property.checkbox ? '✓' : '✗';
      case 'url':
        return property.url || '';
      case 'email':
        return property.email || '';
      case 'phone_number':
        return property.phone_number || '';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <NotionLayout>
        <div className="database-viewer loading">
          <div className="loading-spinner">Loading database...</div>
        </div>
      </NotionLayout>
    );
  }

  if (error) {
    return (
      <NotionLayout>
        <div className="database-viewer error">
          <div className="error-message">
            <h3>Error loading database</h3>
            <p>{error}</p>
            <button onClick={loadDatabase}>Retry</button>
          </div>
        </div>
      </NotionLayout>
    );
  }

  if (entries.length === 0) {
    return (
      <NotionLayout>
        <div className="database-viewer empty">
          <h2>Empty Database</h2>
          <p>This database has no entries yet.</p>
        </div>
      </NotionLayout>
    );
  }

  // Get all property keys from the first entry
  const propertyKeys = Object.keys(entries[0]?.properties || {});

  return (
    <NotionLayout>
      <div className="database-viewer">
        <div className="database-table">
          <table>
            <thead>
              <tr>
                {propertyKeys.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Created</th>
                <th>Last Edited</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  {propertyKeys.map((key) => (
                    <td key={key}>
                      {renderPropertyValue(entry.properties[key])}
                    </td>
                  ))}
                  <td>{new Date(entry.created_time).toLocaleDateString()}</td>
                  <td>{new Date(entry.last_edited_time).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </NotionLayout>
  );
}