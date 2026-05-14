import OpenAI from 'openai';
import type {
  CompletionRequest,
  CompletionResult,
  LLMClient,
  Message,
  ToolCall,
} from '../llm-client.js';

export class OpenAIClient implements LLMClient {
  readonly providerId = 'openai';
  readonly modelId: string;
  private client: OpenAI;

  constructor(modelId: string) {
    this.modelId = modelId;
    const headers = process.env.OPENAI_DEFAULT_HEADERS
      ? (JSON.parse(process.env.OPENAI_DEFAULT_HEADERS) as Record<string, string>)
      : undefined;
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
      defaultHeaders: headers,
    });
  }

  async complete(req: CompletionRequest): Promise<CompletionResult> {
    const started = Date.now();
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: req.system },
      ...req.messages.map(toOpenAI),
    ];
    const res = await this.client.chat.completions.create({
      model: this.modelId,
      messages,
      max_tokens: req.maxTokens ?? 1024,
      temperature: req.temperature ?? 0.3,
      tools: req.tools?.map((t) => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      })),
    });

    const choice = res.choices[0];
    const text = choice?.message.content ?? '';
    const toolCalls: ToolCall[] = (choice?.message.tool_calls ?? []).map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: safeParseJSON(tc.function.arguments),
    }));

    return {
      text,
      toolCalls,
      usage: {
        inputTokens: res.usage?.prompt_tokens ?? 0,
        outputTokens: res.usage?.completion_tokens ?? 0,
      },
      latencyMs: Date.now() - started,
      rawProvider: 'openai',
    };
  }
}

function toOpenAI(m: Message): OpenAI.ChatCompletionMessageParam {
  if (m.role === 'tool') {
    return { role: 'tool', content: m.content, tool_call_id: m.tool_call_id ?? '' };
  }
  if (m.role === 'assistant' && m.tool_calls?.length) {
    return {
      role: 'assistant',
      content: m.content,
      tool_calls: m.tool_calls.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
      })),
    };
  }
  if (m.role === 'system' || m.role === 'user' || m.role === 'assistant') {
    return { role: m.role, content: m.content };
  }
  return { role: 'user', content: m.content };
}

function safeParseJSON(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s) as Record<string, unknown>;
  } catch {
    return { __raw: s };
  }
}
