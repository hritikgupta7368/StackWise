import { View, Text, Dimensions, Animated, StyleSheet, Pressable } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useAppStore } from "@/store/useStore";
import { useEffect, useRef, useMemo } from "react";
import { dsaLibrary } from "@/utils/dsaLibraray";
import { Link } from "expo-router";
import { ArrowUpRightIcon } from "../common/icons";

const screenWidth = Dimensions.get("window").width;
const chartHeight = Math.floor(Dimensions.get("window").height / 3);

export default function StatsChart() {
  const problems = useAppStore((state) => state.dsa.problems);
  const topics = useAppStore((state) => state.dsa.topics);
  const stats = dsaLibrary();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  const colorPalette = useMemo(
    () => [
      "#ffbe0b", // red
      "#fb5607", // yellow
      "#ff006e", // green
      "#8338ec", // blue
      "#3a86ff", // purple
      "#80ed99", // pink
      "#d62828", // amber
      "#ffd6ff", // emerald
      "#ff0054", // sky
      "#D8B4FE", // violet
    ],
    [],
  );

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const topicProblemCounts = useMemo(() => {
    return topics
      .map((topic, index) => {
        const count = problems.filter((p) => p.topicId === topic.id).length;

        return {
          name: topic.title,
          count,
          color: colorPalette[index % colorPalette.length],
          legendFontColor: "#e5e5e5",
          legendFontSize: 12,
        };
      })
      .filter((t) => t.count > 0);
  }, [topics, problems, colorPalette]);

  const chartData = useMemo(
    () =>
      topicProblemCounts.map((t) => ({
        name: t.name,
        population: t.count,
        color: t.color,
        legendFontColor: t.legendFontColor,
        legendFontSize: t.legendFontSize,
      })),
    [topicProblemCounts],
  );

  const { easy, medium, hard, total } = useMemo(() => {
    let easy = 0,
      medium = 0,
      hard = 0;

    problems.forEach((p) => {
      if (p.difficultyLevel === "easy") easy++;
      else if (p.difficultyLevel === "medium") medium++;
      else if (p.difficultyLevel === "hard") hard++;

      if (Array.isArray(p.similarProblems)) {
        p.similarProblems.forEach((sp) => {
          if (sp.difficultyLevel === "easy") easy++;
          else if (sp.difficultyLevel === "medium") medium++;
          else if (sp.difficultyLevel === "hard") hard++;
        });
      }
    });

    return { easy, medium, hard, total: easy + medium + hard };
  }, [problems]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}> Problem Stats</Text>
        <Link href="/dsaLibrary" asChild>
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 2,
              borderRadius: 24,
            }}
          >
            <Text style={styles.subtitle}>
              Total: {total}/{stats.totalProblems}
            </Text>
            <ArrowUpRightIcon size={18} />
          </Pressable>
        </Link>
      </View>

      {/* Chart */}
      {chartData.length >= -1 ? (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <PieChart
            data={chartData}
            width={0.7 * screenWidth}
            height={140}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#000",
              backgroundGradientTo: "#000",
              color: () => "#fff",
              labelColor: () => "#e5e5e5",
            }}
            accessor="population"
            backgroundColor="transparent"
            center={[0, 0]}
            absolute
            paddingLeft="0"
          />
        </Animated.View>
      ) : (
        <Animated.View style={{ opacity: scaleAnim }}>
          <Text style={styles.noData}>No data available yet.</Text>
        </Animated.View>
      )}

      {/* Stats summary */}
      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: "#25a18e" }]}>Easy: {easy}</Text>
        <Text style={[styles.statsText, { color: "#FBBF24" }]}>Medium: {medium}</Text>
        <Text style={[styles.statsText, { color: "#f94144" }]}>Hard: {hard}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: chartHeight,
    backgroundColor: "#111111",
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#cccccc",
  },
  noData: {
    fontStyle: "italic",
    marginTop: 10,
    color: "#999",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
