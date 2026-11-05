import {
  HISTORY_BADGE_MIN_Y,
  HISTORY_BADGE_OFFSET,
  HISTORY_COLUMN_WIDTH,
  HISTORY_Y_LABELLED,
  HISTORY_Y_TICKS,
  buildHistoryChart,
  historyChartXs,
  percentToY,
  smoothAreaPath,
  smoothLinePath,
  stackHistoryShares,
} from '../src/utils/historyChart';
import type { HistoryChartBox } from '../src/utils/historyChart';
import type { SessionHistoryEntry } from '../src/types';

// Plot rectangle: x 28..292 (264 wide), y 18..116 (98 high).
const BOX: HistoryChartBox = { width: 300, height: 120, left: 28, top: 18, right: 8, bottom: 4 };
const PLOT_LEFT = 28;
const PLOT_RIGHT = 292;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 116;

function entry(
  sessionId: string,
  shares: { ok: number; okeish: number; notOk: number },
  cardCount = 10,
  active = false,
): SessionHistoryEntry {
  const toCount = (share: number) => Math.round((share * cardCount) / 100);
  return {
    sessionId,
    startedAt: 1000,
    cardCount,
    tally: {
      okCount: toCount(shares.ok),
      okeishCount: toCount(shares.okeish),
      notOkCount: toCount(shares.notOk),
    },
    shares,
    rate: null,
    active,
  };
}

