import React, { useEffect } from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, Easing } from "react-native-reanimated";
import { useOverlayStore } from "@/store/useOverlayStore";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const TOAST_HEIGHT = 60;
const HORIZONTAL_PADDING = 20;

export const ToastMessage = () => {
  const { toast } = useOverlayStore();
  const offsetY = useSharedValue(-TOAST_HEIGHT);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    if (toast.visible) {
      // quick pop‑in
      offsetY.value = withSpring(0, { damping: 12, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 120 });
      scale.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.exp) });

      // auto hide visuals after 1.5s
      hideTimer = setTimeout(() => {
        offsetY.value = withTiming(-TOAST_HEIGHT, { duration: 120, easing: Easing.in(Easing.quad) });
        opacity.value = withTiming(0, { duration: 120 });
      }, 1500);
    } else {
      // immediate hide if visible flag cleared
      offsetY.value = withTiming(-TOAST_HEIGHT, { duration: 100 });
      opacity.value = withTiming(0, { duration: 100 });
    }
    return () => clearTimeout(hideTimer);
  }, [toast.visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const typeConfig = {
    success: { icon: "checkmark-circle", color: "#4CAF50" },
    error: { icon: "close-circle", color: "#F44336" },
    info: { icon: "information-circle", color: "#2196F3" },
  }[toast.type] || { icon: "information-circle", color: "#2196F3" };

  return toast.visible ? (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <BlurView intensity={50} tint="dark" style={styles.blur}>
        <View style={[styles.iconContainer, { backgroundColor: typeConfig.color + "33" }]}>
          <Ionicons name={typeConfig.icon} size={22} color={typeConfig.color} />
        </View>
        <Text style={styles.message}>{toast.message}</Text>
      </BlurView>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    marginTop: 40,
    zIndex: 1001,
    width: width - HORIZONTAL_PADDING * 2,
  },
  blur: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
