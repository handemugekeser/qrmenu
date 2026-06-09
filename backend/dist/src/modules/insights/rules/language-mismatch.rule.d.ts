import { InsightCandidate, InsightRule, RuleContext } from '../types';
export declare class LanguageMismatchRule implements InsightRule {
    id: string;
    severity: "IMPORTANT";
    evaluate(ctx: RuleContext): InsightCandidate | null;
}
