import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('menu/:menuId')
  getMenuSummary(@Param('menuId') menuId: string, @CurrentUser('id') userId: string) {
    return this.analyticsService.getSummary(menuId, userId);
  }

  @Get('business/:businessId')
  getBusinessAnalytics(@Param('businessId') businessId: string, @CurrentUser('id') userId: string) {
    return this.analyticsService.getBusinessAnalytics(businessId, userId);
  }
}
