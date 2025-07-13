import React, { useEffect, useState } from "react";
import { Text, KeyboardAvoidingView, Platform, StyleSheet, BackHandler, Dimensions, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { useOverlayStore } from "@/store/useOverlayStore";
import { theme } from "@/components/theme";
import { TrashIcon, BookmarkIcon } from "@/components/common/icons";

const { height: screenHeight } = Dimensions.get("window");

type DialogModalProps = {
  onAnimationComplete?: () => void;
};

export const DialogModal = ({ onAnimationComplete }: DialogModalProps) => {
  const { dialogModal, hideDialogModal } = useOverlayStore();
  const [isMounted, setIsMounted] = useState(false);

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50); // Start slightly below center for better UX

  // Handle animation completion and notify parent
  const handleAnimationComplete = () => {
    setIsMounted(false);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      if (dialogModal.visible) {
        hideDialogModal();
        return true;
      }
      return false;
    });

    if (dialogModal.visible) {
      setIsMounted(true);
      // Entrance animation
      opacity.value = withTiming(1, { duration: 250 });
      translateY.value = withTiming(0, { duration: 250 });
    } else if (isMounted) {
      // Exit animation - only run if component was mounted
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(30, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(handleAnimationComplete)();
        }
      });
    }

    return () => back.remove();
  }, [dialogModal.visible, isMounted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Don't render until mounted
  if (!isMounted) return null;
  //variant warning , error , default
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.overlay}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* modal header */}
        <View style={styles.headingContainer}>
          {/* icon */}

          <View style={{ marginRight: 12 }}>
            {dialogModal.type === "default" && <BookmarkIcon size={22} color={theme.colors.Primarytext} isPressable={false} showBackground backgroundColor={theme.colors.secondaryText} />}
            {dialogModal.type === "warning" && <TrashIcon size={22} color={theme.colors.red} isPressable={false} showBackground backgroundColor="#2a0c0c" />}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{dialogModal.title}</Text>
            <Text style={styles.subtitle}>{dialogModal.subtitle}</Text>
          </View>
        </View>
        {/* content */}
        {dialogModal.content}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    // Make sure touches pass through to the Backdrop below
    pointerEvents: "box-none",
  },
  card: {
    backgroundColor: theme.Model.backgroundColor,
    width: "95%",
    borderRadius: 24,
    padding: 24,
    // Ensure the card itself can receive touches
    pointerEvents: "auto",
    // Add subtle shadow for better visual separation
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.Model.borderColor,
    marginBottom: 20,
  },
  headingContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: "YourFont-Heading",
    fontWeight: "600",
    fontSize: 18,
    textAlignVertical: "center",
    lineHeight: 25,
    color: theme.Model.titleColor,
    marginBottom: 4,
    letterSpacing: 0,
  },
  subtitle: {
    fontFamily: "YourFont-Body",
    fontSize: 14,
    fontWeight: "200",
    textAlignVertical: "center",
    lineHeight: 17,
    letterSpacing: 0,
    color: theme.Model.subtitleColor,
  },
});
