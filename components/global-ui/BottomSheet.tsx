import React, { useEffect, useState, useCallback } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, interpolate, Extrapolate } from "react-native-reanimated";
import { useOverlayStore } from "@/store/useOverlayStore";
import { theme } from "@/components/theme";

const screenHeight = Dimensions.get("window").height;

const getHeight = (variant: string | undefined, custom?: number) => {
  if (custom) return custom;
  switch (variant) {
    case "compact":
      return screenHeight * 0.3;
    case "full":
      return screenHeight;
    default:
      return screenHeight * 0.6;
  }
};

type BottomSheetProps = {
  onAnimationComplete?: () => void;
};

export const BottomSheet = ({ onAnimationComplete }: BottomSheetProps) => {
  const { bottomSheet } = useOverlayStore();
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0); // Add opacity for smoother animation
  const [isMounted, setIsMounted] = useState(false);
  const [contentReady, setContentReady] = useState(false); // Track content readiness

  const height = getHeight(bottomSheet.variant, bottomSheet.height);

  // Optimize animation completion callback
  const handleAnimationComplete = useCallback(() => {
    setIsMounted(false);
    setContentReady(false);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  // Pre-load content when becoming visible
  useEffect(() => {
    if (bottomSheet.visible && bottomSheet.content) {
      // Small delay to ensure content is ready before animating
      const timer = setTimeout(() => {
        setContentReady(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [bottomSheet.visible, bottomSheet.content]);

  // Animate on open and close
  useEffect(() => {
    if (bottomSheet.visible) {
      setIsMounted(true);
      // Fast initial animation, then spring for natural feel
      translateY.value = withTiming(height * 0.1, { duration: 150 }, () => {
        translateY.value = withSpring(0, {
          damping: 22,
          stiffness: 200,
          mass: 0.8,
        });
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else if (isMounted) {
      // Faster, smoother exit
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(screenHeight * 0.6, { duration: 250 }, (finished) => {
        if (finished) {
          runOnJS(handleAnimationComplete)();
        }
      });
    }
  }, [bottomSheet.visible, isMounted, height]);

  // Optimized animated style with interpolation
  const animatedStyle = useAnimatedStyle(() => {
    // Add subtle scale effect during animation
    const scale = interpolate(translateY.value, [0, screenHeight], [1, 0.96], Extrapolate.CLAMP);

    return {
      transform: [{ translateY: translateY.value }, { scale }],
      opacity: opacity.value,
    };
  });

  // Don't render until mounted
  if (!isMounted) return null;

  return (
    <Animated.View style={[styles.sheet, animatedStyle, { height }]}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <View style={styles.homebar}>
          <View style={styles.rectangle} />
        </View>

        {bottomSheet.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            <View style={styles.headingContainer}>
              <Text style={styles.title}>{bottomSheet.title}</Text>
              <Text style={styles.subtitle}>{bottomSheet.subtitle}</Text>
            </View>

            <View style={styles.scroll}>
              {/* Show content only when ready to prevent animation lag */}
              <View style={styles.contentContainer}>{bottomSheet.content}</View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.BottomSheet.backgroundColor,
    borderTopLeftRadius: theme.BottomSheet.borderRadius,
    borderTopRightRadius: theme.BottomSheet.borderRadius,
    zIndex: 1000,
    overflow: "hidden",
    // Add subtle border for definition
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.BottomSheet.borderColor,
    // Enhanced shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 2,
  },
  homebar: {
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  rectangle: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 50,
    height: 4,
    borderRadius: 24,
  },
  headingContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontFamily: "YourFont-Heading",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 32,
    color: theme.BottomSheet.titleColor,
    marginBottom: 2,
    letterSpacing: 0,
  },
  subtitle: {
    fontFamily: "YourFont-Body",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 24,
    letterSpacing: 0,
    color: theme.BottomSheet.subtitleColor,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.BottomSheet.subtitleColor,
    fontWeight: "500",
  },
  errorMessage: {
    textAlign: "center",
    color: theme.BottomSheet.subtitleColor,
    paddingTop: 16,
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24,
  },
});
