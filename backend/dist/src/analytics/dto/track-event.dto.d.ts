import { AnalyticsEventType } from '@prisma/client';
export declare class TrackEventDto {
    businessId: string;
    menuId?: string;
    type: AnalyticsEventType;
    itemId?: string;
    categoryId?: string;
    language?: string;
    sessionId: string;
    tableNumber?: string;
    metadata?: Record<string, any>;
}
