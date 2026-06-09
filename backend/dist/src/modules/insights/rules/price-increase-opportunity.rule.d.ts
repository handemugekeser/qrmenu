import { InsightCandidate, InsightRule, RuleContext } from '../types';
export declare class PriceIncreaseOpportunityRule implements InsightRule {
    id: string;
    severity: "SUGGESTION";
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
