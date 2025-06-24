import React, { memo, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

interface PopupMenuProps {
  visible: boolean;
  onClose: () => void;
  options: { label: string; onPress: () => void }[];
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const PopupMenu: React.FC<PopupMenuProps> = memo(
  ({ visible, onClose, options }) => {
    const opacity = useSharedValue(visible ? 1 : 0);
    const scale = useSharedValue(visible ? 1 : 0.95);

    // Memoize animated style to prevent recreation
    const animatedStyle = useAnimatedStyle(
      () => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      }),
      [],
    );

    // Memoize option handlers to prevent recreation
    const handleOptionPress = useCallback(
      (optionPress: () => void) => {
        return () => {
          optionPress();
          onClose();
        };
      },
      [onClose],
    );

    // Memoize rendered options
    const renderedOptions = useMemo(
      () =>
        options.map((option, index) => (
          <Pressable
            key={`${option.label}-${index}`} // More stable key
            onPress={handleOptionPress(option.onPress)}
            style={({ pressed }) => [
              Pstyles.menuItem,
              pressed && Pstyles.menuItemPressed,
            ]}
            android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
          >
            <Text style={Pstyles.menuText}>{option.label}</Text>
          </Pressable>
        )),
      [options, handleOptionPress],
    );

    // Animate on visibility change
    React.useEffect(() => {
      if (visible) {
        opacity.value = withTiming(1, { duration: 100 });
        scale.value = withTiming(1, { duration: 100 });
      } else {
        opacity.value = withTiming(0, { duration: 100 });
        scale.value = withTiming(0.95, { duration: 100 });
      }
    }, [visible, opacity, scale]);

    if (!visible) return null;

    return (
      <View style={Pstyles.container}>
        <Pressable
          style={Pstyles.overlay}
          onPress={onClose}
          // Prevent event bubbling
          onPressIn={(e) => e.stopPropagation()}
        />
        <Animated.View
          entering={FadeIn.duration(100)}
          exiting={FadeOut.duration(100)}
          style={[Pstyles.menuContainer, { top: 90, right: 30 }]}
        >
          <Animated.View style={animatedStyle}>{renderedOptions}</Animated.View>
        </Animated.View>
      </View>
    );
  },
);

PopupMenu.displayName = "PopupMenu";

const Pstyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "#2e2e3e",
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 160,
    maxWidth: SCREEN_WIDTH - 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
  },
});
export default PopupMenu;
