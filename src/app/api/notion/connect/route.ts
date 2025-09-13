import { NextRequest, NextResponse } from 'next/server';
import { createNotionClient } from '@/lib/notion';

export async function GET(req: NextRequest) {
  try {
    const notion = createNotionClient();
    
    // Test the connection by making a simple API call
    const response = await notion.users.me();
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: response.id,
        name: response.name,
        email: response.person?.email
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    
    if (action === 'test') {
      const notion = createNotionClient();
      const response = await notion.users.me();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Notion connection successful',
        user: {
          id: response.id,
          name: response.name,
          email: response.person?.email
        }
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
