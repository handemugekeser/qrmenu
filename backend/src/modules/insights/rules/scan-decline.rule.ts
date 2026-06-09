import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const DECLINE_THRESHOLD = -0.15;

export class ScanDeclineRule implements InsightRule {
  id = 'scan_decline';
  severity = InsightSeverity.IMPORTANT;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    if (ctx.weekly.length < 2) return null;
    const current = ctx.weekly[ctx.weekly.length - 1];
    const previous = ctx.weekly[ctx.weekly.length - 2];

    if (previous.totalScans === 0) return null;
    const delta = (current.totalScans - previous.totalScans) / previous.totalScans;
    if (delta > DECLINE_THRESHOLD) return null;

    return {
      ruleId: this.id,
      severity: this.severity,
      rawData: {
        currentWeek: current.totalScans,
        previousWeek: previous.totalScans,
        declinePct: Math.round(delta * 1000) / 10,
      },
    };
  }
}
