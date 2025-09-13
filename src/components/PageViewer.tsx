'use client';

import { useState, useEffect } from 'react';

interface Block {
  id: string;
  type: string;
  [key: string]: any;
}

interface PageData {
  id: string;
  title: string;
  icon?: any;
  cover?: any;
  lastEdited: string;
  properties: any;
}

interface PageViewerProps {
  pageId: string;
}

export default function PageViewer({ pageId }: PageViewerProps) {
  const [page, setPage] = useState<PageData | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [pageId]);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/notion/page/${pageId}`);
      if (!response.ok) {
        throw new Error('Failed to load page');
      }
      
      const data = await response.json();
      setPage(data.page);
      setBlocks(data.blocks || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBlock = (block: Block): JSX.Element => {
    const { type, id } = block;
    
    switch (type) {
      case 'paragraph':
        return (
          <p key={id} className="block-paragraph">
            {renderRichText(block.paragraph?.rich_text)}
          </p>
        );
      
      case 'heading_1':
        return (
          <h1 key={id} className="block-heading-1">
            {renderRichText(block.heading_1?.rich_text)}
          </h1>
        );
      
      case 'heading_2':
        return (
          <h2 key={id} className="block-heading-2">
            {renderRichText(block.heading_2?.rich_text)}
          </h2>
        );
      
      case 'heading_3':
        return (
          <h3 key={id} className="block-heading-3">
            {renderRichText(block.heading_3?.rich_text)}
          </h3>
        );
      
      case 'bulleted_list_item':
        return (
          <li key={id} className="block-list-item">
            {renderRichText(block.bulleted_list_item?.rich_text)}
            {block.children && (
              <ul>
                {block.children.map((child: Block) => renderBlock(child))}
              </ul>
            )}
          </li>
        );
      
      case 'numbered_list_item':
        return (
          <li key={id} className="block-list-item">
            {renderRichText(block.numbered_list_item?.rich_text)}
            {block.children && (
              <ol>
                {block.children.map((child: Block) => renderBlock(child))}
              </ol>
            )}
          </li>
        );
      
      case 'to_do':
        return (
          <div key={id} className="block-todo">
            <input 
              type="checkbox" 
              checked={block.to_do?.checked || false}
              readOnly
            />
            <span className={block.to_do?.checked ? 'completed' : ''}>
              {renderRichText(block.to_do?.rich_text)}
            </span>
          </div>
        );
      
      case 'code':
        return (
          <pre key={id} className="block-code">
            <code className={`language-${block.code?.language || 'text'}`}>
              {renderRichText(block.code?.rich_text)}
            </code>
          </pre>
        );
      
      case 'quote':
        return (
          <blockquote key={id} className="block-quote">
            {renderRichText(block.quote?.rich_text)}
          </blockquote>
        );
      
      case 'divider':
        return <hr key={id} className="block-divider" />;
      
      case 'image':
        const imageUrl = block.image?.file?.url || block.image?.external?.url;
        return (
          <div key={id} className="block-image">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={block.image?.caption?.[0]?.plain_text || 'Image'}
              />
            )}
            {block.image?.caption && (
              <caption>{renderRichText(block.image.caption)}</caption>
            )}
          </div>
        );
      
      default:
        return (
          <div key={id} className="block-unsupported">
            <em>Unsupported block type: {type}</em>
          </div>
        );
    }
  };

  const renderRichText = (richText: any[] = []) => {
    return richText.map((text, index) => {
      const { annotations, plain_text } = text;
      let element = plain_text;
      
      if (annotations?.bold) element = <strong>{element}</strong>;
      if (annotations?.italic) element = <em>{element}</em>;
      if (annotations?.strikethrough) element = <del>{element}</del>;
      if (annotations?.underline) element = <u>{element}</u>;
      if (annotations?.code) element = <code className="inline-code">{element}</code>;
      
      if (text.href) {
        element = <a href={text.href} target="_blank" rel="noopener noreferrer">{element}</a>;
      }
      
      return <span key={index}>{element}</span>;
    });
  };

  const groupBlocks = (blocks: Block[]) => {
    const grouped: JSX.Element[] = [];
    let currentList: Block[] = [];
    let listType: 'bulleted' | 'numbered' | null = null;

    blocks.forEach((block, index) => {
      if (block.type === 'bulleted_list_item') {
        if (listType !== 'bulleted') {
          if (currentList.length > 0) {
            grouped.push(
              <ol key={`list-${grouped.length}`}>
                {currentList.map(renderBlock)}
              </ol>
            );
          }
          currentList = [];
          listType = 'bulleted';
        }
        currentList.push(block);
      } else if (block.type === 'numbered_list_item') {
        if (listType !== 'numbered') {
          if (currentList.length > 0) {
            grouped.push(
              <ul key={`list-${grouped.length}`}>
                {currentList.map(renderBlock)}
              </ul>
            );
          }
          currentList = [];
          listType = 'numbered';
        }
        currentList.push(block);
      } else {
        if (currentList.length > 0) {
          const ListTag = listType === 'numbered' ? 'ol' : 'ul';
          grouped.push(
            <ListTag key={`list-${grouped.length}`}>
              {currentList.map(renderBlock)}
            </ListTag>
          );
          currentList = [];
          listType = null;
        }
        grouped.push(renderBlock(block));
      }
    });

    if (currentList.length > 0) {
      const ListTag = listType === 'numbered' ? 'ol' : 'ul';
      grouped.push(
        <ListTag key={`list-${grouped.length}`}>
          {currentList.map(renderBlock)}
        </ListTag>
      );
    }

    return grouped;
  };

  if (loading) {
    return (
      <div className="page-viewer loading">
        <div className="loading-spinner">Loading page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-viewer error">
        <div className="error-message">
          <h3>Error loading page</h3>
          <p>{error}</p>
          <button onClick={loadPage}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-viewer">
      {page && (
        <div className="page-header">
          {page.cover && (
            <div 
              className="page-cover"
              style={{
                backgroundImage: `url(${page.cover.file?.url || page.cover.external?.url})`
              }}
            />
          )}
          <div className="page-title-section">
            {page.icon && (
              <div className="page-icon">
                {page.icon.emoji || '📄'}
              </div>
            )}
            <h1 className="page-title">{page.title}</h1>
          </div>
        </div>
      )}
      
      <div className="page-content">
        {groupBlocks(blocks)}
      </div>
    </div>
  );
}