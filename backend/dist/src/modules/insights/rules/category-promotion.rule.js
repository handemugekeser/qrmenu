"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryPromotionRule = void 0;
const client_1 = require("@prisma/client");
const DOMINANCE_RATIO = 2;
class CategoryPromotionRule {
    constructor() {
        this.id = 'category_promotion';
        this.severity = client_1.InsightSeverity.SUGGESTION;
    }
    evaluate(ctx) {
        if (ctx.weekly.length === 0)
            return null;
        const week = ctx.weekly[ctx.weekly.length - 1];
        if (week.topCategories.length < 2)
            return null;
        const sorted = [...week.topCategories].sort((a, b) => b.views - a.views);
        const leader = sorted[0];
        const runnerUp = sorted[1];
        if (runnerUp.views === 0)
            return null;
        const ratio = leader.views / runnerUp.views;
        if (ratio < DOMINANCE_RATIO)
            return null;
        const categories = (ctx.menu.categories || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
        const currentPosition = categories.findIndex((c) => c.id === leader.categoryId);
        if (currentPosition <= 0)
            return null;
        return {
            ruleId: this.id,
            severity: this.severity,
            rawData: {
                categoryId: leader.categoryId,
                categoryName: leader.name,
                currentPosition: currentPosition + 1,
                ratio: Math.round(ratio * 10) / 10,
            },
            actionType: 'reorder_category',
            actionData: { categoryId: leader.categoryId, targetPosition: 1 },
        };
    }
}
exports.CategoryPromotionRule = CategoryPromotionRule;
//# sourceMappingURL=category-promotion.rule.js.map