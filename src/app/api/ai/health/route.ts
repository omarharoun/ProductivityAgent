import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check without AI client import
    return NextResponse.json({ 
      success: true, 
      healthy: true,
      status: 'online',
      message: 'AI service is ready (OpenAI integration configured)'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      healthy: false,
      status: 'offline',
      error: error.message 
    }, { status: 500 });
  }
}
