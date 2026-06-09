"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageMismatchRule = void 0;
const client_1 = require("@prisma/client");
const LANG_KEY_MAP = {
    TR: client_1.Language.TR,
    EN: client_1.Language.EN,
    AR: client_1.Language.AR,
    tr: client_1.Language.TR,
    en: client_1.Language.EN,
    ar: client_1.Language.AR,
};
function menuLanguages(ctx) {
    const langs = new Set([ctx.business.defaultLang]);
    for (const cat of ctx.menu.categories || []) {
        for (const t of cat.translations || [])
            langs.add(t.language);
        for (const p of cat.products || []) {
            for (const t of p.translations || [])
                langs.add(t.language);
        }
    }
    return langs;
}
class LanguageMismatchRule {
    constructor() {
        this.id = 'language_mismatch';
        this.severity = client_1.InsightSeverity.IMPORTANT;
    }
    evaluate(ctx) {
        const supported = menuLanguages(ctx);
        const totals = {};
        let grand = 0;
        for (const day of ctx.daily) {
            const dist = day.languageDist || {};
            for (const [lang, n] of Object.entries(dist)) {
                totals[lang] = (totals[lang] || 0) + n;
                grand += n;
            }
        }
        if (grand === 0)
            return null;
        let dominantLang = null;
        let dominantCount = 0;
        for (const [lang, n] of Object.entries(totals)) {
            if (n > dominantCount) {
                dominantCount = n;
                dominantLang = lang;
            }
        }
        if (!dominantLang)
            return null;
        const normalized = LANG_KEY_MAP[dominantLang];
        if (normalized && supported.has(normalized))
            return null;
        const percentage = (dominantCount / grand) * 100;
        if (percentage <= 30)
            return null;
        return {
            ruleId: this.id,
            severity: this.severity,
            rawData: {
                dominantLang,
                missingLang: dominantLang,
                percentage: Math.round(percentage * 10) / 10,
            },
            actionType: 'add_translation',
            actionData: { language: dominantLang },
        };
    }
}
exports.LanguageMismatchRule = LanguageMismatchRule;
//# sourceMappingURL=language-mismatch.rule.js.map