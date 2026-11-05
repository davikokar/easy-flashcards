import type { SessionHistoryEntry } from '../types';

export const HISTORY_Y_TICKS = [0, 25, 50, 75, 100];
export const HISTORY_Y_LABELLED = [0, 50, 100];
/** Width of the single column drawn for a deck with one session. */
export const HISTORY_COLUMN_WIDTH = 24;
/** How far above the latest Ok marker the badge is centred. */
export const HISTORY_BADGE_OFFSET = 14;
/** The badge's centre never rises above this y, so it stays inside the top padding. */
export const HISTORY_BADGE_MIN_Y = 9;
/** Suggested insets: a left gutter for the y labels and top padding for the badge. */
export const HISTORY_CHART_INSETS = { left: 28, top: 18, right: 8, bottom: 4 };

/** The svg size (`width`, `height`) and the padding around the plot inside it, all in dp. */
export type HistoryChartBox = {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type HistoryPoint = { x: number; y: number };

/** Cumulative percentages (0-100) of one session, bottom to top. */
export type HistoryStack = {
  okTop: number;
  okeishTop: number;
  answeredTop: number;
  unansweredTop: number;
};

export type HistoryAnswerKey = 'ok' | 'okeish' | 'notOk';
export type HistoryBandKey = HistoryAnswerKey | 'unanswered';

export type HistoryGridLine = { value: number; y: number; labelled: boolean };

export type HistoryBand = {
  key: HistoryBandKey;
  areaPath: string;
  /** The band's top edge; '' for Unanswered, which is an area only. */
  linePath: string;
  /** Whether the line is drawn: the band has a share above 0 in some shown session. */
  visible: boolean;
};

export type HistoryColumnRect = {
  key: HistoryBandKey;
  x: number;
  width: number;
  y: number;
  height: number;
};

export type HistoryMarker = {
  key: HistoryAnswerKey;
  sessionId: string;
  x: number;
  y: number;
  latest: boolean;
};

export type HistoryGuide = { x: number; latest: boolean };

export type HistoryChartGeometry = {
  xs: number[];
  slotWidth: number;
  gridLines: HistoryGridLine[];
  /** Smooth bands, for 2 or more entries. */
  bands: HistoryBand[];
  /** One stacked column, for exactly 1 entry. */
  column: HistoryColumnRect[];
  markers: HistoryMarker[];
  guides: HistoryGuide[];
  /** Where the badge for the latest session is centred; null with no entries. */
  badge: { x: number; y: number } | null;
};

const BAND_KEYS: HistoryBandKey[] = ['ok', 'okeish', 'notOk', 'unanswered'];
const ANSWER_KEYS: HistoryAnswerKey[] = ['ok', 'okeish', 'notOk'];
// Float sums of shares can land a hair under 100 for a complete session.
const SNAP_TO_FULL = 1e-9;

function finite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function round(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function clampPercent(value: number, min: number): number {
  const clamped = Math.min(100, Math.max(min, finite(value)));
  return clamped > 100 - SNAP_TO_FULL ? 100 : clamped;
}

// The plot rectangle inside the box; never inverted, so a tiny box collapses to zero size.
function plotRect(box: HistoryChartBox) {
  const left = finite(box.left);
  const top = finite(box.top);
  const right = Math.max(left, finite(box.width) - finite(box.right));
  const bottom = Math.max(top, finite(box.height) - finite(box.bottom));
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

/** 0 is the bottom of the plot and 100 the top; values outside are clamped. */
export function percentToY(percent: number, box: HistoryChartBox): number {
  const plot = plotRect(box);
  const clamped = Math.min(100, Math.max(0, finite(percent)));
  return plot.bottom - (clamped / 100) * plot.height;
}

/** The centre of each of `count` equal slots across the plot width. */
export function historyChartXs(count: number, box: HistoryChartBox): number[] {
  if (count <= 0) {
    return [];
  }
  const plot = plotRect(box);
  const slotWidth = plot.width / count;
  return Array.from({ length: count }, (_, index) => plot.left + slotWidth * (index + 0.5));
}

/** Each entry's cumulative Ok, Okeish, answered and Unanswered tops, clamped and non-decreasing. */
export function stackHistoryShares(entries: SessionHistoryEntry[]): HistoryStack[] {
  return entries.map(entry => {
    if (entry.cardCount <= 0) {
      return { okTop: 0, okeishTop: 0, answeredTop: 0, unansweredTop: 0 };
    }
    const okTop = clampPercent(entry.shares.ok, 0);
    const okeishTop = clampPercent(okTop + entry.shares.okeish, okTop);
    const answeredTop = clampPercent(okeishTop + entry.shares.notOk, okeishTop);
    return { okTop, okeishTop, answeredTop, unansweredTop: 100 };
  });
}

// Horizontal tangents: the same x control points for every series keep stacked edges apart.
function curveSegments(points: HistoryPoint[]): string[] {
  const segments: string[] = [];
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const midX = round(from.x + (to.x - from.x) / 2);
    segments.push(
      `C ${midX} ${round(from.y)} ${midX} ${round(to.y)} ${round(to.x)} ${round(to.y)}`,
    );
  }
  return segments;
}

/** `M x y` then one cubic per segment; '' for no points. Coordinates are rounded to 0.01. */
export function smoothLinePath(points: HistoryPoint[]): string {
  if (points.length === 0) {
    return '';
  }
  return [`M ${round(points[0].x)} ${round(points[0].y)}`, ...curveSegments(points)].join(' ');
}

/** The upper edge forward, then the lower edge backward, closed; '' if either is empty. */
export function smoothAreaPath(upper: HistoryPoint[], lower: HistoryPoint[]): string {
  if (upper.length === 0 || lower.length === 0) {
    return '';
  }
  const back = [...lower].reverse();
  return [
    smoothLinePath(upper),
    `L ${round(back[0].x)} ${round(back[0].y)}`,
    ...curveSegments(back),
    'Z',
  ].join(' ');
}

function bandRange(stack: HistoryStack, key: HistoryBandKey): { lower: number; upper: number } {
  switch (key) {
    case 'ok':
      return { lower: 0, upper: stack.okTop };
    case 'okeish':
      return { lower: stack.okTop, upper: stack.okeishTop };
    case 'notOk':
      return { lower: stack.okeishTop, upper: stack.answeredTop };
    default:
      return { lower: stack.answeredTop, upper: stack.unansweredTop };
  }
}

const EMPTY_GEOMETRY: HistoryChartGeometry = {
  xs: [],
  slotWidth: 0,
  gridLines: [],
  bands: [],
  column: [],
  markers: [],
  guides: [],
  badge: null,
};

/** Everything the chart draws, in svg coordinates; the entries are oldest first. */
export function buildHistoryChart(
  entries: SessionHistoryEntry[],
  box: HistoryChartBox,
): HistoryChartGeometry {
  if (entries.length === 0) {
    return EMPTY_GEOMETRY;
  }

  const plot = plotRect(box);
  const xs = historyChartXs(entries.length, box);
  const stacks = stackHistoryShares(entries);
  const lastIndex = entries.length - 1;
  const rangesOf = (key: HistoryBandKey) => stacks.map(stack => bandRange(stack, key));
  const pointsOf = (values: number[]) =>
    values.map((value, index) => ({ x: xs[index], y: percentToY(value, box) }));

  const gridLines = HISTORY_Y_TICKS.map(value => ({
    value,
    y: percentToY(value, box),
    labelled: HISTORY_Y_LABELLED.includes(value),
  }));

  const bands: HistoryBand[] = [];
  const column: HistoryColumnRect[] = [];
  if (entries.length === 1) {
    const width = Math.min(HISTORY_COLUMN_WIDTH, plot.width);
    for (const key of BAND_KEYS) {
      const { lower, upper } = bandRange(stacks[0], key);
      const y = percentToY(upper, box);
      column.push({ key, x: xs[0] - width / 2, width, y, height: percentToY(lower, box) - y });
    }
  } else {
    for (const key of BAND_KEYS) {
      const ranges = rangesOf(key);
      const upper = pointsOf(ranges.map(range => range.upper));
      const lower = pointsOf(ranges.map(range => range.lower));
      const isAnswer = key !== 'unanswered';
      bands.push({
        key,
        areaPath: smoothAreaPath(upper, lower),
        linePath: isAnswer ? smoothLinePath(upper) : '',
        visible: isAnswer && ranges.some(range => range.upper > range.lower),
      });
    }
  }

  const markers: HistoryMarker[] = [];
  entries.forEach((entry, index) => {
    for (const key of ANSWER_KEYS) {
      const { lower, upper } = bandRange(stacks[index], key);
      if (upper > lower) {
        markers.push({
          key,
          sessionId: entry.sessionId,
          x: xs[index],
          y: percentToY(upper, box),
          latest: index === lastIndex,
        });
      }
    }
  });

  const okY = percentToY(stacks[lastIndex].okTop, box);
  return {
    xs,
    slotWidth: plot.width / entries.length,
    gridLines,
    bands,
    column,
    markers,
    guides: xs.map((x, index) => ({ x, latest: index === lastIndex })),
    badge: { x: xs[lastIndex], y: Math.max(HISTORY_BADGE_MIN_Y, okY - HISTORY_BADGE_OFFSET) },
  };
}
