import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export type InsightStatusFilter = 'new' | 'viewed' | 'applied' | 'dismissed' | 'all';
export declare class InsightsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId: string, filter?: InsightStatusFilter): Promise<{
        items: {
            id: string;
            createdAt: Date;
            businessId: string;
            ruleId: string;
            severity: import(".prisma/client").$Enums.InsightSeverity;
            title: string;
            body: string;
            rawData: Prisma.JsonValue;
            actionType: string | null;
            actionData: Prisma.JsonValue | null;
            status: import(".prisma/client").$Enums.InsightStatus;
            weekOf: Date;
        }[];
        counts: {
            new: number;
            viewed: number;
            applied: number;
            dismissed: number;
        };
    }>;
    apply(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        ruleId: string;
        severity: import(".prisma/client").$Enums.InsightSeverity;
        title: string;
        body: string;
        rawData: Prisma.JsonValue;
        actionType: string | null;
        actionData: Prisma.JsonValue | null;
        status: import(".prisma/client").$Enums.InsightStatus;
        weekOf: Date;
    }>;
    dismiss(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        ruleId: string;
        severity: import(".prisma/client").$Enums.InsightSeverity;
        title: string;
        body: string;
        rawData: Prisma.JsonValue;
        actionType: string | null;
        actionData: Prisma.JsonValue | null;
        status: import(".prisma/client").$Enums.InsightStatus;
        weekOf: Date;
    }>;
    markViewed(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        ruleId: string;
        severity: import(".prisma/client").$Enums.InsightSeverity;
        title: string;
        body: string;
        rawData: Prisma.JsonValue;
        actionType: string | null;
        actionData: Prisma.JsonValue | null;
        status: import(".prisma/client").$Enums.InsightStatus;
        weekOf: Date;
    }>;
    private assertOwnership;
    private userBusinessIds;
    private statusCounts;
    private emptyCounts;
}
