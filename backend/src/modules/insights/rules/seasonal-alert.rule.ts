import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const STALE_DAYS = 60;

function seasonOf(d: Date): 'spring' | 'summer' | 'autumn' | 'winter' {
  const m = d.getUTCMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

export class SeasonalAlertRule implements InsightRule {
  id = 'seasonal_alert';
  severity = InsightSeverity.SUGGESTION;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    const lastUpdate = lastMenuUpdate(ctx);
    if (!lastUpdate) return null;

    const daysAgo = Math.floor((ctx.now.getTime() - lastUpdate.getTime()) / (24 * 60 * 60 * 1000));
    if (daysAgo < STALE_DAYS) return null;

    const currentSeason = seasonOf(ctx.now);
    const lastSeason = seasonOf(lastUpdate);
    if (currentSeason === lastSeason) return null;

    return {
      ruleId: this.id,
      severity: this.severity,
      rawData: {
        lastUpdate: lastUpdate.toISOString(),
        daysAgo,
        season: currentSeason,
      },
    };
  }
}

function lastMenuUpdate(ctx: RuleContext): Date | null {
  let max = ctx.menu.updatedAt;
  for (const cat of ctx.menu.categories || []) {
    if (cat.updatedAt > max) max = cat.updatedAt;
    for (const p of cat.products || []) {
      if (p.updatedAt > max) max = p.updatedAt;
    }
  }
  return max || null;
}
