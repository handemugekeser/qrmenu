import { Language } from '@prisma/client';
import { LanguageMismatchRule } from '../language-mismatch.rule';
import { fakeDaily, makeContext } from './test-helpers';

describe('LanguageMismatchRule', () => {
  const rule = new LanguageMismatchRule();

  it('flags when an unsupported language dominates traffic above 30%', () => {
    const ctx = makeContext({
      business: {
        ...makeContext().business,
        defaultLang: Language.TR,
      },
      menu: { ...makeContext().menu, categories: [] },
      daily: [
        fakeDaily({ languageDist: { TR: 30, DE: 70 } as any }),
      ],
    });
    const result = rule.evaluate(ctx);
    expect(result).not.toBeNull();
    expect(result?.ruleId).toBe('language_mismatch');
    expect(result?.rawData.dominantLang).toBe('DE');
    expect(result?.rawData.percentage).toBeGreaterThan(30);
  });

  it('does not flag when dominant language is already supported by menu', () => {
    const ctx = makeContext({
      business: { ...makeContext().business, defaultLang: Language.TR },
      daily: [fakeDaily({ languageDist: { TR: 80, EN: 20 } as any })],
    });
    expect(rule.evaluate(ctx)).toBeNull();
  });

  it('returns null when there is no traffic', () => {
    const ctx = makeContext({ daily: [] });
    expect(rule.evaluate(ctx)).toBeNull();
  });
});
