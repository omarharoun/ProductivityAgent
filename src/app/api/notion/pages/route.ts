import { NextRequest, NextResponse } from 'next/server';
import { createNotionClient } from '@/lib/notion';

export async function GET(req: NextRequest) {
  try {
    const notion = createNotionClient();
    
    // Get all pages accessible to the user
    const search = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    });
    
    const pages = search.results.map((page: any) => ({
      id: page.id,
      title: extractPageTitle(page),
      url: page.url,
      lastEdited: page.last_edited_time,
      created: page.created_time,
      icon: page.icon,
      cover: page.cover,
      parent: page.parent
    }));
    
    return NextResponse.json({ pages });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

function extractPageTitle(page: any): string {
  if (page.properties?.title?.title) {
    return page.properties.title.title
      .map((t: any) => t.plain_text)
      .join('') || 'Untitled';
  }
  
  // For pages without title property, try to get from other properties
  const properties = page.properties || {};
  const titleProperty = Object.values(properties).find((prop: any) => 
    prop.type === 'title'
  ) as any;
  
  if (titleProperty?.title) {
    return titleProperty.title
      .map((t: any) => t.plain_text)
      .join('') || 'Untitled';
  }
  
  return 'Untitled';
}