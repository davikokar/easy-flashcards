import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import RichText from './RichText';
import { colors, radius, spacing } from '../theme';

type Props = {
  question: string;
  answer: string;
  flipped: boolean;
  onFlip: () => void;
};

export default function FlipCard({ question, answer, flipped, onFlip }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: flipped ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [flipped, progress]);

  const frontStyle = {
    transform: [
      {
        rotateY: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }),
      },
    ],
    opacity: progress.interpolate({ inputRange: [0, 0.5, 0.5001, 1], outputRange: [1, 1, 0, 0] }),
  };

  const backStyle = {
    transform: [
      {
        rotateY: progress.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }),
      },
    ],
    opacity: progress.interpolate({ inputRange: [0, 0.4999, 0.5, 1], outputRange: [0, 0, 1, 1] }),
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={flipped ? 'Show question' : 'Show answer'}
      onPress={onFlip}
      style={styles.pressable}>
      <Animated.View style={[styles.card, styles.absoluteFill, frontStyle]}>
        <Text style={styles.sideLabel}>QUESTION</Text>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <RichText html={question} style={styles.cardText} />
        </ScrollView>
        <Text style={styles.hint}>Tap to reveal the answer</Text>
      </Animated.View>

      <Animated.View style={[styles.card, styles.absoluteFill, styles.cardBack, backStyle]}>
        <Text style={styles.sideLabel}>ANSWER</Text>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <RichText html={answer} style={styles.cardText} />
        </ScrollView>
        <Text style={styles.hint}>Tap to see the question again</Text>
      </Animated.View>

      {/* Keeps the pressable sized while both faces are absolutely positioned. */}
      <View style={styles.spacer} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  cardBack: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primaryDark,
  },
  sideLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  cardText: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
  },
});
