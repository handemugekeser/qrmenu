"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewProductUnderperformingRule = void 0;
const client_1 = require("@prisma/client");
const NEW_PRODUCT_AGE_DAYS = 14;
const UNDERPERFORM_RATIO = 0.5;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
class NewProductUnderperformingRule {
    constructor() {
        this.id = 'new_product_underperforming';
        this.severity = client_1.InsightSeverity.SUGGESTION;
    }
    evaluate(ctx) {
        if (ctx.weekly.length === 0)
            return null;
        const week = ctx.weekly[ctx.weekly.length - 1];
        const allViews = week.topItems.map((i) => i.views).filter((v) => v > 0);
        if (allViews.length === 0)
            return null;
        const avgViews = allViews.reduce((s, n) => s + n, 0) / allViews.length;
        const expected = avgViews;
        for (const cat of ctx.menu.categories || []) {
            for (const p of cat.products || []) {
                const ageMs = ctx.now.getTime() - new Date(p.createdAt).getTime();
                const ageDays = ageMs / MS_PER_DAY;
                if (ageDays > NEW_PRODUCT_AGE_DAYS || ageDays < 0)
                    continue;
                const views = ctx.aggregates.weeklyItemViews[p.id] ?? 0;
                if (expected === 0)
                    continue;
                const ratio = views / expected;
                if (ratio >= UNDERPERFORM_RATIO)
                    continue;
                return {
                    ruleId: this.id,
                    severity: this.severity,
                    rawData: {
                        itemId: p.id,
                        itemName: p.name,
                        age: Math.floor(ageDays),
                        viewsVsExpected: Math.round(ratio * 1000) / 10,
                    },
                    actionType: 'edit_item',
                    actionData: { itemId: p.id },
                };
            }
        }
        return null;
    }
}
exports.NewProductUnderperformingRule = NewProductUnderperformingRule;
//# sourceMappingURL=new-product-underperforming.rule.js.map