import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { TrackEventDto } from './dto/track-event.dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    recordEvent(dto: TrackEventDto, userAgent?: string): Promise<{
        id: string;
        businessId: string;
        menuId: string | null;
        categoryId: string | null;
        userAgent: string | null;
        tableNumber: string | null;
        type: import(".prisma/client").$Enums.AnalyticsEventType;
        itemId: string | null;
        language: string | null;
        sessionId: string;
        timestamp: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    track(menuId: string, req: Request, tableNumber?: number): Promise<{
        id: string;
        createdAt: Date;
        menuId: string;
        deviceType: import(".prisma/client").$Enums.DeviceType;
        userAgent: string | null;
        ipAddress: string | null;
        tableNumber: number | null;
    }>;
    getSummary(menuId: string, userId: string): Promise<{
        total: number;
        last30Days: number;
        last7Days: number;
        byDevice: {
            device: import(".prisma/client").$Enums.DeviceType;
            count: number;
        }[];
        dailyViews: {
            date: string;
            count: number;
        }[];
    }>;
    getBusinessAnalytics(businessId: string, userId: string): Promise<{
        total: number;
        last30Days: number;
        byMenu: {
            menuId: string;
            menuName: string;
            count: number;
        }[];
    }>;
    private detectDevice;
}
