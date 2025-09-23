import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'gpt-4o' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prompt is required' 
      }, { status: 400 });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' 
      }, { status: 500 });
    }

    // Check if API key looks valid
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid OpenAI API key format. Please check your .env file and get a valid key from https://platform.openai.com/account/api-keys' 
      }, { status: 500 });
    }

    // For demo purposes, provide a fallback response if API key is invalid
    if (apiKey.includes('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')) {
      // This is a demo response when the API key is invalid
      const demoResponses: Record<string, string> = {
        'create a task': 'I can help you create tasks! Set up a valid OpenAI API key to get AI-powered task suggestions.',
        'help': 'I\'m your productivity assistant! Configure your OpenAI API key to unlock full AI capabilities.',
        'hello': 'Hello! I\'m ready to help with your productivity tasks once you set up your OpenAI API key.'
      };
      
      const lowerPrompt = prompt.toLowerCase();
      const demoResponse = demoResponses[lowerPrompt] || 
        `I understand you want help with "${prompt}". To get AI-powered assistance, please set up a valid OpenAI API key in your .env file.`;
      
      return NextResponse.json({ 
        success: true, 
        response: demoResponse
      });
    }

    // Direct OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a productivity assistant. Be concise, helpful, and focused on productivity tasks. Respond in 1-2 sentences maximum.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.error?.message || response.statusText;
      
      // Provide helpful error messages
      if (errorMessage.includes('Incorrect API key')) {
        errorMessage = 'Invalid OpenAI API key. Please check your .env file and get a valid key from https://platform.openai.com/account/api-keys';
      } else if (errorMessage.includes('insufficient_quota')) {
        errorMessage = 'OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing';
      } else if (errorMessage.includes('rate_limit_exceeded')) {
        errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.';
      }
      
      return NextResponse.json({ 
        success: false, 
        error: errorMessage
      }, { status: response.status });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({ 
      success: true, 
      response: aiResponse
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
