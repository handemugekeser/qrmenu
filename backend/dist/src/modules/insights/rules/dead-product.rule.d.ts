import { InsightCandidate, InsightRule, RuleContext } from '../types';
export declare class DeadProductRule implements InsightRule {
    id: string;
    severity: "SUGGESTION";
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
