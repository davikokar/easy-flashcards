export type Timeframe = 'all' | 'month' | 'week';

export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'month', label: 'This month' },
  { value: 'week', label: 'Last 7 days' },
];

/**
 * The earliest `answeredAt` a timeframe includes, in the device's local time; null for all time.
 * A month starts at midnight on its 1st; a week is today plus the six calendar days before it.
 */
export function timeframeStart(timeframe: Timeframe, now: number): number | null {
  if (timeframe === 'all') {
    return null;
  }
  const date = new Date(now);
  if (timeframe === 'month') {
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6).getTime();
}
