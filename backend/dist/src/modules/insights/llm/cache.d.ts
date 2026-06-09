import { PrismaService } from '../../../prisma/prisma.service';
export interface CachedInsight {
    title: string;
    body: string;
}
export declare class InsightCacheStore {
    private readonly prisma;
    constructor(prisma: PrismaService);
    static keyOf(ruleId: string, rawData: Record<string, unknown>): string;
    get(key: string): Promise<CachedInsight | null>;
    set(key: string, ruleId: string, value: CachedInsight): Promise<void>;
}
