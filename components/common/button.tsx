import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Text, Animated, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View } from "react-native";
import { theme } from "../theme";

export type ButtonSize = "small" | "medium" | "large";
export type AnimationType = "scale" | "bounce" | "fade" | "slide";

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;

  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;

  size?: ButtonSize;
  animationType?: AnimationType;
  animationDuration?: number;
  enablePressAnimation?: boolean;

  style?: ViewStyle;
  textStyle?: TextStyle;

  loadingColor?: string;
  showLoadingText?: boolean;
  loadingText?: string;
  marginBottom?: number;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ title, onPress, disabled = false, loading = false, size = "medium", backgroundColor = theme.colors.primary, textColor = theme.colors.Primarytext, borderColor = "transparent", borderWidth = 1, borderRadius = 8, animationType = "scale", animationDuration = 200, enablePressAnimation = true, style, textStyle, loadingColor, showLoadingText = false, loadingText = "Loading...", marginBottom = 16 }) => {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;
  const slideValue = useRef(new Animated.Value(0)).current;

  const sizeConfig = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      minHeight: 36,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      fontSize: 16,
      minHeight: 44,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      fontSize: 18,
      minHeight: 52,
    },
  };

  const handlePressIn = () => {
    if (!enablePressAnimation || disabled || loading) return;
    if (animationType === "scale" || animationType === "bounce") {
      Animated.spring(animatedValue, {
        toValue: animationType === "scale" ? 0.95 : 0.9,
        useNativeDriver: true,
      }).start();
    } else if (animationType === "fade") {
      Animated.timing(fadeValue, {
        toValue: 0.7,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else if (animationType === "slide") {
      Animated.timing(slideValue, {
        toValue: 2,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!enablePressAnimation || disabled || loading) return;
    if (animationType === "scale" || animationType === "bounce") {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else if (animationType === "fade") {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else if (animationType === "slide") {
      Animated.timing(slideValue, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeValue, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [loading]);

  const currentSize = sizeConfig[size];
  const isDisabled = disabled || loading;

  const getAnimationStyle = () => {
    switch (animationType) {
      case "scale":
      case "bounce":
        return { transform: [{ scale: animatedValue }] };
      case "fade":
        return { opacity: fadeValue };
      case "slide":
        return { transform: [{ translateY: slideValue }] };
      default:
        return {};
    }
  };

  const buttonStyle: ViewStyle = [
    styles.button,
    {
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius,
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
      minHeight: currentSize.minHeight,
      opacity: isDisabled ? 0.6 : 1,
      marginBottom: marginBottom,
    },
    getAnimationStyle(),
    style,
  ];

  const buttonTextStyle: TextStyle = [
    styles.buttonText,
    {
      color: textColor,
      fontSize: currentSize.fontSize,
    },
    textStyle,
  ];

  const displayText = loading && showLoadingText ? loadingText : title;
  const indicatorColor = loadingColor || textColor;

  return (
    <TouchableOpacity activeOpacity={enablePressAnimation ? 0.8 : 0.2} disabled={isDisabled} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={buttonStyle}>
        {loading && <ActivityIndicator size="small" color={indicatorColor} style={styles.loadingIndicator} />}
        <Text style={buttonTextStyle}>{displayText}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: "100%",
  },
  dual: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dualButton: {
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  loadingIndicator: {
    marginRight: 8,
  },
});
