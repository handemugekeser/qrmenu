import { InsightStatusFilter, InsightsService } from './insights.service';
export declare class InsightsController {
    private insights;
    constructor(insights: InsightsService);
    list(userId: string, status?: InsightStatusFilter): Promise<{
        items: {
            id: string;
            createdAt: Date;
            businessId: string;
            ruleId: string;
            severity: import(".prisma/client").$Enums.InsightSeverity;
            title: string;
            body: string;
            rawData: import("@prisma/client/runtime/library").JsonValue;
            actionType: string | null;
            actionData: import("@prisma/client/runtime/library").JsonValue | null;
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
        rawData: import("@prisma/client/runtime/library").JsonValue;
        actionType: string | null;
        actionData: import("@prisma/client/runtime/library").JsonValue | null;
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
        rawData: import("@prisma/client/runtime/library").JsonValue;
        actionType: string | null;
        actionData: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.InsightStatus;
        weekOf: Date;
    }>;
    view(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        ruleId: string;
        severity: import(".prisma/client").$Enums.InsightSeverity;
        title: string;
        body: string;
        rawData: import("@prisma/client/runtime/library").JsonValue;
        actionType: string | null;
        actionData: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.InsightStatus;
        weekOf: Date;
    }>;
}
