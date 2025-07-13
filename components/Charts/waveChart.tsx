import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Svg, Defs, LinearGradient, Stop, Path } from "react-native-svg";
import { useAppStore } from "@/store/useStore";

function getHourlyProductivityData(historyLogs) {
  // Initialize data array with hours 0-23
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    x: i,
    y: 0,
    completions: 0,
    attempts: 0,
  }));

  // Analyze completed actions by hour
  historyLogs.forEach((log) => {
    if (!log.actions) return;

    log.actions.forEach((action) => {
      if (action.completedAt) {
        const hour = new Date(action.completedAt).getHours();
        hourlyData[hour].completions++;
        hourlyData[hour].attempts++;
      } else if (action.startedAt) {
        const hour = new Date(action.startedAt).getHours();
        hourlyData[hour].attempts++;
      }
    });
  });

  // Calculate productivity score and normalize
  const productivityData = hourlyData.map((hour) => {
    // Base productivity on completion rate with a minimum value
    const baseValue = 20; // Minimum chart height
    const completionRate = hour.attempts > 0 ? (hour.completions / hour.attempts) * 100 : 0;

    return {
      x: hour.x,
      y: baseValue + completionRate,
      label: `${hour.x}:00`,
      completions: hour.completions,
    };
  });

  return productivityData;
}

