import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { AggregationService } from './aggregation.service';
import { TrackEventDto } from './dto/track-event.dto';
export declare class AnalyticsController {
    private analyticsService;
    private aggregationService;
    constructor(analyticsService: AnalyticsService, aggregationService: AggregationService);
    trackEvent(dto: TrackEventDto, req: Request): Promise<void>;
    getMenuSummary(menuId: string, userId: string): Promise<{
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
    runDailySnapshots(date?: string): Promise<{
        date: string;
        businesses: number;
    }>;
}
