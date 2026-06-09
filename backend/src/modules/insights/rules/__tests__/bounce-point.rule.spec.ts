import { BouncePointRule } from '../bounce-point.rule';
import { makeContext } from './test-helpers';

describe('BouncePointRule', () => {
  const rule = new BouncePointRule();
  const baseMenu = {
    ...makeContext().menu,
    categories: [
      {
        id: 'cat-a',
        menuId: 'menu-1',
        name: 'Burgers',
        description: null,
        imageUrl: null,
        sortOrder: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
        translations: [],
      },
    ],
  };

  it('flags a category that absorbs >30% of SESSION_END events', () => {
    const ctx = makeContext({
      menu: baseMenu as any,
      aggregates: {
        sessionEndsByCategory: { 'cat-a': 50, 'cat-b': 20, 'cat-c': 10 },
        totalSessionEnds: 80,
        itemDwellMs: {},
        weeklyItemViews: {},
      },
    });
    const result = rule.evaluate(ctx);
    expect(result).not.toBeNull();
    expect(result?.rawData.categoryId).toBe('cat-a');
    expect(Number(result?.rawData.bouncePercentage)).toBeGreaterThan(30);
  });

  it('does not flag when bounces are evenly distributed', () => {
    const ctx = makeContext({
      menu: baseMenu as any,
      aggregates: {
        sessionEndsByCategory: { 'cat-a': 25, 'cat-b': 25, 'cat-c': 25, 'cat-d': 25 },
        totalSessionEnds: 100,
        itemDwellMs: {},
        weeklyItemViews: {},
      },
    });
    expect(rule.evaluate(ctx)).toBeNull();
  });

  it('returns null when sample size is below the minimum', () => {
    const ctx = makeContext({
      menu: baseMenu as any,
      aggregates: {
        sessionEndsByCategory: { 'cat-a': 5 },
        totalSessionEnds: 5,
        itemDwellMs: {},
        weeklyItemViews: {},
      },
    });
    expect(rule.evaluate(ctx)).toBeNull();
  });
});
