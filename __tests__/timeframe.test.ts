import { TIMEFRAMES, timeframeStart } from '../src/utils/timeframe';

describe('TIMEFRAMES', () => {
  it('lists all, month and week in that order, with no labels', () => {
    expect(TIMEFRAMES).toEqual(['all', 'month', 'week']);
  });
});

describe('timeframeStart', () => {
  it('has no start for all time', () => {
    const now = new Date(2026, 10, 18, 15, 30).getTime();

    expect(timeframeStart('all', now)).toBeNull();
  });

  it('starts the month at local midnight on its 1st', () => {
    const now = new Date(2026, 10, 18, 15, 30).getTime();

    expect(timeframeStart('month', now)).toBe(new Date(2026, 10, 1).getTime());
  });

  it('starts the month at the same instant on the 1st at midnight', () => {
    const now = new Date(2026, 10, 1, 0, 0, 0, 0).getTime();

    expect(timeframeStart('month', now)).toBe(now);
  });

  it('starts the week at local midnight six days before today', () => {
    const now = new Date(2026, 10, 18, 15, 30).getTime();

    expect(timeframeStart('week', now)).toBe(new Date(2026, 10, 12).getTime());
  });

  it('reaches back across a month boundary', () => {
    const now = new Date(2026, 2, 3, 9).getTime();

    expect(timeframeStart('week', now)).toBe(new Date(2026, 1, 25).getTime());
    expect(timeframeStart('month', now)).toBe(new Date(2026, 2, 1).getTime());
  });

  it('reaches back across a year boundary on 1 January', () => {
    const now = new Date(2026, 0, 1, 12).getTime();

    expect(timeframeStart('week', now)).toBe(new Date(2025, 11, 26).getTime());
    expect(timeframeStart('month', now)).toBe(new Date(2026, 0, 1).getTime());
  });

  it('includes today and the six calendar days before it', () => {
    const now = new Date(2026, 10, 18, 23, 59).getTime();
    const start = timeframeStart('week', now) as number;
    const days = [18, 17, 16, 15, 14, 13, 12].map(day => new Date(2026, 10, day, 12).getTime());

    expect(days.every(day => day >= start)).toBe(true);
    expect(new Date(2026, 10, 11, 23, 59).getTime()).toBeLessThan(start);
  });
});
