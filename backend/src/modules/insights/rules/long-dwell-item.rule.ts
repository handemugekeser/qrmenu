import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const DWELL_THRESHOLD_SEC = 45;
const MIN_SAMPLES = 5;

export class LongDwellItemRule implements InsightRule {
  id = 'long_dwell_item';
  severity = InsightSeverity.INFO;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    const dwell = ctx.aggregates.itemDwellMs;
    let topId: string | null = null;
    let topAvg = 0;

    for (const [itemId, { avgMs, samples }] of Object.entries(dwell)) {
      if (samples < MIN_SAMPLES) continue;
      if (avgMs > topAvg) {
        topAvg = avgMs;
        topId = itemId;
      }
    }
    if (!topId) return null;

    const avgSec = topAvg / 1000;
    if (avgSec < DWELL_THRESHOLD_SEC) return null;

    const product = findProduct(ctx, topId);
    if (!product) return null;

    return {
      ruleId: this.id,
      severity: this.severity,
      rawData: {
        itemId: topId,
        itemName: product.name,
        avgDwellSec: Math.round(avgSec * 10) / 10,
      },
      actionType: 'edit_item',
      actionData: { itemId: topId },
    };
  }
}

function findProduct(ctx: RuleContext, id: string) {
  for (const cat of ctx.menu.categories || []) {
    for (const p of cat.products || []) {
      if (p.id === id) return p;
    }
  }
  return null;
}
