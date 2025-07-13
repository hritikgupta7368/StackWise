import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Animated, TextInput, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Svg, Path, Circle, Rect, G, Defs, LinearGradient, Stop, Text as SvgText } from "react-native-svg";
// import { TrendingUp } from "lucide-react-native";
import { useAppStore } from "@/store/useStore";

interface DataPoint {
  x: number;
  y: number;
}
//started editing code
const TargetWidget = () => {
  const chartDataString = useAppStore((state) => state.getWidgetData().chartDataString);
  const statusText = useAppStore((state) => state.getWidgetData().statusText);
  const displayPercentage = useAppStore((state) => state.getWidgetData().displayPercentage);

  const [percentage, setPercentage] = useState(0);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const chartOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const animatedPercentage = useRef(new Animated.Value(0)).current;

  // State for the raw input string for the chart
  const [inputValue, setInputValue] = useState("0,22, 42, 38, 35, 22, 38, 42, 55, 100");

  // Animated values for the chart path and peak point

  // Function to parse input and generate scaled data points
  const generateChartData = (input: string): DataPoint[] => {
    const numbers = input
      .split(",")
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !isNaN(n));
    if (numbers.length < 2) return [];

    const maxVal = Math.max(...numbers);
    const minVal = Math.min(...numbers);
    const yRange = maxVal - minVal;

    const chartHeight = 40; // The effective height of the chart area in the SVG
    const yPadding = 10; // Padding from top and bottom of the SVG viewBox

    return numbers.map((num, index) => {
      const x = (index / (numbers.length - 1)) * 100; // Spread points across 0-100 width
      // Scale y-value to fit within the chart height, inverting because SVG y is top-down
      const y = yRange === 0 ? chartHeight / 2 + yPadding : chartHeight - ((num - minVal) / yRange) * chartHeight + yPadding;
      return { x, y, value: num };
    });
  };
  const generateSmoothPath = (points: DataPoint[]) => {
    if (points.length < 2) return "";
    const line = (pointA: DataPoint, pointB: DataPoint) => {
      const lengthX = pointB.x - pointA.x;
      const lengthY = pointB.y - pointA.y;
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX),
      };
    };

    const controlPoint = (current: DataPoint, previous: DataPoint | undefined, next: DataPoint | undefined, reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = line(p, n);
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;
      const x = current.x + Math.cos(angle) * length;
      const y = current.y + Math.sin(angle) * length;
      return [x, y];
    };

    let path = `M ${points[0].x} ${points[0].y}`;
    points.forEach((point, i) => {
      if (i === 0) return;
      const [cpsX, cpsY] = controlPoint(points[i - 1], points[i - 2], point);
      const [cpeX, cpeY] = controlPoint(point, points[i - 1], points[i + 1], true);
      path += ` C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
    });
    return path;
  };

  useEffect(() => {
    Animated.timing(chartOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setDataPoints(generateChartData(chartDataString));
      Animated.timing(chartOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  }, [chartDataString]);

  // --- EFFECT FOR PERCENTAGE COUNT-UP ---
  // This now only runs when displayPercentage changes.
  useEffect(() => {
    Animated.timing(animatedPercentage, {
      toValue: displayPercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [displayPercentage]);

  // --- Effect for the pulsing ring animation (no changes needed) ---
  useEffect(() => {
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const lastPoint = dataPoints[dataPoints.length - 1] || null;
  const pulseRadius = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 10] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1, 0] });

  // Create an interpolated string for the animated percentage text
  const percentageText = animatedPercentage.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"], // Outputs a string
  });

  const AnimatedText = Animated.createAnimatedComponent(Text);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  return (
    <View style={styles.widgetContainer}>
      <Text style={styles.headerText}>Target</Text>

      <Animated.View style={[styles.chartContainer, { opacity: chartOpacity }]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 60">
          <Defs>
            <LinearGradient id="balanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#84CC16" stopOpacity="1" />
              <Stop offset="50%" stopColor="#A3E635" stopOpacity="1" />
              <Stop offset="100%" stopColor="#BEF264" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Path d={generateSmoothPath(dataPoints)} fill="none" stroke="url(#balanceGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {lastPoint && (
            <G>
              <AnimatedCircle cx={lastPoint.x} cy={lastPoint.y} r={pulseRadius} fill="#A3E635" opacity={pulseOpacity} />
              <Circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#FFFFFF" />
            </G>
          )}
        </Svg>
      </Animated.View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>

        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeButtonText}>Overall</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  widgetContainer: {
    width: 180,
    height: 180,
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 16,
    justifyContent: "space-between",
  },
  headerText: {
    color: "#E5E5EA",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  chartContainer: {
    height: 60,
    width: "100%",
    marginTop: -10,
    marginBottom: -5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statusText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  percentageText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
  },
  modeButton: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modeButtonText: {
    color: "#E5E5EA",
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    position: "absolute",
    bottom: -40,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: "#2C2C2E",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    textAlign: "center",
  },
});

export default TargetWidget;
