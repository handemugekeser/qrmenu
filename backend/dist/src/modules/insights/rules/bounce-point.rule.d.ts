import { InsightCandidate, InsightRule, RuleContext } from '../types';
export declare class BouncePointRule implements InsightRule {
    id: string;
    severity: "IMPORTANT";
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
