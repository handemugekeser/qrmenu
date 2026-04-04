import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicMenuService } from './public.service';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],
  providers: [PublicMenuService],
  controllers: [PublicController],
})
export class PublicModule {}
