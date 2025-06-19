import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const OverlappingCirclesCard = ({
  easy = 850,
  medium = 60,
  hard = 40,
  cardWidth = 200,
  cardHeight = 200,
  title = "",
}) => {
  // Animation values
  const scaleAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0)).current;
  const opacityAnim1 = useRef(new Animated.Value(0)).current;
  const opacityAnim2 = useRef(new Animated.Value(0)).current;
  const opacityAnim3 = useRef(new Animated.Value(0)).current;

  // Calculate total and ratios
  const total = easy + medium + hard;
  const ratio1 = easy / total;
  const ratio2 = medium / total;
  const ratio3 = hard / total;

  // Base circle size
  const baseSize = Math.min(cardWidth, cardHeight) * 0.45;

  // Calculate circle sizes based on ratios
  const size1 = baseSize * (0.7 + ratio1 * 0.6);
  const size2 = baseSize * (0.7 + ratio2 * 0.6);
  const size3 = baseSize * (0.7 + ratio3 * 0.6);

  // Calculate the available space for circles
  const titleHeight = 40;
  const valuesHeight = 40;
  const availableHeight = cardHeight - titleHeight - valuesHeight - 32;

  // Calculate center position
  const circlesContainerHeight = availableHeight;
  const centerX = (cardWidth - 32) / 2;
  const centerY = circlesContainerHeight / 2;
  const offset = baseSize * 0.25;

  // Animation effect
  useEffect(() => {
    const animateCircles = () => {
      Animated.stagger(200, [
        Animated.parallel([
          Animated.timing(scaleAnim1, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim1, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim2, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim2, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim3, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim3, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    animateCircles();
  }, []);

  const circle1Style = {
    width: size1,
    height: size1,
    borderRadius: size1 / 2,
    position: "absolute",
    left: centerX - size1 / 2 - offset,
    top: centerY - size1 / 2 - offset * 0.3,
    transform: [{ scale: scaleAnim1 }],
    opacity: opacityAnim1,
  };

  const circle2Style = {
    width: size2,
    height: size2,
    borderRadius: size2 / 2,
    position: "absolute",
    left: centerX - size2 / 2 + offset,
    top: centerY - size2 / 2 - offset * 0.3,
    transform: [{ scale: scaleAnim2 }],
    opacity: opacityAnim2,
  };

  const circle3Style = {
    width: size3,
    height: size3,
    borderRadius: size3 / 2,
    position: "absolute",
    left: centerX - size3 / 2,
    top: centerY - size3 / 2 + offset * 0.8,
    transform: [{ scale: scaleAnim3 }],
    opacity: opacityAnim3,
  };

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Circles Container */}
      <View
        style={[styles.circlesContainer, { height: circlesContainerHeight }]}
      >
        {/* Circle 1 - Orange to Pink */}
        <Animated.View style={circle1Style}>
          <LinearGradient
            colors={["#a8e6cf", "#66d9a3", "#4ecdc4", "#2ecc71"]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size1 / 2,
              opacity: 0.8,
            }}
          />
        </Animated.View>

        {/* Circle 2 - Green to Teal */}
        <Animated.View style={circle2Style}>
          <LinearGradient
            colors={["#fff3b0", "#ffc857", "#ff9f1c", "#ff6f00"]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size2 / 2,
              opacity: 0.8,
            }}
          />
        </Animated.View>

        {/* Circle 3 - Purple to Pink */}
        <Animated.View style={circle3Style}>
          <LinearGradient
            colors={["#ff758c", "#ff7eb3", "#ff416c", "#ff4b2b"]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size3 / 2,
              opacity: 0.8,
            }}
          />
        </Animated.View>
      </View>

      {/* Values Display */}
      <View style={styles.valuesContainer}>
        <View style={styles.valueItem}>
          <LinearGradient
            colors={["#4ECDC4", "#68D391"]}
            style={[styles.colorIndicator]}
          />
          <Text style={styles.valueText}>{easy}</Text>
        </View>
        <View style={styles.valueItem}>
          <LinearGradient
            colors={["#FFB347", "#FFCC33"]}
            style={[styles.colorIndicator]}
          />
          <Text style={styles.valueText}>{medium}</Text>
        </View>
        <View style={styles.valueItem}>
          <LinearGradient
            colors={["#FF416C", "#FF4B2B"]}
            style={[styles.colorIndicator]}
          />
          <Text style={styles.valueText}>{hard}</Text>
        </View>
      </View>
    </View>
  );
};

export default OverlappingCirclesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  circlesContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  valueText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
