import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionPlan } from '@prisma/client';

export const PLAN_KEY = 'required_plan';
export const RequirePlan = (...plans: SubscriptionPlan[]) =>
  Reflect.metadata(PLAN_KEY, plans);

const planHierarchy = {
  [SubscriptionPlan.FREE]: 0,
  [SubscriptionPlan.PRO]: 1,
  [SubscriptionPlan.PREMIUM]: 2,
};

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPlans = this.reflector.getAllAndOverride<SubscriptionPlan[]>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPlans || requiredPlans.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const userPlanLevel = planHierarchy[user.plan] ?? 0;
    const hasAccess = requiredPlans.some(
      (plan) => userPlanLevel >= planHierarchy[plan],
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        `This feature requires a ${requiredPlans[0]} plan or higher.`,
      );
    }

    return true;
  }
}
