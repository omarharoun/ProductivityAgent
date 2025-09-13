import { NextRequest, NextResponse } from 'next/server';
import { createNotionClient } from '@/lib/notion';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notion = createNotionClient();
    const pageId = params.id;
    
    // Get page details
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // Get page content blocks
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    // Recursively get child blocks for nested content
    const enrichedBlocks = await Promise.all(
      blocks.results.map(async (block: any) => {
        if (block.has_children) {
          try {
            const children = await notion.blocks.children.list({
              block_id: block.id,
            });
            return { ...block, children: children.results };
          } catch (error) {
            return block;
          }
        }
        return block;
      })
    );
    
    return NextResponse.json({
      page: {
        id: page.id,
        title: extractPageTitle(page),
        url: (page as any).url,
        lastEdited: (page as any).last_edited_time,
        created: (page as any).created_time,
        icon: (page as any).icon,
        cover: (page as any).cover,
        parent: (page as any).parent,
        properties: (page as any).properties
      },
      blocks: enrichedBlocks
    });
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