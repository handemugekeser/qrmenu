export interface GeneratedInsight {
    title: string;
    body: string;
}
export declare class LlmClient {
    private readonly logger;
    private readonly client;
    private readonly model;
    constructor();
    generate(ruleId: string, rawData: Record<string, unknown>): Promise<GeneratedInsight>;
}
