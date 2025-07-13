import React, { useMemo, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle, Path, Text as SvgText, Defs, TextPath } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { useAppStore } from "@/store/useStore";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_BACKGROUND_COLOR = "#3a3f4a";
const CARD_BACKGROUND_COLOR = "black";
const TEXT_COLOR = "#ffffff";

type RingData = {
  id: string;
  current: number;
  goal: number;
  color: string;
  label: string;
};

type Props = {
  width?: number;
};

function getDomainProgressChart(historyLogs) {
  // Count completed items per domain
  const domainStats = {
    dsa: { completed: 0, total: 0 },
    core: { completed: 0, total: 0 },
    interview: { completed: 0, total: 0 },
    systemDesign: { completed: 0, total: 0 }
  };

  // Process all logs to count completed vs total per domain
  historyLogs.forEach(log => {
    log.actions.forEach(action => {
      domainStats[action.domain].total++;
      if (action.completedAt) {
        domainStats[action.domain].completed++;
      }
    });
  });
  return [
      {
        id: "ring1",
        color: "#d62828",
        label: "DSA",
        current: domainStats.dsa.completed,
        goal: domainStats.dsa.total || 1, // Prevent division by zero
      },
      {
        id: "ring2",
        color: "#00afb9",
        label: "Core",
        current: domainStats.core.completed,
        goal: domainStats.core.total || 1,
      },
      {
        id: "ring3",
        color: "#fcbf49",
        label: "Interview",
        current: domainStats.interview.completed,
        goal: domainStats.interview.total || 1,
      },
      {
        id: "ring4",
        color: "#9b5de5",
        label: "System Design",
        current: domainStats.systemDesign.completed,
        goal: domainStats.systemDesign.total || 1,
      },
    ];
  }

const RadialProgressChart: React.FC<Props> = ({ width = 168 }) => {
  const historyLogs = useAppStore.getState().goal.historyLogs;
  const data = useMemo(() => {

     const chartData = getDomainProgressChart(historyLogs || []);

     return chartData;
   }, [historyLogs]);

  const height = width;
  // Optimized for 168px: stroke width proportional to size
  const strokeWidth = Math.round(width * 0.071); // ~12px for 168px
  const spacing = Math.round(width * 0.018); // ~3px for 168px
  const animatedPlayedRef = useRef(false);

  // Step 1: Process the ring data (calculate radius and progress)
  const processedData = useMemo(() => {
    const outerRadius = width / 2 - strokeWidth / 2;
    return data
      .map((item, index) => {
        const radius = outerRadius - index * (strokeWidth + spacing);
        const progress = Math.min(1, item.current / item.goal);

        return { ...item, radius: Math.max(0, radius), progress };
      })
      .filter((ring) => ring.radius > 0);
  }, [data, width, strokeWidth, spacing]);

  const strokeOffset1 = useSharedValue(0);
  const strokeOffset2 = useSharedValue(0);
  const strokeOffset3 = useSharedValue(0);
  const strokeOffset4 = useSharedValue(0);

  const strokeOffsets = [strokeOffset1, strokeOffset2, strokeOffset3, strokeOffset4];

  // Step 3: Trigger animation only once on mount
  useEffect(() => {
    if (animatedPlayedRef.current) return;

    processedData.forEach((ring, i) => {
      const circumference = 2 * Math.PI * ring.radius;


      // 1. Start fully empty (full circumference offset)
      strokeOffsets[i].value = circumference;

      // 2. Animate to actual progress
      const targetOffset = circumference * (1 - ring.progress);


      // Add a small delay to ensure SVG is rendered
      setTimeout(() => {
        strokeOffsets[i].value = withDelay(
          i * 200,
          withTiming(targetOffset, {
            duration: 1500,
            easing: Easing.out(Easing.exp),
          }),
        );
      }, 100);
    });

    animatedPlayedRef.current = true;
  }, [processedData]);

  const maxRadius = processedData.reduce(
    (max, r) => Math.max(max, r.radius),
    0
  );
  const viewBoxPadding = strokeWidth;
  const viewBoxSize = (maxRadius + viewBoxPadding) * 2;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;

  // Font size proportional to width
  const fontSize = Math.round(width * 0.054); // ~9px for 168px
  const padding = Math.round(width * 0.036); // ~6px for 168px


  if (processedData.length === 0) {
    return (
      <View style={[styles.container, { width, height, backgroundColor: CARD_BACKGROUND_COLOR }]}>
        <Text style={{ color: TEXT_COLOR, fontSize }}>No chart data available.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      width,
      height,
      backgroundColor: CARD_BACKGROUND_COLOR,
      padding,

    }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} style={styles.svg}>
        <Defs>
          {processedData.map((ring) => {
            const r = ring.radius;
            if (r <= 0) return null;
            const path = `
              M ${cx}, ${cy - r}
              A ${r},${r} 0 1,1 ${cx}, ${cy + r}
              A ${r},${r} 0 1,1 ${cx}, ${cy - r}
            `;
            return (
              <Path
                key={`path-${ring.id}`}
                id={`textPath-${ring.id}`}
                d={path}
                fill="none"
              />
            );
          })}
        </Defs>

        {processedData.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius;
          const animatedProps = useAnimatedProps(() => ({
            strokeDashoffset: strokeOffsets[index].value,
          }));



          return (
            <React.Fragment key={ring.id}>
              {/* Background ring - always visible */}
              <Circle
                cx={cx}
                cy={cy}
                r={ring.radius}
                stroke={RING_BACKGROUND_COLOR}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={1}
              />

              {/* Progress ring - will be visible even at 0% progress due to animation */}
              <AnimatedCircle
                cx={cx}
                cy={cy}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(60 ${cx} ${cy})`}
                opacity={1}
              />

              {/* Label on circular path */}
              <SvgText
                fill={TEXT_COLOR}
                fontSize={fontSize}
                fontWeight="700"
                textAnchor="start"
                dy="3"
                opacity={1}
              >
                <TextPath href={`#textPath-${ring.id}`} startOffset="15%">
                  {ring.label}
                </TextPath>
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    marginVertical: 4,
    borderRadius: 20,
  },
  svg: {
    transform: [{ rotate: "-90deg" }],
  },
});

export default RadialProgressChart;
