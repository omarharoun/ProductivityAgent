import { env } from './env';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
  };
}

export class OpenAIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.OPENAI_API_KEY || '';
    this.baseUrl = env.AI_BASE_URL || 'https://api.openai.com/v1';
  }

  async generateText(prompt: string, model: string = 'gpt-4o'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI generation error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async editText(text: string, instruction: string, model: string = 'gpt-4o'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional writing assistant. Edit the provided text according to the user\'s instructions. Be precise and maintain the original meaning while improving the text.'
            },
            {
              role: 'user',
              content: `Please ${instruction} the following text:\n\n"${text}"\n\nProvide only the edited version without explanations.`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('OpenAI editing error:', error);
      throw new Error('Failed to edit text with AI');
    }
  }

  async improveText(text: string, model: string = 'gpt-4o'): Promise<string> {
    return this.editText(text, 'improve the clarity, grammar, and flow of', model);
  }

  async summarizeText(text: string, model: string = 'gpt-4o'): Promise<string> {
    return this.editText(text, 'provide a concise summary of', model);
  }

  async rewriteText(text: string, tone: string, model: string = 'gpt-4o'): Promise<string> {
    return this.editText(text, `rewrite in a ${tone} tone`, model);
  }

  async generateIdeas(topic: string, model: string = 'gpt-4o'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a creative productivity assistant. Generate 3-5 brief, actionable ideas for the given topic. Be concise and practical.'
            },
            {
              role: 'user',
              content: `Generate ideas for: ${topic}`
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'No ideas generated';
    } catch (error) {
      console.error('OpenAI ideas generation error:', error);
      throw new Error('Failed to generate ideas');
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('OpenAI health check error:', error);
      return false;
    }
  }
}

export const openaiClient = new OpenAIClient();
