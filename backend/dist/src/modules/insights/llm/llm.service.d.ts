import { PrismaService } from '../../../prisma/prisma.service';
import { InsightCacheStore } from './cache';
import { GeneratedInsight, LlmClient } from './llm.client';
export declare const FAILED_TITLE = "(\u00F6neri \u00FCretilemedi)";
export declare class LlmInsightService {
    private readonly client;
    private readonly cache;
    private readonly prisma;
    private readonly logger;
    constructor(client: LlmClient, cache: InsightCacheStore, prisma: PrismaService);
    generateOrPlaceholder(ruleId: string, rawData: Record<string, unknown>): Promise<GeneratedInsight & {
        failed: boolean;
    }>;
    retryFailedInsights(): Promise<{
        retried: number;
        fixed: number;
    }>;
}
