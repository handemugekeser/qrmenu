import { Business, Category, DailySnapshot, InsightSeverity, Menu, Product, Translation } from '@prisma/client';
export type ProductWithTranslations = Product & {
    translations?: Translation[];
};
export type CategoryWithProducts = Category & {
    products?: ProductWithTranslations[];
    translations?: Translation[];
};
export type MenuWithContent = Menu & {
    categories?: CategoryWithProducts[];
};
export interface WeeklySnapshot {
    businessId: string;
    weekStart: Date;
    totalScans: number;
    uniqueSessions: number;
    topItems: Array<{
        itemId: string;
        name: string;
        views: number;
    }>;
    topCategories: Array<{
        categoryId: string;
        name: string;
        views: number;
    }>;
    languageDist: Record<string, number>;
    hourlyDist: number[];
    avgSessionMs: number;
}
export interface EventAggregates {
    sessionEndsByCategory: Record<string, number>;
    totalSessionEnds: number;
    itemDwellMs: Record<string, {
        avgMs: number;
        samples: number;
    }>;
    weeklyItemViews: Record<string, number>;
}
export interface RuleContext {
    business: Business;
    menu: MenuWithContent;
    daily: DailySnapshot[];
    weekly: WeeklySnapshot[];
    aggregates: EventAggregates;
    now: Date;
}
export interface InsightCandidate {
    ruleId: string;
    severity: InsightSeverity;
    rawData: Record<string, unknown>;
    actionType?: string;
    actionData?: Record<string, unknown>;
}
export interface InsightRule {
    id: string;
    severity: InsightSeverity;
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
