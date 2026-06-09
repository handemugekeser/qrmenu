import { InsightSeverity } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const BOUNCE_THRESHOLD = 0.3;
const MIN_SAMPLE = 20;

export class BouncePointRule implements InsightRule {
  id = 'bounce_point';
  severity = InsightSeverity.IMPORTANT;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    const { sessionEndsByCategory, totalSessionEnds } = ctx.aggregates;
    if (totalSessionEnds < MIN_SAMPLE) return null;

    let topId: string | null = null;
    let topCount = 0;
    for (const [catId, count] of Object.entries(sessionEndsByCategory)) {
      if (count > topCount) {
        topCount = count;
        topId = catId;
      }
    }
    if (!topId) return null;

    const ratio = topCount / totalSessionEnds;
    if (ratio <= BOUNCE_THRESHOLD) return null;

    const category = (ctx.menu.categories || []).find((c) => c.id === topId);
    if (!category) return null;

    return {
      ruleId: this.id,
      severity: this.severity,
      rawData: {
        categoryId: topId,
        categoryName: category.name,
        bouncePercentage: Math.round(ratio * 1000) / 10,
      },
      actionType: 'edit_item',
      actionData: { categoryId: topId },
    };
  }
}
