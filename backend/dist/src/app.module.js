"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const business_module_1 = require("./businesses/business.module");
const menu_module_1 = require("./menus/menu.module");
const category_module_1 = require("./categories/category.module");
const product_module_1 = require("./products/product.module");
const translation_module_1 = require("./translations/translation.module");
const qrcode_module_1 = require("./qrcodes/qrcode.module");
const analytics_module_1 = require("./analytics/analytics.module");
const public_module_1 = require("./public/public.module");
const subscription_module_1 = require("./subscriptions/subscription.module");
const upload_module_1 = require("./upload/upload.module");
const insights_module_1 = require("./modules/insights/insights.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            business_module_1.BusinessModule,
            menu_module_1.MenuModule,
            category_module_1.CategoryModule,
            product_module_1.ProductModule,
            translation_module_1.TranslationModule,
            qrcode_module_1.QrCodeModule,
            analytics_module_1.AnalyticsModule,
            public_module_1.PublicModule,
            subscription_module_1.SubscriptionModule,
            upload_module_1.UploadModule,
            insights_module_1.InsightsModule,
        ],
        providers: [
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.AllExceptionsFilter },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map