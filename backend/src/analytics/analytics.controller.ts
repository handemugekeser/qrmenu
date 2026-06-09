import { Body, Controller, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

import { AnalyticsService } from './analytics.service';
import { AggregationService } from './aggregation.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { TrackEventDto } from './dto/track-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private aggregationService: AggregationService,
  ) {}

  @Public()
  @Post('event')
  @HttpCode(204)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  async trackEvent(@Body() dto: TrackEventDto, @Req() req: Request) {
    const userAgent = (req.headers['user-agent'] as string) || undefined;
    await this.analyticsService.recordEvent(dto, userAgent);
  }

  @Get('menu/:menuId')
  getMenuSummary(@Param('menuId') menuId: string, @CurrentUser('id') userId: string) {
    return this.analyticsService.getSummary(menuId, userId);
  }

  @Get('business/:businessId')
  getBusinessAnalytics(@Param('businessId') businessId: string, @CurrentUser('id') userId: string) {
    return this.analyticsService.getBusinessAnalytics(businessId, userId);
  }

  @Post('snapshots/run')
  runDailySnapshots(@Body('date') date?: string) {
    return this.aggregationService.generateDailySnapshots(date ? new Date(date) : undefined);
  }
}
