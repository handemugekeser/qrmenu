import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { InsightCacheStore } from './cache';
import { GeneratedInsight, LlmClient } from './llm.client';

export const FAILED_TITLE = '(öneri üretilemedi)';

@Injectable()
export class LlmInsightService {
  private readonly logger = new Logger(LlmInsightService.name);

  constructor(
    private readonly client: LlmClient,
    private readonly cache: InsightCacheStore,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Returns title+body for the given rule + rawData. Always succeeds: on LLM
   * error, returns a placeholder so the caller can persist a NEW insight that
   * the retry job will fix later.
   */
  async generateOrPlaceholder(
    ruleId: string,
    rawData: Record<string, unknown>,
  ): Promise<GeneratedInsight & { failed: boolean }> {
    const key = InsightCacheStore.keyOf(ruleId, rawData);
    const hit = await this.cache.get(key);
    if (hit) return { ...hit, failed: false };

    try {
      const generated = await this.client.generate(ruleId, rawData);
      await this.cache.set(key, ruleId, generated);
      return { ...generated, failed: false };
    } catch (err) {
      this.logger.error(
        `LLM generation failed for rule=${ruleId}: ${(err as Error).message}`,
      );
      return {
        title: FAILED_TITLE,
        body: JSON.stringify(rawData),
        failed: true,
      };
    }
  }

  /**
   * Daily retry job for insights whose LLM call failed during weekly generation.
   * Re-runs the prompt against current rawData and updates the record in place.
   */
  @Cron('15 3 * * *')
  async retryFailedInsights() {
    const failed = await this.prisma.insight.findMany({
      where: { status: 'NEW', title: FAILED_TITLE },
      take: 100,
      orderBy: { createdAt: 'asc' },
    });
    if (failed.length === 0) return { retried: 0, fixed: 0 };

    let fixed = 0;
    for (const insight of failed) {
      const rawData = insight.rawData as Prisma.JsonObject as Record<string, unknown>;
      try {
        const generated = await this.client.generate(insight.ruleId, rawData);
        const key = InsightCacheStore.keyOf(insight.ruleId, rawData);
        await this.cache.set(key, insight.ruleId, generated);
        await this.prisma.insight.update({
          where: { id: insight.id },
          data: { title: generated.title, body: generated.body },
        });
        fixed++;
      } catch (err) {
        this.logger.warn(
          `Retry failed for insight=${insight.id} rule=${insight.ruleId}: ${(err as Error).message}`,
        );
      }
    }
    this.logger.log(`Insight retry: ${fixed}/${failed.length} fixed`);
    return { retried: failed.length, fixed };
  }
}
