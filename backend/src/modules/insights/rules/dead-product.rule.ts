import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const MIN_WEEKS = 4;
const VIEW_FLOOR = 50;
const BOTTOM_PERCENTILE = 0.2;

export class DeadProductRule implements InsightRule {
  id = 'dead_product';
  severity = InsightSeverity.SUGGESTION;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    if (ctx.weekly.length < MIN_WEEKS) return null;

    const recent = ctx.weekly.slice(-MIN_WEEKS);
    const totals = new Map<string, { views: number; name: string; weeks: number }>();

    for (const w of recent) {
      for (const it of w.topItems) {
        const cur = totals.get(it.itemId);
        if (cur) {
          cur.views += it.views;
          cur.weeks++;
        } else {
          totals.set(it.itemId, { views: it.views, name: it.name, weeks: 1 });
        }
      }
    }

    const allProducts = collectProductIds(ctx);
    for (const id of allProducts.keys()) {
      if (!totals.has(id)) totals.set(id, { views: 0, name: allProducts.get(id)!, weeks: MIN_WEEKS });
    }

    if (totals.size === 0) return null;

    const sorted = [...totals.entries()].sort((a, b) => a[1].views - b[1].views);
    const cutoffIdx = Math.max(1, Math.floor(sorted.length * BOTTOM_PERCENTILE));
    const bottom = sorted.slice(0, cutoffIdx);

    for (const [itemId, data] of bottom) {
      if (data.views >= VIEW_FLOOR) continue;
      if (!allProducts.has(itemId)) continue;
      return {
        ruleId: this.id,
        severity: this.severity,
        rawData: {
          itemId,
          itemName: data.name || allProducts.get(itemId),
          totalViews: data.views,
          weeks: MIN_WEEKS,
        },
        actionType: 'edit_item',
        actionData: { itemId },
      };
    }

    return null;
  }
}

function collectProductIds(ctx: RuleContext): Map<string, string> {
  const map = new Map<string, string>();
  for (const cat of ctx.menu.categories || []) {
    for (const p of cat.products || []) map.set(p.id, p.name);
  }
  return map;
}
