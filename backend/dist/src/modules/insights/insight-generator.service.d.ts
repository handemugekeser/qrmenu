import { PrismaService } from '../../prisma/prisma.service';
import { LlmInsightService } from './llm';
import { InsightRule } from './types';
export declare class InsightGeneratorService {
    private prisma;
    private llm;
    private rules;
    private readonly logger;
    constructor(prisma: PrismaService, llm: LlmInsightService, rules?: InsightRule[]);
    generateWeeklyInsights(now?: Date): Promise<{
        weekOf: Date;
        businesses: number;
        insights: number;
    }>;
    generateForBusiness(businessId: string, weekOf: Date, now?: Date): Promise<number>;
    private buildContext;
    private buildAggregates;
    private persist;
}
