"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongDwellItemRule = void 0;
const client_1 = require("@prisma/client");
const DWELL_THRESHOLD_SEC = 45;
const MIN_SAMPLES = 5;
class LongDwellItemRule {
    constructor() {
        this.id = 'long_dwell_item';
        this.severity = client_1.InsightSeverity.INFO;
    }
    evaluate(ctx) {
        const dwell = ctx.aggregates.itemDwellMs;
        let topId = null;
        let topAvg = 0;
        for (const [itemId, { avgMs, samples }] of Object.entries(dwell)) {
            if (samples < MIN_SAMPLES)
                continue;
            if (avgMs > topAvg) {
                topAvg = avgMs;
                topId = itemId;
            }
        }
        if (!topId)
            return null;
        const avgSec = topAvg / 1000;
        if (avgSec < DWELL_THRESHOLD_SEC)
            return null;
        const product = findProduct(ctx, topId);
        if (!product)
            return null;
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
exports.LongDwellItemRule = LongDwellItemRule;
function findProduct(ctx, id) {
    for (const cat of ctx.menu.categories || []) {
        for (const p of cat.products || []) {
            if (p.id === id)
                return p;
        }
    }
    return null;
}
//# sourceMappingURL=long-dwell-item.rule.js.map