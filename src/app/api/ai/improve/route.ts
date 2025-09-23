import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';

export async function POST(req: NextRequest) {
  try {
    const { text, model = 'gpt-4o' } = await req.json();

    if (!text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Text is required' 
      }, { status: 400 });
    }

    const response = await aiClient.improveText(text, model);

    return NextResponse.json({ 
      success: true, 
      response 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
