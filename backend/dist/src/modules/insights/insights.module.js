"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsModule = void 0;
const common_1 = require("@nestjs/common");
const insight_generator_service_1 = require("./insight-generator.service");
const insights_controller_1 = require("./insights.controller");
const insights_service_1 = require("./insights.service");
const llm_1 = require("./llm");
let InsightsModule = class InsightsModule {
};
exports.InsightsModule = InsightsModule;
exports.InsightsModule = InsightsModule = __decorate([
    (0, common_1.Module)({
        controllers: [insights_controller_1.InsightsController],
        providers: [
            insight_generator_service_1.InsightGeneratorService,
            insights_service_1.InsightsService,
            llm_1.LlmClient,
            llm_1.InsightCacheStore,
            llm_1.LlmInsightService,
        ],
        exports: [insight_generator_service_1.InsightGeneratorService, insights_service_1.InsightsService, llm_1.LlmInsightService],
    })
], InsightsModule);
//# sourceMappingURL=insights.module.js.map