function numbersIn(path: string): number[] {
  return (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}

// One cubic per C segment: [x0, y0, c1x, c1y, c2x, c2y, x1, y1].
function cubicsOf(path: string): number[][] {
  const [x0, y0, ...rest] = numbersIn(path);
  const cubics: number[][] = [];
  let from = [x0, y0];
  for (let i = 0; i < rest.length; i += 6) {
    const segment = rest.slice(i, i + 6);
    cubics.push([...from, ...segment]);
    from = segment.slice(4);
  }
  return cubics;
}

function bezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

describe('stackHistoryShares', () => {
  it('stacks Ok, Okeish, Not ok and Unanswered in order, each at most 100', () => {
    const [stack] = stackHistoryShares([entry('a', { ok: 30, okeish: 20, notOk: 10 })]);

    expect(stack.okTop).toBeCloseTo(30);
    expect(stack.okeishTop).toBeCloseTo(50);
    expect(stack.answeredTop).toBeCloseTo(60);
    expect(stack.unansweredTop).toBe(100);
  });

  it('keeps the tops non-decreasing', () => {
    const stacks = stackHistoryShares([
      entry('a', { ok: 0, okeish: 0, notOk: 0 }),
      entry('b', { ok: 10, okeish: 0, notOk: 40 }),
      entry('c', { ok: 90, okeish: 5, notOk: 5 }),
    ]);

    for (const stack of stacks) {
      expect(stack.okTop).toBeLessThanOrEqual(stack.okeishTop);
      expect(stack.okeishTop).toBeLessThanOrEqual(stack.answeredTop);
      expect(stack.answeredTop).toBeLessThanOrEqual(stack.unansweredTop);
      expect(stack.unansweredTop).toBeLessThanOrEqual(100);
    }
  });

  it('answers 100 for a complete session', () => {
    const [stack] = stackHistoryShares([entry('a', { ok: 60, okeish: 30, notOk: 10 })]);

    expect(stack.answeredTop).toBe(100);
    expect(stack.unansweredTop).toBe(100);
  });

  it('leaves an active partial session below 100 with Unanswered up to 100', () => {
    const [stack] = stackHistoryShares([entry('a', { ok: 20, okeish: 10, notOk: 10 }, 10, true)]);

    expect(stack.answeredTop).toBeCloseTo(40);
    expect(stack.unansweredTop).toBe(100);
  });

  it('reads a session with no cards as all zeros, Unanswered included', () => {
    const [stack] = stackHistoryShares([entry('a', { ok: 0, okeish: 0, notOk: 0 }, 0)]);

    expect(stack).toEqual({ okTop: 0, okeishTop: 0, answeredTop: 0, unansweredTop: 0 });
  });

  it('clamps float accumulation past 100 and snaps a hair under 100 to 100', () => {
    const third = 100 / 3;
    const [over, under] = stackHistoryShares([
      entry('a', { ok: 60.00000000000001, okeish: 30, notOk: 10.00000000000001 }),
      entry('b', { ok: third, okeish: third, notOk: third }),
    ]);

    expect(over.answeredTop).toBe(100);
    expect(under.answeredTop).toBe(100);
  });

  it('treats negative and non-finite shares as 0', () => {
    const [stack] = stackHistoryShares([entry('a', { ok: NaN, okeish: -5, notOk: Infinity })]);

    expect(stack.okTop).toBe(0);
    expect(stack.okeishTop).toBe(0);
    expect(stack.answeredTop).toBe(0);
  });
});

describe('historyChartXs', () => {
  it('centres a single entry in the plot', () => {
    expect(historyChartXs(1, BOX)).toEqual([(PLOT_LEFT + PLOT_RIGHT) / 2]);
  });

  it('puts five entries at the centres of equal slots inside the plot', () => {
    const xs = historyChartXs(5, BOX);
    const slot = (PLOT_RIGHT - PLOT_LEFT) / 5;

    expect(xs).toHaveLength(5);
    xs.forEach((x, index) => expect(x).toBeCloseTo(PLOT_LEFT + slot * (index + 0.5)));
    expect(xs[0]).toBeGreaterThan(PLOT_LEFT);
    expect(xs[4]).toBeLessThan(PLOT_RIGHT);
  });

  it('returns nothing for no entries', () => {
    expect(historyChartXs(0, BOX)).toEqual([]);
  });
});

describe('percentToY', () => {
  it('puts 0 at the bottom of the plot and 100 at the top', () => {
    expect(percentToY(0, BOX)).toBe(PLOT_BOTTOM);
    expect(percentToY(100, BOX)).toBe(PLOT_TOP);
    expect(percentToY(50, BOX)).toBe((PLOT_TOP + PLOT_BOTTOM) / 2);
  });

  it('clamps values outside 0 to 100', () => {
    expect(percentToY(-20, BOX)).toBe(PLOT_BOTTOM);
    expect(percentToY(250, BOX)).toBe(PLOT_TOP);
  });
});

describe('smoothLinePath', () => {
  it('is empty for no points', () => {
    expect(smoothLinePath([])).toBe('');
  });

  it('is a lone move for one point', () => {
    expect(smoothLinePath([{ x: 10, y: 20 }])).toBe('M 10 20');
  });

  it('has one cubic per segment after the move', () => {
    const path = smoothLinePath([
      { x: 0, y: 10 },
      { x: 10, y: 20 },
      { x: 30, y: 5 },
    ]);

    expect(path.startsWith('M 0 10 ')).toBe(true);
    expect(path.match(/C/g)).toHaveLength(2);
  });

  it('uses horizontal tangents with the control x at the segment midpoint', () => {
    const path = smoothLinePath([
      { x: 0, y: 10 },
      { x: 10, y: 20 },
    ]);

    expect(path).toBe('M 0 10 C 5 10 5 20 10 20');
  });

  it('keeps each control point at the y of its own endpoint', () => {
    const [cubic] = cubicsOf(
      smoothLinePath([
        { x: 4, y: 90 },
        { x: 44, y: 12 },
      ]),
    );
    const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = cubic;

    expect(c1y).toBe(y0);
    expect(c2y).toBe(y1);
    expect(c1x).toBe((x0 + x1) / 2);
    expect(c2x).toBe((x0 + x1) / 2);
  });

  it('rounds coordinates to 0.01', () => {
    const path = smoothLinePath([
      { x: 0, y: 0 },
      { x: 1 / 3, y: 2 / 3 },
    ]);

    expect(path).toBe('M 0 0 C 0.17 0 0.17 0.67 0.33 0.67');
  });
});

describe('smoothAreaPath', () => {
  it('runs the upper edge forward, the lower edge back, and closes', () => {
    const path = smoothAreaPath(
      [
        { x: 0, y: 10 },
        { x: 10, y: 20 },
      ],
      [
        { x: 0, y: 50 },
        { x: 10, y: 50 },
      ],
    );

    expect(path).toBe('M 0 10 C 5 10 5 20 10 20 L 10 50 C 5 50 5 50 0 50 Z');
  });

  it('is empty when either edge is empty', () => {
    expect(smoothAreaPath([], [{ x: 0, y: 0 }])).toBe('');
    expect(smoothAreaPath([{ x: 0, y: 0 }], [])).toBe('');
  });
});

describe('buildHistoryChart geometry selection', () => {
  const shares = { ok: 40, okeish: 20, notOk: 10 };

  it('is empty for no entries', () => {
    const chart = buildHistoryChart([], BOX);

    expect(chart).toEqual({
      xs: [],
      slotWidth: 0,
      gridLines: [],
      bands: [],
      column: [],
      markers: [],
      guides: [],
      badge: null,
    });
  });

  it('draws a column and no bands for one entry', () => {
    const chart = buildHistoryChart([entry('a', shares)], BOX);

    expect(chart.bands).toEqual([]);
    expect(chart.column.map(rect => rect.key)).toEqual(['ok', 'okeish', 'notOk', 'unanswered']);
    for (const rect of chart.column) {
      expect(rect.width).toBe(HISTORY_COLUMN_WIDTH);
      expect(rect.x + rect.width / 2).toBe((PLOT_LEFT + PLOT_RIGHT) / 2);
    }
  });

  it('stacks the column from the plot bottom up to the plot top', () => {
    const chart = buildHistoryChart([entry('a', shares)], BOX);
    const [ok, okeish, notOk, unanswered] = chart.column;

    expect(ok.y + ok.height).toBeCloseTo(PLOT_BOTTOM);
    expect(okeish.y + okeish.height).toBeCloseTo(ok.y);
    expect(notOk.y + notOk.height).toBeCloseTo(okeish.y);
    expect(unanswered.y + unanswered.height).toBeCloseTo(notOk.y);
    expect(unanswered.y).toBeCloseTo(PLOT_TOP);
    expect(ok.height).toBeCloseTo(0.4 * (PLOT_BOTTOM - PLOT_TOP));
  });

  it('draws bands and no column for two or more entries', () => {
    const chart = buildHistoryChart([entry('a', shares), entry('b', shares)], BOX);

    expect(chart.column).toEqual([]);
    expect(chart.bands.map(band => band.key)).toEqual(['ok', 'okeish', 'notOk', 'unanswered']);
    for (const band of chart.bands) {
      expect(band.areaPath.startsWith('M ')).toBe(true);
      expect(band.areaPath.endsWith(' Z')).toBe(true);
    }
  });

  it('draws the Unanswered band as an area only', () => {
    const chart = buildHistoryChart([entry('a', shares), entry('b', shares)], BOX);
    const unanswered = chart.bands[3];

    expect(unanswered.linePath).toBe('');
    expect(unanswered.visible).toBe(false);
  });

  it('spans only the first to the last session centre', () => {
    const chart = buildHistoryChart([entry('a', shares), entry('b', shares)], BOX);
    const xsInPath = numbersIn(chart.bands[0].linePath).filter((_, index) => index % 2 === 0);

    expect(Math.min(...xsInPath)).toBeCloseTo(chart.xs[0], 1);
    expect(Math.max(...xsInPath)).toBeCloseTo(chart.xs[1], 1);
  });
});

describe('buildHistoryChart bands never cross', () => {
  const entries = [
    entry('a', { ok: 10, okeish: 20, notOk: 30 }),
    entry('b', { ok: 70, okeish: 5, notOk: 5 }),
    entry('c', { ok: 5, okeish: 5, notOk: 80 }),
    entry('d', { ok: 40, okeish: 40, notOk: 10 }),
  ];

  it('gives every line the same control x values in each segment', () => {
    const chart = buildHistoryChart(entries, BOX);
    const [ok, okeish, notOk] = chart.bands.map(band => cubicsOf(band.linePath));

    for (let i = 0; i < ok.length; i++) {
      for (const index of [0, 2, 4, 6]) {
        expect(okeish[i][index]).toBe(ok[i][index]);
        expect(notOk[i][index]).toBe(ok[i][index]);
      }
    }
  });

  it('keeps Ok below Okeish below Not ok at every sampled point of every segment', () => {
    const chart = buildHistoryChart(entries, BOX);
    const [ok, okeish, notOk] = chart.bands.map(band => cubicsOf(band.linePath));

    for (let i = 0; i < ok.length; i++) {
      for (let step = 0; step <= 10; step++) {
        const t = step / 10;
        const [okY, okeishY, notOkY] = [ok[i], okeish[i], notOk[i]].map(c =>
          bezier(c[1], c[3], c[5], c[7], t),
        );
        // Smaller y is higher on screen.
        expect(okY).toBeGreaterThanOrEqual(okeishY);
        expect(okeishY).toBeGreaterThanOrEqual(notOkY);
        expect(notOkY).toBeGreaterThanOrEqual(PLOT_TOP);
        expect(okY).toBeLessThanOrEqual(PLOT_BOTTOM);
      }
    }
  });
});

describe('buildHistoryChart markers and guides', () => {
  it('adds a marker per band only where that session has a share above 0', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 50, okeish: 0, notOk: 20 }), entry('b', { ok: 0, okeish: 30, notOk: 0 })],
      BOX,
    );

    expect(chart.markers.map(m => `${m.sessionId}:${m.key}`)).toEqual(['a:ok', 'a:notOk', 'b:okeish']);
  });

  it('puts a marker on its band top at the session x', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 50, okeish: 20, notOk: 0 }), entry('b', { ok: 10, okeish: 0, notOk: 0 })],
      BOX,
    );
    const okeish = chart.markers.find(m => m.key === 'okeish');

    expect(okeish?.x).toBe(chart.xs[0]);
    expect(okeish?.y).toBeCloseTo(percentToY(70, BOX));
  });

  it('flags only the last entry as latest', () => {
    const shares = { ok: 40, okeish: 30, notOk: 20 };
    const chart = buildHistoryChart([entry('a', shares), entry('b', shares), entry('c', shares)], BOX);

    expect(chart.markers.filter(m => m.latest).map(m => m.sessionId)).toEqual(['c', 'c', 'c']);
    expect(chart.guides.map(g => g.latest)).toEqual([false, false, true]);
    expect(chart.guides.map(g => g.x)).toEqual(chart.xs);
  });

  it('adds no markers for an entry with no answers', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 0, okeish: 0, notOk: 0 }), entry('b', { ok: 0, okeish: 0, notOk: 0 })],
      BOX,
    );

    expect(chart.markers).toEqual([]);
  });
});

