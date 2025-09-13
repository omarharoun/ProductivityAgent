'use client';

import { useState, useEffect } from 'react';

interface NotionEmbedProps {
  pageId: string;
  mode?: 'api' | 'iframe';
  height?: string;
  showTitle?: boolean;
}

export default function NotionEmbed({ 
  pageId, 
  mode = 'api', 
  height = '600px',
  showTitle = true 
}: NotionEmbedProps) {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'api') {
      loadPageData();
    } else {
      setLoading(false);
    }
  }, [pageId, mode]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/notion/page/${pageId}`);
      if (!response.ok) {
        throw new Error('Failed to load page for embedding');
      }
      
      const data = await response.json();
      setPageData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // API-based rendering
  if (mode === 'api') {
    if (loading) {
      return (
        <div className="notion-embed loading" style={{ height }}>
          <div className="embed-loading">Loading Notion content...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="notion-embed error" style={{ height }}>
          <div className="embed-error">
            <p>Failed to load Notion content</p>
            <button onClick={loadPageData}>Retry</button>
          </div>
        </div>
      );
    }

    return (
      <div className="notion-embed api-mode" style={{ height }}>
        {showTitle && pageData?.page?.title && (
          <div className="embed-header">
            <h3>{pageData.page.title}</h3>
          </div>
        )}
        <div className="embed-content">
          {pageData?.blocks?.map((block: any) => (
            <div key={block.id} className="embed-block">
              {renderEmbedBlock(block)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // iframe-based rendering (for public pages)
  const notionUrl = `https://notion.so/${pageId.replace(/-/g, '')}`;
  
  return (
    <div className="notion-embed iframe-mode" style={{ height }}>
      <iframe
        src={notionUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Notion Page"
        style={{ borderRadius: '8px' }}
      />
    </div>
  );
}

function renderEmbedBlock(block: any): JSX.Element {
  const { type } = block;
  
  switch (type) {
    case 'paragraph':
      return (
        <p className="embed-paragraph">
          {renderEmbedRichText(block.paragraph?.rich_text)}
        </p>
      );
    
    case 'heading_1':
      return (
        <h1 className="embed-heading-1">
          {renderEmbedRichText(block.heading_1?.rich_text)}
        </h1>
      );
    
    case 'heading_2':
      return (
        <h2 className="embed-heading-2">
          {renderEmbedRichText(block.heading_2?.rich_text)}
        </h2>
      );
    
    case 'heading_3':
      return (
        <h3 className="embed-heading-3">
          {renderEmbedRichText(block.heading_3?.rich_text)}
        </h3>
      );
    
    case 'bulleted_list_item':
      return (
        <li className="embed-list-item">
          {renderEmbedRichText(block.bulleted_list_item?.rich_text)}
        </li>
      );
    
    case 'to_do':
      return (
        <div className="embed-todo">
          <input 
            type="checkbox" 
            checked={block.to_do?.checked || false}
            readOnly
          />
          <span className={block.to_do?.checked ? 'completed' : ''}>
            {renderEmbedRichText(block.to_do?.rich_text)}
          </span>
        </div>
      );
    
    default:
      return (
        <div className="embed-unsupported">
          <em>Content block ({type})</em>
        </div>
      );
  }
}

function renderEmbedRichText(richText: any[] = []) {
  return richText.map((text, index) => {
    const { annotations, plain_text } = text;
    let element = plain_text;
    
    if (annotations?.bold) element = <strong>{element}</strong>;
    if (annotations?.italic) element = <em>{element}</em>;
    if (annotations?.code) element = <code>{element}</code>;
    
    return <span key={index}>{element}</span>;
  });
}