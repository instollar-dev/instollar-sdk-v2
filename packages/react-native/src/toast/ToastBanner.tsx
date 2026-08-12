import type { ToastOptions, ToastType } from '@instollar-dev/instollar-core';
import { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { CloseCircle } from '../components/Icon';
import { Text } from '../components/Text';
import { triggerHapticFeedback } from '../utils/haptics';
import { getToastPalette } from './toastStyles';
import { resolveToastDuration } from './toastTiming';

export type ToastBannerItem = ToastOptions & { id: number };

type ToastBannerProps = {
  toast: ToastBannerItem;
  topInset: number;
  onDismiss: (id: number) => void;
};

/** Fallback when the host app does not pass safe-area insets into ToastProvider. */
export function getDefaultToastTopInset(): number {
  return Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;
}

export function ToastBanner({ toast, topInset, onDismiss }: ToastBannerProps) {
  const type = (toast.type ?? 'default') as ToastType;
  const palette = getToastPalette(type);
  const Icon = palette.icon;
  const duration = resolveToastDuration(type, toast.autoClose);
  const title = toast.title || type.charAt(0).toUpperCase() + type.slice(1);
  const description = toast.description || toast.message || '';

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissingRef = useRef(false);

  const hiddenOffset = -(120 + topInset);

  const dismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    progress.stopAnimation();

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: hiddenOffset,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onDismiss(toast.id);
    });
  }, [hiddenOffset, onDismiss, opacity, progress, toast.id, translateY]);

  useEffect(() => {
    dismissingRef.current = false;
    translateY.setValue(hiddenOffset);
    opacity.setValue(0);
    progress.setValue(1);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    if (duration > 0) {
      Animated.timing(progress, {
        toValue: 0,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      dismissTimerRef.current = setTimeout(() => {
        dismiss();
      }, duration);
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      progress.stopAnimation();
    };
  }, [toast.id, duration, dismiss, hiddenOffset, opacity, progress, translateY]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          triggerHapticFeedback('light');
          dismiss();
        }}
        style={[
          styles.banner,
          {
            backgroundColor: palette.backgroundColor,
            paddingTop: topInset + 14,
          },
        ]}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Icon size={22} color={palette.foregroundColor} variant="Bold" />
          </View>
          <View style={styles.copy}>
            <Text
              variant="spline-bold-label"
              style={{ color: palette.foregroundColor }}>
              {title}
            </Text>
            {description ? (
              <Text
                variant="open-regular-label"
                style={{ color: palette.mutedColor, marginTop: 2 }}>
                {description}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss notification"
            hitSlop={8}
            onPress={() => {
              triggerHapticFeedback('light');
              dismiss();
            }}>
            <CloseCircle size={18} color={palette.foregroundColor} variant="Linear" />
          </Pressable>
        </View>

        {duration > 0 ? (
          <View style={[styles.progressTrack, { backgroundColor: palette.progressTrack }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: palette.foregroundColor,
                  width: progressWidth,
                },
              ]}
            />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  banner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#012B15',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    marginTop: 1,
  },
  copy: {
    flex: 1,
    paddingRight: 4,
  },
  progressTrack: {
    marginTop: 12,
    height: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