describe('buildHistoryChart line visibility', () => {
  it('hides the line of a series that is 0 in every session', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 50, okeish: 0, notOk: 20 }), entry('b', { ok: 60, okeish: 0, notOk: 10 })],
      BOX,
    );

    expect(chart.bands.map(band => band.visible)).toEqual([true, false, true, false]);
  });

  it('shows a line when its series is above 0 in only one session', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 50, okeish: 0, notOk: 0 }), entry('b', { ok: 50, okeish: 10, notOk: 0 })],
      BOX,
    );

    expect(chart.bands[1].visible).toBe(true);
  });
});

describe('buildHistoryChart badge', () => {
  it('sits above the latest Ok marker', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 10, okeish: 0, notOk: 0 }), entry('b', { ok: 50, okeish: 20, notOk: 0 })],
      BOX,
    );
    const okMarker = chart.markers.find(m => m.sessionId === 'b' && m.key === 'ok');

    expect(chart.badge?.x).toBe(okMarker?.x);
    expect(chart.badge?.y).toBeCloseTo((okMarker?.y ?? 0) - HISTORY_BADGE_OFFSET);
  });

  it('is clamped so it does not rise above the top padding', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 100, okeish: 0, notOk: 0 }), entry('b', { ok: 100, okeish: 0, notOk: 0 })],
      BOX,
    );

    expect(chart.badge?.y).toBe(HISTORY_BADGE_MIN_Y);
  });

  it('anchors at the baseline when the latest session has no Ok answers', () => {
    const chart = buildHistoryChart(
      [entry('a', { ok: 50, okeish: 0, notOk: 0 }), entry('b', { ok: 0, okeish: 20, notOk: 0 })],
      BOX,
    );

    expect(chart.badge?.y).toBe(PLOT_BOTTOM - HISTORY_BADGE_OFFSET);
  });

  it('is present for a single entry, centred', () => {
    const chart = buildHistoryChart([entry('a', { ok: 50, okeish: 0, notOk: 0 })], BOX);

    expect(chart.badge?.x).toBe((PLOT_LEFT + PLOT_RIGHT) / 2);
  });
});

