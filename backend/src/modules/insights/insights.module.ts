import { Module } from '@nestjs/common';
import { InsightGeneratorService } from './insight-generator.service';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { InsightCacheStore, LlmClient, LlmInsightService } from './llm';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [InsightsController],
  providers: [
    InsightGeneratorService,
    InsightsService,
    LlmClient,
    InsightCacheStore,
    LlmInsightService,
  ],
  exports: [InsightGeneratorService, InsightsService, LlmInsightService],
})
export class InsightsModule {}
