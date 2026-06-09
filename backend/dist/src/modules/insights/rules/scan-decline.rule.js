"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanDeclineRule = void 0;
const client_1 = require("@prisma/client");
const DECLINE_THRESHOLD = -0.15;
class ScanDeclineRule {
    constructor() {
        this.id = 'scan_decline';
        this.severity = client_1.InsightSeverity.IMPORTANT;
    }
    evaluate(ctx) {
        if (ctx.weekly.length < 2)
            return null;
        const current = ctx.weekly[ctx.weekly.length - 1];
        const previous = ctx.weekly[ctx.weekly.length - 2];
        if (previous.totalScans === 0)
            return null;
        const delta = (current.totalScans - previous.totalScans) / previous.totalScans;
        if (delta > DECLINE_THRESHOLD)
            return null;
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
exports.ScanDeclineRule = ScanDeclineRule;
//# sourceMappingURL=scan-decline.rule.js.map