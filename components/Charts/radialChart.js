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
  data: RingData[];
  width?: number;
};

const RadialProgressChart: React.FC<Props> = ({ data, width = 320 }) => {
  const height = width;
  const strokeWidth = 20;
  const spacing = 5;
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
  }, [data, width]);

  // Step 2: Create stroke offset shared values (Hooks must be top-level)
  const strokeOffsets = useRef(
    processedData.map((ring) => useSharedValue(2 * Math.PI * ring.radius))
  ).current;

  // Step 3: Trigger animation only once on mount
  useEffect(() => {
    if (animatedPlayedRef.current) return;

    processedData.forEach((ring, i) => {
      const circumference = 2 * Math.PI * ring.radius;
      strokeOffsets[i].value = withDelay(
        i * 200,
        withTiming(circumference * (1 - ring.progress), {
          duration: 1500,
          easing: Easing.out(Easing.exp),
        })
      );
    });

    animatedPlayedRef.current = true;
  }, [processedData]);

  const maxRadius = processedData.reduce(
    (max, r) => Math.max(max, r.radius),
    0
  );
  const viewBoxPadding = strokeWidth / 2;
  const viewBoxSize = (maxRadius + viewBoxPadding) * 2;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;

  if (processedData.length === 0) {
    return (
      <View style={[styles.container, { width, height, backgroundColor: CARD_BACKGROUND_COLOR }]}>
        <Text style={{ color: TEXT_COLOR }}>No chart data available.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height, backgroundColor: CARD_BACKGROUND_COLOR }]}>
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
              {/* Background ring */}
              <Circle
                cx={cx}
                cy={cy}
                r={ring.radius}
                stroke={RING_BACKGROUND_COLOR}
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Progress ring */}
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
              />

              {/* Label on circular path */}
              <SvgText
                fill={TEXT_COLOR}
                fontSize="12"
                fontWeight="700"
                textAnchor="start"
                dy="4"
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
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    padding: 10,
  },
  svg: {
    transform: [{ rotate: "-90deg" }],
  },
});

export default RadialProgressChart;
