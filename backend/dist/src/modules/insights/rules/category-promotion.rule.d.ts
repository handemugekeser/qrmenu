import { InsightCandidate, InsightRule, RuleContext } from '../types';
export declare class CategoryPromotionRule implements InsightRule {
    id: string;
    severity: "SUGGESTION";
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
