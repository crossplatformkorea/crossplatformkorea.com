import { Id } from '../../../../convex/_generated/dataModel';

export interface Message {
  _id: Id<'messages'>;
  conversationId: Id<'conversations'>;
  role: 'user' | 'assistant';
  content: string;
  streamId?: string;
  isStreaming?: boolean;
  _creationTime: number;
}

export type GptModel = 
  // Flagship models
  | 'gpt-4.1'
  | 'gpt-4o' 
  | 'gpt-4o-audio-preview'
  | 'chatgpt-4o-latest'
  // Reasoning models
  | 'o4-mini'
  | 'o3'
  | 'o3-pro'
  | 'o3-mini'
  | 'o1'
  | 'o1-mini'
  | 'o1-pro'
  // Cost-optimized models
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'gpt-4o-mini'
  | 'gpt-4o-mini-audio-preview'
  | 'gpt-3.5-turbo';

export const GPT_MODELS: { value: GptModel; label: string; description: string; category: string }[] = [
  // Flagship models
  { value: 'gpt-4.1', label: 'GPT-4.1', description: 'Flagship GPT model for complex tasks', category: 'Flagship' },
  { value: 'gpt-4o', label: 'GPT-4o', description: 'Fast, intelligent, flexible GPT model', category: 'Flagship' },
  { value: 'gpt-4o-audio-preview', label: 'GPT-4o Audio', description: 'GPT-4o models capable of audio inputs and outputs', category: 'Flagship' },
  { value: 'chatgpt-4o-latest', label: 'ChatGPT-4o', description: 'GPT-4o model used in ChatGPT', category: 'Flagship' },
  
  // Reasoning models
  { value: 'o3', label: 'o3', description: 'Our most powerful reasoning model', category: 'Reasoning' },
  { value: 'o3-pro', label: 'o3-pro', description: 'Version of o3 with more compute for better responses', category: 'Reasoning' },
  { value: 'o1', label: 'o1', description: 'Previous full o-series reasoning model', category: 'Reasoning' },
  { value: 'o1-mini', label: 'o1-mini', description: 'A small model alternative to o1', category: 'Reasoning' },
  { value: 'o1-pro', label: 'o1-pro', description: 'Version of o1 with more compute for better responses', category: 'Reasoning' },
  
  // Cost-optimized models
  { value: 'o4-mini', label: 'o4-mini', description: 'Faster, more affordable reasoning model', category: 'Cost-optimized' },
  { value: 'o3-mini', label: 'o3-mini', description: 'A small model alternative to o3', category: 'Cost-optimized' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini', description: 'Balanced for intelligence, speed, and cost', category: 'Cost-optimized' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 nano', description: 'Fastest, most cost-effective GPT-4.1 model', category: 'Cost-optimized' },
  { value: 'gpt-4o-mini', label: 'GPT-4o mini', description: 'Fast, affordable small model for focused tasks', category: 'Cost-optimized' },
  { value: 'gpt-4o-mini-audio-preview', label: 'GPT-4o mini Audio', description: 'Smaller model capable of audio inputs and outputs', category: 'Cost-optimized' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and affordable', category: 'Cost-optimized' },
];
