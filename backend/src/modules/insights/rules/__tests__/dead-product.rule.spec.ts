import { DeadProductRule } from '../dead-product.rule';
import { fakeWeekly, makeContext } from './test-helpers';

function product(id: string, name: string) {
  return {
    id,
    categoryId: 'cat-1',
    name,
    description: null,
    imageUrl: null,
    basePrice: 50 as any,
    calories: null,
    allergens: [],
    isAvailable: true,
    isPopular: false,
    sortOrder: 0,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    translations: [],
  };
}

const menu = {
  ...makeContext().menu,
  categories: [
    {
      id: 'cat-1',
      menuId: 'menu-1',
      name: 'Mains',
      description: null,
      imageUrl: null,
      sortOrder: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [],
      products: [product('p1', 'Hit'), product('p2', 'Forgotten')],
    },
  ],
};

describe('DeadProductRule', () => {
  const rule = new DeadProductRule();

  it('flags a product with cumulative views below the floor across 4 weeks', () => {
    const ctx = makeContext({
      menu: menu as any,
      weekly: [
        fakeWeekly({ topItems: [{ itemId: 'p1', name: 'Hit', views: 400 }] }),
        fakeWeekly({ topItems: [{ itemId: 'p1', name: 'Hit', views: 420 }] }),
        fakeWeekly({ topItems: [{ itemId: 'p1', name: 'Hit', views: 380 }] }),
        fakeWeekly({ topItems: [{ itemId: 'p1', name: 'Hit', views: 460 }] }),
      ],
    });
    const result = rule.evaluate(ctx);
    expect(result).not.toBeNull();
    expect(result?.rawData.itemId).toBe('p2');
  });

  it('does not flag when all products meet the view floor', () => {
    const ctx = makeContext({
      menu: menu as any,
      weekly: [
        fakeWeekly({
          topItems: [
            { itemId: 'p1', name: 'Hit', views: 400 },
            { itemId: 'p2', name: 'Forgotten', views: 200 },
          ],
        }),
        fakeWeekly({
          topItems: [
            { itemId: 'p1', name: 'Hit', views: 410 },
            { itemId: 'p2', name: 'Forgotten', views: 210 },
          ],
        }),
        fakeWeekly({
          topItems: [
            { itemId: 'p1', name: 'Hit', views: 380 },
            { itemId: 'p2', name: 'Forgotten', views: 190 },
          ],
        }),
        fakeWeekly({
          topItems: [
            { itemId: 'p1', name: 'Hit', views: 460 },
            { itemId: 'p2', name: 'Forgotten', views: 220 },
          ],
        }),
      ],
    });
    expect(rule.evaluate(ctx)).toBeNull();
  });

  it('returns null when there are fewer than 4 weeks of snapshots', () => {
    const ctx = makeContext({
      menu: menu as any,
      weekly: [fakeWeekly(), fakeWeekly(), fakeWeekly()],
    });
    expect(rule.evaluate(ctx)).toBeNull();
  });
});
