import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { AnswerIcon } from './AnswerIcons';
import Button from './Button';
import MenuIcon from './MenuIcons';

const renderReplayIcon = (color: string) => <MenuIcon name="replay" color={color} />;

// Badge text is capped so two digits and the plus stay inside the badge.
const BADGE_MAX = 99;

type Props = {
  /** Missed or unsure cards still outstanding. */
  count: number;
  /** Everything that needed review is fixed: the button is disabled and shows a tick. */
  done?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

// The warning icon-only button with its count badge, as on a completed Session card.
export default function ReviewErrorsButton({
  count,
  done = false,
  accessibilityLabel,
  onPress,
}: Props) {
  return (
    <View>
      <Button
        variant="warning"
        accessibilityLabel={accessibilityLabel}
        icon={renderReplayIcon}
        disabled={done}
        onPress={onPress}
      />
      {/* A sibling of the button, so its disabled dimming does not fade the badge. */}
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.badge, done ? styles.badgeDone : styles.badgeCount]}>
        {done ? (
          <AnswerIcon name="tick" color={colors.success} size={12} />
        ) : (
          <Text style={styles.badgeText} allowFontScaling={false} numberOfLines={1}>
            {count > BADGE_MAX ? `${BADGE_MAX}+` : count}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Sits on the button's top-right corner, inside the 8-point gap and the footer padding.
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    // Solid card colour so the ring reads against the orange button and the card alike.
    backgroundColor: colors.surface,
  },
  badgeCount: {
    borderColor: colors.warning,
  },
  badgeDone: {
    borderColor: colors.success,
  },
  badgeText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
  },
});
