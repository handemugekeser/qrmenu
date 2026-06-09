import { Module } from '@nestjs/common';
import { InsightGeneratorService } from './insight-generator.service';

@Module({
  providers: [InsightGeneratorService],
  exports: [InsightGeneratorService],
})
export class InsightsModule {}
