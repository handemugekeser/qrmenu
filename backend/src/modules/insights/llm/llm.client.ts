import Anthropic from '@anthropic-ai/sdk';
import { Injectable, Logger } from '@nestjs/common';

import { PROMPTS, SYSTEM_PROMPT } from './prompts';

export interface GeneratedInsight {
  title: string;
  body: string;
}

@Injectable()
export class LlmClient {
  private readonly logger = new Logger(LlmClient.name);
  private readonly client: Anthropic;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY tanımlı değil. backend/.env dosyasına ANTHROPIC_API_KEY ekleyin.',
      );
    }
    this.client = new Anthropic({ apiKey });
    this.model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
  }

  async generate(ruleId: string, rawData: Record<string, unknown>): Promise<GeneratedInsight> {
    const promptFn = PROMPTS[ruleId];
    if (!promptFn) {
      throw new Error(`Bu kural için prompt tanımlı değil: ${ruleId}`);
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 400,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [promptFn(rawData)],
    });

    const cacheRead = response.usage.cache_read_input_tokens ?? 0;
    const cacheWrite = response.usage.cache_creation_input_tokens ?? 0;
    this.logger.debug(
      `LLM ${ruleId} usage in=${response.usage.input_tokens} out=${response.usage.output_tokens} cache_read=${cacheRead} cache_write=${cacheWrite}`,
    );

    const text = extractText(response.content);
    return parseTitleBody(text);
  }
}

function extractText(content: Anthropic.Messages.ContentBlock[]): string {
  for (const block of content) {
    if (block.type === 'text') return block.text;
  }
  return '';
}

function parseTitleBody(text: string): GeneratedInsight {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    throw new Error('LLM boş yanıt döndü.');
  }

  const title = lines[0];
  const body = lines.slice(1).join(' ').trim();
  if (!body) {
    throw new Error('LLM gövde döndürmedi.');
  }
  return { title, body };
}
