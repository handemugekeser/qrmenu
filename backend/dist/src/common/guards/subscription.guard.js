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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGuard = exports.RequirePlan = exports.PLAN_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
exports.PLAN_KEY = 'required_plan';
const RequirePlan = (...plans) => Reflect.metadata(exports.PLAN_KEY, plans);
exports.RequirePlan = RequirePlan;
const planHierarchy = {
    [client_1.SubscriptionPlan.FREE]: 0,
    [client_1.SubscriptionPlan.PRO]: 1,
    [client_1.SubscriptionPlan.PREMIUM]: 2,
};
let SubscriptionGuard = class SubscriptionGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPlans = this.reflector.getAllAndOverride(exports.PLAN_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPlans || requiredPlans.length === 0)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return false;
        const userPlanLevel = planHierarchy[user.plan] ?? 0;
        const hasAccess = requiredPlans.some((plan) => userPlanLevel >= planHierarchy[plan]);
        if (!hasAccess) {
            throw new common_1.ForbiddenException(`This feature requires a ${requiredPlans[0]} plan or higher.`);
        }
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map