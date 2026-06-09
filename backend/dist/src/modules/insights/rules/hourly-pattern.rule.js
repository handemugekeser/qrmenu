"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HourlyPatternRule = void 0;
const client_1 = require("@prisma/client");
const SPIKE_MULTIPLIER = 3;
class HourlyPatternRule {
    constructor() {
        this.id = 'hourly_pattern';
        this.severity = client_1.InsightSeverity.INFO;
    }
    evaluate(ctx) {
        if (ctx.weekly.length === 0)
            return null;
        const week = ctx.weekly[ctx.weekly.length - 1];
        const hourly = week.hourlyDist || [];
        const total = hourly.reduce((s, n) => s + n, 0);
        if (total === 0)
            return null;
        const avg = total / 24;
        let peakHour = -1;
        let peakValue = 0;
        for (let h = 0; h < 24; h++) {
            if (hourly[h] > peakValue) {
                peakValue = hourly[h];
                peakHour = h;
            }
        }
        if (peakHour < 0 || avg === 0)
            return null;
        const multiplier = peakValue / avg;
        if (multiplier < SPIKE_MULTIPLIER)
            return null;
        const topCategory = week.topCategories[0];
        if (!topCategory)
            return null;
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
exports.HourlyPatternRule = HourlyPatternRule;
//# sourceMappingURL=hourly-pattern.rule.js.map