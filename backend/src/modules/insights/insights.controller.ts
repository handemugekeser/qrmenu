import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionPlan } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePlan, SubscriptionGuard } from '../../common/guards/subscription.guard';
import { InsightStatusFilter, InsightsService } from './insights.service';

@Controller('insights')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@RequirePlan(SubscriptionPlan.PRO)
export class InsightsController {
  constructor(private insights: InsightsService) {}

  @Get()
  list(
    @CurrentUser('id') userId: string,
    @Query('status') status: InsightStatusFilter = 'new',
  ) {
    return this.insights.list(userId, status);
  }

  @Post(':id/apply')
  apply(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.insights.apply(userId, id);
  }

  @Post(':id/dismiss')
  dismiss(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.insights.dismiss(userId, id);
  }

  @Get(':id/view')
  view(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.insights.markViewed(userId, id);
  }
}
