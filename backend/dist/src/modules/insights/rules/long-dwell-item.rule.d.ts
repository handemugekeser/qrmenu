import { InsightCandidate, InsightRule, RuleContext } from '../types';
export declare class LongDwellItemRule implements InsightRule {
    id: string;
    severity: "INFO";
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
