import Anthropic from '@anthropic-ai/sdk';
import type {
  CompletionRequest,
  CompletionResult,
  LLMClient,
  Message,
  ToolCall,
} from '../llm-client.js';

export class AnthropicClient implements LLMClient {
  readonly providerId = 'anthropic';
  readonly modelId: string;
  private client: Anthropic;

  constructor(modelId: string) {
    this.modelId = modelId;
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
    });
  }

  async complete(req: CompletionRequest): Promise<CompletionResult> {
    const started = Date.now();
    const res = await this.client.messages.create({
      model: this.modelId,
      max_tokens: req.maxTokens ?? 1024,
      temperature: req.temperature ?? 0.3,
      system: req.system,
      messages: req.messages.map(toAnthropic),
      tools: req.tools?.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters as Anthropic.Tool.InputSchema,
      })),
    });

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    const toolCalls: ToolCall[] = res.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
      .map((b) => ({
        id: b.id,
        name: b.name,
        arguments: b.input as Record<string, unknown>,
      }));

    return {
      text,
      toolCalls,
      usage: {
        inputTokens: res.usage.input_tokens,
        outputTokens: res.usage.output_tokens,
      },
      latencyMs: Date.now() - started,
      rawProvider: 'anthropic',
    };
  }
}

function toAnthropic(m: Message): Anthropic.MessageParam {
  if (m.role === 'tool') {
    return {
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: m.tool_call_id ?? '',
          content: m.content,
        },
      ],
    };
  }
  if (m.role === 'assistant' && m.tool_calls?.length) {
    return {
      role: 'assistant',
      content: [
        ...(m.content ? [{ type: 'text' as const, text: m.content }] : []),
        ...m.tool_calls.map((tc) => ({
          type: 'tool_use' as const,
          id: tc.id,
          name: tc.name,
          input: tc.arguments,
        })),
      ],
    };
  }
  return { role: m.role === 'system' ? 'user' : m.role, content: m.content };
}
