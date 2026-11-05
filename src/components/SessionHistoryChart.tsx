import React, { useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { AnswerIcon } from './AnswerIcons';
import { ANSWER_SEGMENTS } from './MasteryTrack';
import type { SessionHistoryEntry } from '../types';
import {
  HISTORY_CHART_INSETS,
  buildHistoryChart,
  stackHistoryShares,
} from '../utils/historyChart';
import type { HistoryAnswerKey, HistoryChartGeometry } from '../utils/historyChart';
import { formatDate, formatRate, formatShortDate } from '../utils/stats';
import { colors, radius, spacing } from '../theme';

/** The most sessions that fit a 360-point phone at the largest font scale. */
export const SESSION_HISTORY_LIMIT = 5;

type Props = {
  /** The latest sessions, oldest first, already cut to `SESSION_HISTORY_LIMIT` by the caller. */
  entries: SessionHistoryEntry[];
  /** Every session of the deck; the subtitle says `Latest {n} of {total}` when it exceeds `entries`. */
  sessionCount: number;
};

const PLOT_HEIGHT = 150;
const LEGEND_ICON_SIZE = 16;
const BADGE_ICON_SIZE = 12;
const LINE_WIDTH = 2;
const SHADOW_EXTRA_WIDTH = 1.5;
const SHADOW_OFFSET = 1;
const MARKER_RADIUS = 3.5;
const LATEST_MARKER_RADIUS = 5;
const MARKER_STROKE = 2;
const GRADIENT_ID_PREFIX = 'session-history';
const GRID_DASH = '3 4';
const GUIDE_DASH = '2 3';
const BADGE_BOX_WIDTH = 72;
const BADGE_BOX_HEIGHT = 20;
const Y_LABEL_BOX_HEIGHT = 20;

function answerColor(key: HistoryAnswerKey): string {
  return ANSWER_SEGMENTS.find(segment => segment.key === key)?.color ?? colors.textMuted;
}

function gradientId(key: HistoryAnswerKey): string {
  return `${GRADIENT_ID_PREFIX}-${key}`;
}

export default function SessionHistoryChart({ entries, sessionCount }: Props) {
  const [width, setWidth] = useState(0);
  const subtitle =
    sessionCount > entries.length
      ? `Latest ${entries.length} of ${sessionCount}`
      : `${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`;

  const geometry = useMemo(
    () =>
      width > 0 && entries.length > 0
        ? buildHistoryChart(entries, { width, height: PLOT_HEIGHT, ...HISTORY_CHART_INSETS })
        : null,
    [entries, width],
  );
  const hasUnanswered = useMemo(
    () => stackHistoryShares(entries).some(stack => stack.unansweredTop > stack.answeredTop),
    [entries],
  );

  const onPlotLayout = (event: LayoutChangeEvent) => {
    setWidth(Math.floor(event.nativeEvent.layout.width));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Session history
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No sessions for this deck</Text>
          <Text style={styles.emptyMessage}>
            Start one from the Decks tab and its results will show here.
          </Text>
        </View>
      ) : (
        <>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.legend}>
            {ANSWER_SEGMENTS.map(segment => (
              <AnswerIcon
                key={segment.key}
                name={segment.icon}
                color={segment.color}
                size={LEGEND_ICON_SIZE}
              />
            ))}
            {hasUnanswered ? (
              <View style={styles.legendItem}>
                <View style={styles.swatch} />
                <Text maxFontSizeMultiplier={1.3} style={styles.legendText}>
                  Unanswered
                </Text>
              </View>
            ) : null}
            <Text maxFontSizeMultiplier={1.3} style={styles.legendNote}>
              % of each session's cards
            </Text>
          </View>

          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onLayout={onPlotLayout}
            style={styles.plot}>
            {geometry ? (
              <ChartPlot
                geometry={geometry}
                width={width}
                latestOkCount={entries[entries.length - 1].tally.okCount}
              />
            ) : null}
          </View>

          <View style={styles.labels}>
            {entries.map((entry, index) => (
              <SessionLabel
                key={entry.sessionId}
                entry={entry}
                latest={index === entries.length - 1}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function ChartPlot({
  geometry,
  width,
  latestOkCount,
}: {
  geometry: HistoryChartGeometry;
  width: number;
  latestOkCount: number;
}) {
  const plotLeft = HISTORY_CHART_INSETS.left;
  const plotRight = width - HISTORY_CHART_INSETS.right;
  const plotTop = HISTORY_CHART_INSETS.top;
  const plotBottom = PLOT_HEIGHT - HISTORY_CHART_INSETS.bottom;
  const { badge } = geometry;
  // Top band first, so where boundaries coincide the Ok line is the one on top.
  const lineBands = [...geometry.bands].reverse().filter(band => band.visible && band.linePath);

  return (
    <>
      <Svg width={width} height={PLOT_HEIGHT}>
        <Defs>
          {ANSWER_SEGMENTS.map(segment => (
            <LinearGradient
              key={segment.key}
              id={gradientId(segment.key)}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={plotTop}
              x2={0}
              y2={plotBottom}>
              <Stop offset="0" stopColor={segment.color} stopOpacity={0.7} />
              <Stop offset="1" stopColor={segment.color} stopOpacity={0.2} />
            </LinearGradient>
          ))}
        </Defs>

        {geometry.gridLines.map(line => (
          <Line
            key={line.value}
            x1={plotLeft}
            x2={plotRight}
            y1={line.y}
            y2={line.y}
            stroke={colors.border}
            strokeWidth={1}
            strokeDasharray={GRID_DASH}
          />
        ))}

        {geometry.bands.map(band =>
          band.areaPath && (band.key === 'unanswered' || band.visible) ? (
            <Path
              key={band.key}
              d={band.areaPath}
              fill={band.key === 'unanswered' ? colors.surfaceAlt : `url(#${gradientId(band.key)})`}
              fillOpacity={band.key === 'unanswered' ? 0.6 : 1}
            />
          ) : null,
        )}

        {geometry.column.map(rect =>
          rect.height > 0 ? (
            <Rect
              key={rect.key}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.key === 'unanswered' ? colors.surfaceAlt : `url(#${gradientId(rect.key)})`}
              fillOpacity={rect.key === 'unanswered' ? 0.6 : 1}
            />
          ) : null,
        )}

        {geometry.guides.map(guide => (
          <Line
            key={guide.x}
            x1={guide.x}
            x2={guide.x}
            y1={plotTop}
            y2={plotBottom}
            stroke={guide.latest ? colors.text : colors.textDim}
            strokeOpacity={guide.latest ? 0.8 : 0.5}
            strokeWidth={guide.latest ? 1.5 : 1}
            strokeDasharray={GUIDE_DASH}
          />
        ))}

        {lineBands.map(band => (
          <G key={`shadow-${band.key}`} y={SHADOW_OFFSET}>
            <Path
              d={band.linePath}
              fill="none"
              stroke={colors.background}
              strokeOpacity={0.4}
              strokeWidth={LINE_WIDTH + SHADOW_EXTRA_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        ))}
        {lineBands.map(band => (
          <Path
            key={`line-${band.key}`}
            d={band.linePath}
            fill="none"
            stroke={answerColor(band.key as HistoryAnswerKey)}
            strokeWidth={LINE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {geometry.markers.map(marker => (
          <Circle
            key={`${marker.sessionId}-${marker.key}`}
            cx={marker.x}
            cy={marker.y}
            r={marker.latest ? LATEST_MARKER_RADIUS : MARKER_RADIUS}
            fill={marker.latest ? answerColor(marker.key) : colors.surface}
            stroke={marker.latest ? colors.background : answerColor(marker.key)}
            strokeWidth={MARKER_STROKE}
          />
        ))}
      </Svg>

      {geometry.gridLines
        .filter(line => line.labelled)
        .map(line => (
          <View
            key={line.value}
            pointerEvents="none"
            style={[styles.yLabelBox, { top: line.y - Y_LABEL_BOX_HEIGHT / 2 }]}>
            <Text maxFontSizeMultiplier={1.3} style={styles.yLabel}>
              {line.value}
            </Text>
          </View>
        ))}

      {badge ? (
        <View
          pointerEvents="none"
          style={[
            styles.badgeBox,
            { left: badge.x - BADGE_BOX_WIDTH / 2, top: badge.y - BADGE_BOX_HEIGHT / 2 },
          ]}>
          <View style={styles.badge}>
            <AnswerIcon name="tick" color={colors.success} size={BADGE_ICON_SIZE} />
            <Text maxFontSizeMultiplier={1.3} style={styles.badgeText}>
              {latestOkCount}
            </Text>
          </View>
        </View>
      ) : null}
    </>
  );
}

function SessionLabel({ entry, latest }: { entry: SessionHistoryEntry; latest: boolean }) {
  const { tally, rate, cardCount, startedAt } = entry;
  const answered = tally.okCount + tally.okeishCount + tally.notOkCount;
  const rateText = rate === null ? 'no answers yet' : formatRate(rate);

  return (
    <View
      accessible
      accessibilityLabel={`Session on ${formatDate(startedAt)}: success rate ${rateText}, ${answered} of ${cardCount} cards answered — ${tally.okCount} ok, ${tally.okeishCount} okeish, ${tally.notOkCount} not ok`}
      style={styles.label}>
      <Text
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
        style={[styles.labelDate, latest && styles.labelLatest]}>
        {formatShortDate(startedAt)}
      </Text>
      <Text
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
        style={[styles.labelRate, latest && styles.labelLatest]}>
        {formatRate(rate)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.md,
    rowGap: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  // Grows to the end of its line so the note sits at the right whatever precedes it.
  legendNote: {
    flexGrow: 1,
    textAlign: 'right',
    color: colors.textMuted,
    fontSize: 12,
  },
  // Only this height is reserved until onLayout reports the width the svg is drawn at.
  plot: {
    height: PLOT_HEIGHT,
  },
  // Reaches 8 into the card padding so a three-digit label fits at the largest font scale.
  yLabelBox: {
    position: 'absolute',
    left: -spacing.sm,
    width: HISTORY_CHART_INSETS.left - 3 + spacing.sm,
    height: Y_LABEL_BOX_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  yLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  badgeBox: {
    position: 'absolute',
    width: BADGE_BOX_WIDTH,
    minHeight: BADGE_BOX_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm - 2,
    paddingVertical: 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  // The insets match the plot's, so each flex slot sits under its own marker.
  labels: {
    flexDirection: 'row',
    paddingLeft: HISTORY_CHART_INSETS.left,
    paddingRight: HISTORY_CHART_INSETS.right,
  },
  label: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 2,
  },
  labelDate: {
    color: colors.textMuted,
    fontSize: 11,
  },
  labelRate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  labelLatest: {
    color: colors.text,
    fontWeight: '700',
  },
  empty: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyMessage: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
