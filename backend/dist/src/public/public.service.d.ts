import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { Language } from '@prisma/client';
import { Request } from 'express';
export declare class PublicMenuService {
    private prisma;
    private analytics;
    constructor(prisma: PrismaService, analytics: AnalyticsService);
    getBySlug(slug: string, lang: Language, req: Request, tableNumber?: number, menuId?: string): Promise<{
        business: {
            name: string;
            description: string;
            logoUrl: string;
            coverUrl: string;
            currency: string;
            phone: string;
            socialLinks: import("@prisma/client/runtime/library").JsonValue;
        };
        menu: any;
    }>;
    private applyTranslations;
}