const WaveChart = ({ onPeriodChange = () => {} }) => {
  const data = getHourlyProductivityData(useAppStore.getState().goal.historyLogs);
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const refreshAnimation = useRef(new Animated.Value(0)).current;

  // Generate sample data based on period
  const generateSampleData = (period) => {
    const dataPoints = period === "daily" ? 24 : period === "weekly" ? 7 : 30;
    return Array.from({ length: dataPoints }, (_, i) => ({
      x: i,
      y: Math.random() * 80 + 20 + Math.sin(i * 0.5) * 15,
    }));
  };

  const rawData = useAppStore.getState().goal.historyLogs || [];

  const [chartData, setChartData] = useState(() => {
    const safeData = getHourlyProductivityData(rawData);
    return safeData.length > 0 ? safeData : [];
  });

  // Initial loading animation
  useEffect(() => {
    const loadAnimation = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(waveAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]);

    loadAnimation.start(() => setIsLoading(false));
  }, []);

  // Refresh animation when data changes
  const handlePeriodChange = (period) => {
    if (period === selectedPeriod) return;

    setIsRefreshing(true);
    setSelectedPeriod(period);

    Animated.sequence([
      Animated.timing(refreshAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(refreshAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setChartData(generateSampleData(period));
      setIsRefreshing(false);
      onPeriodChange(period);
    });
  };

  // Create SVG path for wave
  const createWavePath = () => {
    if (!chartData || chartData.length === 0) return "";

    const width = 320;
    const height = 140;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxY = Math.max(...chartData.map((d) => d.y));
    const minY = Math.min(...chartData.map((d) => d.y));
    const yRange = maxY - minY;

    let path = "";

    chartData.forEach((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((point.y - minY) / yRange) * chartHeight;

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevPoint = chartData[index - 1];
        const prevX = padding + ((index - 1) / (chartData.length - 1)) * chartWidth;
        const prevY = padding + chartHeight - ((prevPoint.y - minY) / yRange) * chartHeight;

        const cp1x = prevX + (x - prevX) * 0.4;
        const cp1y = prevY;
        const cp2x = prevX + (x - prevX) * 0.6;
        const cp2y = y;

        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`;
      }
    });

    // Close the path for area fill
    path += ` L ${padding + chartWidth} ${padding + chartHeight}`;
    path += ` L ${padding} ${padding + chartHeight}`;
    path += " Z";

    return path;
  };

  const periods = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ];

  return (
    <View style={styles.container}>
      {/* Header with period selector */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity key={period.key} style={[styles.periodButton, selectedPeriod === period.key && styles.periodButtonActive]} onPress={() => handlePeriodChange(period.key)}>
              <Text style={[styles.periodText, selectedPeriod === period.key && styles.periodTextActive]}>{period.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart Container */}
      {!chartData || chartData.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#aaa" }}>No activity data yet</Text>
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Animated.View
            style={[
              styles.chart,
              {
                opacity: animatedValue,
                transform: [
                  {
                    scaleY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.1, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Loading overlay */}
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <Animated.View
                  style={[
                    styles.loadingBar,
                    {
                      width: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            )}

            {/* Refresh overlay */}
            {isRefreshing && (
              <Animated.View
                style={[
                  styles.refreshOverlay,
                  {
                    opacity: refreshAnimation,
                  },
                ]}
              >
                <View style={styles.refreshIndicator} />
              </Animated.View>
            )}

            {/* Grid lines */}
            <View style={styles.gridContainer}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.gridLine, { top: `${i * 25}%` }]} />
              ))}
            </View>

            {/* Wave Area */}
            <Animated.View
              style={[
                styles.waveContainer,
                {
                  opacity: waveAnimation,
                },
              ]}
            >
              {chartData.length > 0 && (
                <Svg width={320} height={140} style={styles.svg}>
                  <Defs>
                    <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#1E90FF" stopOpacity="0.8" />
                      <Stop offset="50%" stopColor="#1E90FF" stopOpacity="0.4" />
                      <Stop offset="100%" stopColor="#1E90FF" stopOpacity="0.1" />
                    </LinearGradient>
                    <LinearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor="#1E90FF" stopOpacity="0.6" />
                      <Stop offset="50%" stopColor="#1E90FF" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#1E90FF" stopOpacity="0.6" />
                    </LinearGradient>
                  </Defs>
                  <Path d={createWavePath()} fill="url(#waveGradient)" stroke="url(#strokeGradient)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              )}
            </Animated.View>

            {/* Data points */}
            <Animated.View
              style={[
                styles.pointsContainer,
                {
                  opacity: waveAnimation,
                },
              ]}
            >
              {chartData.map((point, index) => {
                const width = 320;
                const height = 140;
                const padding = 20;
                const chartWidth = width - padding * 2;
                const chartHeight = height - padding * 2;

                const maxY = Math.max(...chartData.map((d) => d.y));
                const minY = Math.min(...chartData.map((d) => d.y));
                const yRange = maxY - minY;

                const x = padding + (index / (chartData.length - 1)) * chartWidth;
                const y = padding + chartHeight - ((point.y - minY) / yRange) * chartHeight;

                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.dataPoint,
                      {
                        left: x - 3,
                        top: y - 3,
                        opacity: waveAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, index % 3 === 0 ? 1 : 0],
                        }),
                      },
                    ]}
                  />
                );
              })}
            </Animated.View>
          </Animated.View>

          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            {["100", "75", "50", "25", "0"].map((label, index) => (
              <Text key={index} style={styles.axisLabel}>
                {label}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    width: 336,
    height: 210,
    backgroundColor: "#000000",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: "#3a3f4a",
  },
  periodText: {
    fontSize: 12,
    color: "#1E90FF",
    fontWeight: "500",
  },
  periodTextActive: {
    color: "#1E90FF",
  },
  chartContainer: {
    height: 140,
    position: "relative",
    marginBottom: 16,
  },
  chart: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  loadingBar: {
    height: 3,
    backgroundColor: "#1E90FF",
    borderRadius: 2,
  },
  refreshOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(58, 63, 74, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  refreshIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1E90FF",
    opacity: 0.8,
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "#1E90FF",
    opacity: 0.3,
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  pointsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dataPoint: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3a3f4a",
    borderWidth: 2,
    borderColor: "#1E90FF",
  },
  yAxisLabels: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  axisLabel: {
    fontSize: 10,
    color: "#1E90FF",
    textAlign: "right",
    marginRight: 8,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E90FF",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
  },
  statLabel: {
    fontSize: 12,
    color: "#1E90FF",
    marginTop: 2,
  },
};

export default WaveChart;
