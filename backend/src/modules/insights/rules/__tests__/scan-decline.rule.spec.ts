import { ScanDeclineRule } from '../scan-decline.rule';
import { fakeWeekly, makeContext } from './test-helpers';

describe('ScanDeclineRule', () => {
  const rule = new ScanDeclineRule();

  it('flags when week-over-week scans drop more than 15%', () => {
    const ctx = makeContext({
      weekly: [
        fakeWeekly({ totalScans: 1000, weekStart: new Date('2026-05-25') }),
        fakeWeekly({ totalScans: 800, weekStart: new Date('2026-06-01') }),
      ],
    });
    const result = rule.evaluate(ctx);
    expect(result).not.toBeNull();
    expect(result?.rawData.currentWeek).toBe(800);
    expect(result?.rawData.previousWeek).toBe(1000);
    expect(Number(result?.rawData.declinePct)).toBeLessThanOrEqual(-15);
  });

  it('does not flag for small declines', () => {
    const ctx = makeContext({
      weekly: [
        fakeWeekly({ totalScans: 1000 }),
        fakeWeekly({ totalScans: 950 }),
      ],
    });
    expect(rule.evaluate(ctx)).toBeNull();
  });

  it('returns null when fewer than two weeks of data', () => {
    const ctx = makeContext({ weekly: [fakeWeekly({ totalScans: 500 })] });
    expect(rule.evaluate(ctx)).toBeNull();
  });
});
