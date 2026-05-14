import { AnthropicClient } from './clients/anthropic.js';
import { OpenAIClient } from './clients/openai.js';
import type { LLMClient } from './llm-client.js';

export type Task = 'classify' | 'content' | 'reasoning';
export type ConditionId = 'anthropic' | 'openai' | 'hybrid';

export interface Condition {
  id: ConditionId;
  label: string;
  models: Record<Task, () => LLMClient>;
}

export const CONDITIONS: Record<ConditionId, Condition> = {
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic baseline',
    models: {
      classify: () => new AnthropicClient('claude-haiku-4-5-20251001'),
      content: () => new AnthropicClient('claude-sonnet-4-6'),
      reasoning: () => new AnthropicClient('claude-opus-4-7'),
    },
  },
  openai: {
    id: 'openai',
    label: 'OpenAI via AI Foundry',
    models: {
      classify: () => new OpenAIClient('gpt-4o-mini'),
      content: () => new OpenAIClient('gpt-4o'),
      reasoning: () => new OpenAIClient('o3-mini'),
    },
  },
  hybrid: {
    id: 'hybrid',
    label: 'Hybrid (OpenAI classify, Anthropic content/reasoning)',
    models: {
      classify: () => new OpenAIClient('gpt-4o-mini'),
      content: () => new AnthropicClient('claude-sonnet-4-6'),
      reasoning: () => new AnthropicClient('claude-opus-4-7'),
    },
  },
};
