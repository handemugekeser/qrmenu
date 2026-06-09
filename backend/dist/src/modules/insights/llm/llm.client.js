"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LlmClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmClient = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const common_1 = require("@nestjs/common");
const prompts_1 = require("./prompts");
let LlmClient = LlmClient_1 = class LlmClient {
    constructor() {
        this.logger = new common_1.Logger(LlmClient_1.name);
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY tanımlı değil. backend/.env dosyasına ANTHROPIC_API_KEY ekleyin.');
        }
        this.client = new sdk_1.default({ apiKey });
        this.model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
    }
    async generate(ruleId, rawData) {
        const promptFn = prompts_1.PROMPTS[ruleId];
        if (!promptFn) {
            throw new Error(`Bu kural için prompt tanımlı değil: ${ruleId}`);
        }
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 400,
            system: [
                {
                    type: 'text',
                    text: prompts_1.SYSTEM_PROMPT,
                    cache_control: { type: 'ephemeral' },
                },
            ],
            messages: [promptFn(rawData)],
        });
        const cacheRead = response.usage.cache_read_input_tokens ?? 0;
        const cacheWrite = response.usage.cache_creation_input_tokens ?? 0;
        this.logger.debug(`LLM ${ruleId} usage in=${response.usage.input_tokens} out=${response.usage.output_tokens} cache_read=${cacheRead} cache_write=${cacheWrite}`);
        const text = extractText(response.content);
        return parseTitleBody(text);
    }
};
exports.LlmClient = LlmClient;
exports.LlmClient = LlmClient = LlmClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LlmClient);
function extractText(content) {
    for (const block of content) {
        if (block.type === 'text')
            return block.text;
    }
    return '';
}
function parseTitleBody(text) {
    const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    if (lines.length === 0) {
        throw new Error('LLM boş yanıt döndü.');
    }
    const title = lines[0];
    const body = lines.slice(1).join(' ').trim();
    if (!body) {
        throw new Error('LLM gövde döndürmedi.');
    }
    return { title, body };
}
//# sourceMappingURL=llm.client.js.map