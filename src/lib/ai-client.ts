import { openaiClient } from './openai-client';

export interface AIResponse {
  response: string;
}

export class AIClient {
  constructor() {
    // OpenAI client is initialized in openai-client.ts
  }

  async generateText(prompt: string, model: string = 'gpt-4o'): Promise<string> {
    try {
      return await openaiClient.generateText(prompt, model);
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async editText(text: string, instruction: string, model: string = 'gpt-4o'): Promise<string> {
    try {
      return await openaiClient.editText(text, instruction, model);
    } catch (error) {
      console.error('AI editing error:', error);
      throw new Error('Failed to edit text with AI');
    }
  }

  async improveText(text: string, model: string = 'gpt-4o'): Promise<string> {
    return this.editText(text, 'improve the clarity and grammar of', model);
  }

  async summarizeText(text: string, model: string = 'gpt-4o'): Promise<string> {
    return this.editText(text, 'summarize briefly', model);
  }

  async rewriteText(text: string, tone: string, model: string = 'gpt-4o'): Promise<string> {
    return this.editText(text, `rewrite in ${tone} tone`, model);
  }

  async generateIdeas(topic: string, model: string = 'gpt-4o'): Promise<string> {
    try {
      return await openaiClient.generateIdeas(topic, model);
    } catch (error) {
      console.error('AI ideas generation error:', error);
      throw new Error('Failed to generate ideas');
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return await openaiClient.isHealthy();
    } catch (error) {
      console.error('AI health check error:', error);
      return false;
    }
  }
}

export const aiClient = new AIClient();