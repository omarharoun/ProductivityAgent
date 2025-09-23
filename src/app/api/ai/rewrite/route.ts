import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';

export async function POST(req: NextRequest) {
  try {
    const { text, tone, model = 'gpt-4o' } = await req.json();

    if (!text || !tone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Text and tone are required' 
      }, { status: 400 });
    }

    const response = await aiClient.rewriteText(text, tone, model);

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
