export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface Message {
  role: Role;
  content: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolDef {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface CompletionRequest {
  system: string;
  messages: Message[];
  tools?: ToolDef[];
  maxTokens?: number;
  temperature?: number;
}

export interface CompletionResult {
  text: string;
  toolCalls: ToolCall[];
  usage: { inputTokens: number; outputTokens: number };
  latencyMs: number;
  rawProvider: string;
}

export interface LLMClient {
  readonly providerId: string;
  readonly modelId: string;
  complete(req: CompletionRequest): Promise<CompletionResult>;
}
