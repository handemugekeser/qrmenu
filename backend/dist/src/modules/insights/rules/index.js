"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonalAlertRule = exports.ScanDeclineRule = exports.PriceIncreaseOpportunityRule = exports.NewProductUnderperformingRule = exports.LongDwellItemRule = exports.LanguageMismatchRule = exports.HourlyPatternRule = exports.DeadProductRule = exports.CategoryPromotionRule = exports.BouncePointRule = exports.ALL_RULES = void 0;
const bounce_point_rule_1 = require("./bounce-point.rule");
Object.defineProperty(exports, "BouncePointRule", { enumerable: true, get: function () { return bounce_point_rule_1.BouncePointRule; } });
const category_promotion_rule_1 = require("./category-promotion.rule");
Object.defineProperty(exports, "CategoryPromotionRule", { enumerable: true, get: function () { return category_promotion_rule_1.CategoryPromotionRule; } });
const dead_product_rule_1 = require("./dead-product.rule");
Object.defineProperty(exports, "DeadProductRule", { enumerable: true, get: function () { return dead_product_rule_1.DeadProductRule; } });
const hourly_pattern_rule_1 = require("./hourly-pattern.rule");
Object.defineProperty(exports, "HourlyPatternRule", { enumerable: true, get: function () { return hourly_pattern_rule_1.HourlyPatternRule; } });
const language_mismatch_rule_1 = require("./language-mismatch.rule");
Object.defineProperty(exports, "LanguageMismatchRule", { enumerable: true, get: function () { return language_mismatch_rule_1.LanguageMismatchRule; } });
const long_dwell_item_rule_1 = require("./long-dwell-item.rule");
Object.defineProperty(exports, "LongDwellItemRule", { enumerable: true, get: function () { return long_dwell_item_rule_1.LongDwellItemRule; } });
const new_product_underperforming_rule_1 = require("./new-product-underperforming.rule");
Object.defineProperty(exports, "NewProductUnderperformingRule", { enumerable: true, get: function () { return new_product_underperforming_rule_1.NewProductUnderperformingRule; } });
const price_increase_opportunity_rule_1 = require("./price-increase-opportunity.rule");
Object.defineProperty(exports, "PriceIncreaseOpportunityRule", { enumerable: true, get: function () { return price_increase_opportunity_rule_1.PriceIncreaseOpportunityRule; } });
const scan_decline_rule_1 = require("./scan-decline.rule");
Object.defineProperty(exports, "ScanDeclineRule", { enumerable: true, get: function () { return scan_decline_rule_1.ScanDeclineRule; } });
const seasonal_alert_rule_1 = require("./seasonal-alert.rule");
Object.defineProperty(exports, "SeasonalAlertRule", { enumerable: true, get: function () { return seasonal_alert_rule_1.SeasonalAlertRule; } });
exports.ALL_RULES = [
    new language_mismatch_rule_1.LanguageMismatchRule(),
    new price_increase_opportunity_rule_1.PriceIncreaseOpportunityRule(),
    new dead_product_rule_1.DeadProductRule(),
    new category_promotion_rule_1.CategoryPromotionRule(),
    new hourly_pattern_rule_1.HourlyPatternRule(),
    new seasonal_alert_rule_1.SeasonalAlertRule(),
    new bounce_point_rule_1.BouncePointRule(),
    new scan_decline_rule_1.ScanDeclineRule(),
    new long_dwell_item_rule_1.LongDwellItemRule(),
    new new_product_underperforming_rule_1.NewProductUnderperformingRule(),
];
//# sourceMappingURL=index.js.map