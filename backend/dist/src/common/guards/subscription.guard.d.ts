import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionPlan } from '@prisma/client';
export declare const PLAN_KEY = "required_plan";
export declare const RequirePlan: (...plans: SubscriptionPlan[]) => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare class SubscriptionGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
