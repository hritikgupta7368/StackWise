// components/global-ui/Backdrop.tsx
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { theme, Theme } from "../theme";

type Props = {
  visible: boolean;
  onPress?: () => void;
};

export const Backdrop = ({ visible, onPress }: Props) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Sync with popup entrance - slightly faster for better UX
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
    } else {
      // Sync with popup exit - faster exit
      opacity.value = withTiming(0, {
        duration: 150,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.backdrop, animatedStyle]}>
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onPress} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.backdrop, // Darker backdrop for better dark theme contrast
    zIndex: 999,
  },
});
