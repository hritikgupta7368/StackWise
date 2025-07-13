import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Slider from "@react-native-community/slider";

type Props = {
  label?: string;
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: (value: number) => void;
};

export default function SliderComponent({ label, min, max, step = 1, initialValue = 0, onValueChange, onSlidingStart, onSlidingComplete }: Props) {
  const [value, setValue] = useState(initialValue);
  const [showLabel, setShowLabel] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fadeOut = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 10,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (showLabel) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [showLabel]);

  return (
    <View style={styles.container}>
      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        minimumTrackTintColor="#8b5cf6"
        maximumTrackTintColor="#d1d5db"
        thumbTintColor="#8b5cf6"
        onSlidingStart={() => {
          setShowLabel(true);
          onSlidingStart?.();
        }}
        onValueChange={(val) => {
          setValue(val);
          onValueChange?.(val);
        }}
        onSlidingComplete={(val) => {
          setShowLabel(false);
          onSlidingComplete?.(val);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  labelContainer: {
    position: "absolute",
    top: 0,
    backgroundColor: "#1f2937", // gray-800
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  labelText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "500",
  },
});
