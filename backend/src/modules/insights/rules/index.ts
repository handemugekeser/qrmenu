import { InsightRule } from '../types';
import { BouncePointRule } from './bounce-point.rule';
import { CategoryPromotionRule } from './category-promotion.rule';
import { DeadProductRule } from './dead-product.rule';
import { HourlyPatternRule } from './hourly-pattern.rule';
import { LanguageMismatchRule } from './language-mismatch.rule';
import { LongDwellItemRule } from './long-dwell-item.rule';
import { NewProductUnderperformingRule } from './new-product-underperforming.rule';
import { PriceIncreaseOpportunityRule } from './price-increase-opportunity.rule';
import { ScanDeclineRule } from './scan-decline.rule';
import { SeasonalAlertRule } from './seasonal-alert.rule';

export const ALL_RULES: InsightRule[] = [
  new LanguageMismatchRule(),
  new PriceIncreaseOpportunityRule(),
  new DeadProductRule(),
  new CategoryPromotionRule(),
  new HourlyPatternRule(),
  new SeasonalAlertRule(),
  new BouncePointRule(),
  new ScanDeclineRule(),
  new LongDwellItemRule(),
  new NewProductUnderperformingRule(),
];

export {
  BouncePointRule,
  CategoryPromotionRule,
  DeadProductRule,
  HourlyPatternRule,
  LanguageMismatchRule,
  LongDwellItemRule,
  NewProductUnderperformingRule,
  PriceIncreaseOpportunityRule,
  ScanDeclineRule,
  SeasonalAlertRule,
};
