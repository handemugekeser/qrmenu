import { InsightSeverity, Language } from '@prisma/client';
import { InsightCandidate, InsightRule, RuleContext } from '../types';

const LANG_KEY_MAP: Record<string, Language> = {
  TR: Language.TR,
  EN: Language.EN,
  AR: Language.AR,
  tr: Language.TR,
  en: Language.EN,
  ar: Language.AR,
};

function menuLanguages(ctx: RuleContext): Set<Language> {
  const langs = new Set<Language>([ctx.business.defaultLang]);
  for (const cat of ctx.menu.categories || []) {
    for (const t of cat.translations || []) langs.add(t.language);
    for (const p of cat.products || []) {
      for (const t of p.translations || []) langs.add(t.language);
    }
  }
  return langs;
}

export class LanguageMismatchRule implements InsightRule {
  id = 'language_mismatch';
  severity = InsightSeverity.IMPORTANT;

  evaluate(ctx: RuleContext): InsightCandidate | null {
    const supported = menuLanguages(ctx);
    const totals: Record<string, number> = {};
    let grand = 0;
    for (const day of ctx.daily) {
      const dist = (day.languageDist as unknown as Record<string, number>) || {};
      for (const [lang, n] of Object.entries(dist)) {
        totals[lang] = (totals[lang] || 0) + n;
        grand += n;
      }
    }
    if (grand === 0) return null;

    let dominantLang: string | null = null;
    let dominantCount = 0;
    for (const [lang, n] of Object.entries(totals)) {
      if (n > dominantCount) {
        dominantCount = n;
        dominantLang = lang;
      }
    }
    if (!dominantLang) return null;

    const normalized = LANG_KEY_MAP[dominantLang];
    if (normalized && supported.has(normalized)) return null;

    const percentage = (dominantCount / grand) * 100;
    if (percentage <= 30) return null;

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