describe('buildHistoryChart grid', () => {
  it('has a line per tick, labelled at 0, 50 and 100 only', () => {
    const chart = buildHistoryChart([entry('a', { ok: 50, okeish: 0, notOk: 0 })], BOX);

    expect(chart.gridLines.map(line => line.value)).toEqual(HISTORY_Y_TICKS);
    expect(chart.gridLines.filter(line => line.labelled).map(line => line.value)).toEqual(
      HISTORY_Y_LABELLED,
    );
    expect(chart.gridLines[0].y).toBe(PLOT_BOTTOM);
    expect(chart.gridLines[4].y).toBe(PLOT_TOP);
  });
});

describe('buildHistoryChart degenerate boxes', () => {
  const entries = [
    entry('a', { ok: 50, okeish: 20, notOk: 10 }),
    entry('b', { ok: 0, okeish: 0, notOk: 0 }, 0),
    entry('c', { ok: 30, okeish: 30, notOk: 30 }),
  ];

  it('stays finite with a zero-size box', () => {
    const box = { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };

    const json = JSON.stringify(buildHistoryChart(entries, box));

    expect(json).not.toMatch(/null|NaN|Infinity/);
  });

  it('stays finite when the insets are larger than the box', () => {
    const json = JSON.stringify(buildHistoryChart(entries, { ...BOX, width: 10, height: 5 }));

    expect(json).not.toMatch(/null|NaN|Infinity/);
  });

  it('stays finite for one entry in a zero-width box', () => {
    const box = { width: 0, height: 120, left: 28, top: 18, right: 8, bottom: 4 };

    const json = JSON.stringify(buildHistoryChart([entries[0]], box));

    expect(json).not.toMatch(/null|NaN|Infinity/);
  });
});
