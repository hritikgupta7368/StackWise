// components/global-ui/PopupMenu.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { useOverlayStore } from "@/store/useOverlayStore";
import { theme } from "@/components/theme";

const { width } = Dimensions.get("window");

export const PopupMenu = () => {
  const { popupMenu, hidePopupMenu } = useOverlayStore();
  const [shouldRender, setShouldRender] = useState(false);

  // Animation values for Samsung-style diagonal growth
  const scaleX = useSharedValue(0);
  const scaleY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animateIn = () => {
    // Samsung style: grows from top-right corner diagonally
    opacity.value = withTiming(1, { duration: 50 });
    scaleX.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });
    scaleY.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    });
  };

  const animateOut = (callback?: () => void) => {
    opacity.value = withTiming(0, { duration: 80 });
    scaleX.value = withTiming(0, {
      duration: 120,
      easing: Easing.in(Easing.cubic),
    });
    scaleY.value = withTiming(
      0,
      {
        duration: 120,
        easing: Easing.in(Easing.cubic),
      },
      () => {
        if (callback) {
          runOnJS(callback)();
        }
      },
    );
  };

  useEffect(() => {
    if (popupMenu.visible) {
      setShouldRender(true);
      // Small delay to ensure render happens before animation
      setTimeout(animateIn, 10);
    } else if (shouldRender) {
      // Animate out, then hide
      animateOut(() => setShouldRender(false));
    }
  }, [popupMenu.visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleX: scaleX.value }, { scaleY: scaleY.value }],
    transformOrigin: "top right", // This is key for Samsung-style growth
  }));

  if (!shouldRender) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.menuContainer, animatedStyle]}>
        {popupMenu.options.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.menuItem, idx === 0 && styles.firstItem, idx === popupMenu.options.length - 1 && styles.lastItem]}
            onPress={() => {
              item.onPress();
              hidePopupMenu();
            }}
            activeOpacity={0.7}
          >
            {item.icon && <View style={styles.icon}>{item.icon}</View>}
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  menuContainer: {
    backgroundColor: theme.PopupMenu.backgroundColor,
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 160,
    maxWidth: 200,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 0.5,
    borderColor: theme.PopupMenu.borderColor,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  firstItem: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastItem: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  label: {
    color: theme.PopupMenu.labelColor,
    fontSize: 15,
    fontWeight: "400",
  },
  icon: {
    marginRight: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
