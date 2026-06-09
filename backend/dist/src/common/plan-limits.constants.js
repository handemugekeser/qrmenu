"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = void 0;
const client_1 = require("@prisma/client");
exports.PLAN_LIMITS = {
    [client_1.SubscriptionPlan.FREE]: {
        maxBusinesses: 1,
        maxMenus: 1,
        maxCategories: 5,
        maxProducts: 20,
        analytics: false,
        customTheme: false,
        multiLanguage: false,
        tableQr: false,
    },
    [client_1.SubscriptionPlan.PRO]: {
        maxBusinesses: 3,
        maxMenus: 5,
        maxCategories: 20,
        maxProducts: 100,
        analytics: true,
        customTheme: true,
        multiLanguage: false,
        tableQr: true,
    },
    [client_1.SubscriptionPlan.PREMIUM]: {
        maxBusinesses: -1,
        maxMenus: -1,
        maxCategories: -1,
        maxProducts: -1,
        analytics: true,
        customTheme: true,
        multiLanguage: true,
        tableQr: true,
    },
};
//# sourceMappingURL=plan-limits.constants.js.map