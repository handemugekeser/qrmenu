import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RenderedEmail } from './templates';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

export interface SendResult {
  ok: boolean;
  providerId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey?: string;
  private readonly from: string;
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('RESEND_API_KEY');
    this.from = this.config.get<string>('EMAIL_FROM') || 'Menusflow <notifications@menusflow.com>';
    this.enabled = Boolean(this.apiKey);
    if (!this.enabled) {
      this.logger.warn('RESEND_API_KEY is not set — email sending is disabled (logging only).');
    }
  }

  async send(params: SendEmailParams): Promise<SendResult> {
    if (!this.enabled) {
      this.logger.log(`[email:stub] to=${params.to} subject="${params.subject}"`);
      return { ok: true, providerId: 'stub' };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...(params.headers ?? {}),
        },
        body: JSON.stringify({
          from: this.from,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text,
          headers: params.headers,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.error(`Resend send failed (${res.status}): ${body}`);
        return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
      }

      const json = (await res.json()) as { id?: string };
      return { ok: true, providerId: json.id };
    } catch (err) {
      const message = (err as Error).message;
      this.logger.error(`Resend send threw: ${message}`);
      return { ok: false, error: message };
    }
  }

  async sendRendered(to: string, rendered: RenderedEmail, headers?: Record<string, string>) {
    return this.send({
      to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      headers,
    });
  }
}
