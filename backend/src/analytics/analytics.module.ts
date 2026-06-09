import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AggregationService } from './aggregation.service';

@Module({
  providers: [AnalyticsService, AggregationService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService, AggregationService],
})
export class AnalyticsModule {}
