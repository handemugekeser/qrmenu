import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const SPIKE_MULTIPLIER = 3;

export class HourlyPatternRule implements InsightRule {
  id = 'hourly_pattern';
  severity = InsightSeverity.INFO;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    if (ctx.weekly.length === 0) return null;
    const week = ctx.weekly[ctx.weekly.length - 1];
    const hourly = week.hourlyDist || [];
    const total = hourly.reduce((s, n) => s + n, 0);
    if (total === 0) return null;

    const avg = total / 24;
    let peakHour = -1;
    let peakValue = 0;
    for (let h = 0; h < 24; h++) {
      if (hourly[h] > peakValue) {
        peakValue = hourly[h];
        peakHour = h;
      }
    }
    if (peakHour < 0 || avg === 0) return null;
    const multiplier = peakValue / avg;
    if (multiplier < SPIKE_MULTIPLIER) return null;

    const topCategory = week.topCategories[0];
    if (!topCategory) return null;

    const hourRange = `${String(peakHour).padStart(2, '0')}:00-${String((peakHour + 1) % 24).padStart(2, '0')}:00`;

    return {
      ruleId: this.id,
      severity: this.severity,
      rawData: {
        hourRange,
        categoryName: topCategory.name,
        multiplier: Math.round(multiplier * 10) / 10,
      },
    };
  }
}
