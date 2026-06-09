import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const GROWTH_THRESHOLD = 0.2;
const MIN_WEEKS = 4;

export class PriceIncreaseOpportunityRule implements InsightRule {
  id = 'price_increase_opportunity';
  severity = InsightSeverity.SUGGESTION;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    if (ctx.weekly.length < MIN_WEEKS) return null;

    const recent = ctx.weekly.slice(-MIN_WEEKS);
    const latest = recent[recent.length - 1];
    const earliest = recent[0];

    const earliestMap = new Map(earliest.topItems.map((i) => [i.itemId, i.views]));
    const latestTop3 = latest.topItems.slice(0, 3);

    for (const item of latestTop3) {
      const earlierViews = earliestMap.get(item.itemId) || 0;
      if (earlierViews === 0) continue;
      const growth = (item.views - earlierViews) / earlierViews;
      if (growth <= GROWTH_THRESHOLD) continue;

      const product = findProduct(ctx, item.itemId);
      if (!product) continue;

      return {
        ruleId: this.id,
        severity: this.severity,
        rawData: {
          itemId: item.itemId,
          itemName: item.name || product.name,
          growthPct: Math.round(growth * 1000) / 10,
          currentPrice: Number(product.basePrice),
        },
        actionType: 'review_pricing',
        actionData: { itemId: item.itemId },
      };
    }

    return null;
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
