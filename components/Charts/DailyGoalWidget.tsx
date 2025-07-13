import React, { useMemo, memo } from "react";
import { TouchableOpacity, View, Text, StyleSheet, FlatList } from "react-native";
import { CheckIcon, CautionIcon, RainbowIcon, PersonIcon, FireIcon } from "@/components/common/icons";
import { useAppStore } from "@/store/useStore";
import { format, isToday, isFuture, isPast } from "date-fns";

function transformGoalData(rawData) {
  return rawData.map((item, index) => {
    const dateObj = new Date(item.date);
    const isCurrent = isToday(dateObj);

    let status;
    if (isCurrent) {
      status = item.goalMet ? "completed" : "today";
    } else if (isPast(dateObj)) {
      status = item.goalMet ? "completed" : "failed";
    } else {
      status = "upcoming";
    }

    return {
      id: String(index + 1),
      status,
      Day: format(dateObj, "EEE"),
      current: isCurrent,
    };
  });
}

const DailyItem = memo(({ item }) => {
  const icon = item.status === "completed" ? <CheckIcon color="#00ed66" size={28} /> : item.status === "failed" ? <CautionIcon color="#ed4c06" size={28} /> : <RainbowIcon color={item.status === "today" ? "#3b85de" : "#4c4c4c"} size={28} />;

  return (
    <TouchableOpacity style={[styles.itemContainer, item.current && styles.currentItem]}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.dayText}>{item.Day}</Text>
    </TouchableOpacity>
  );
});
DailyItem.displayName = "DailyItem";

const DailyGoalWidget = () => {
  const allGoals = useAppStore((state) => state.goal.dailyGoals);
  const metrics = useAppStore((state) => state.goal.metrics);

  const data = useMemo(() => transformGoalData(allGoals || []), [allGoals]);

  if (!data.length) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.lhs}>
          <PersonIcon color="#0579fb" size={26} />
          <Text style={styles.headerText}>Daily Goal</Text>
        </View>
        <View style={styles.rhs}>
          <FireIcon color="#ffb703" size={28} />
          <Text style={{ fontSize: 18, color: "white" }}>
            {metrics.consistencyStreak} {metrics.consistencyStreak === 1 ? "day" : "days"}
          </Text>
        </View>
      </View>

      <FlatList data={data} horizontal keyExtractor={(item) => item.id} renderItem={({ item }) => <DailyItem item={item} />} showsHorizontalScrollIndicator={false} />
    </View>
  );
};

export default DailyGoalWidget;

const styles = StyleSheet.create({
  wrapper: {
    width: 336,
    height: 168,
    backgroundColor: "#121212",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#212221",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  lhs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rhs: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
    backgroundColor: "#212221",
    margin: 4,
    borderRadius: 10,
  },
  currentItem: {
    backgroundColor: "#3b85de40",
    borderWidth: 2,
    borderColor: "#3b85de",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayText: {
    color: "white",
    fontSize: 16,
  },
});

// const GRID_COLUMNS = 2;
// const GRID_PADDING = 8;
// const GRID_GAP = 8;
// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const UNIT_SIZE = (SCREEN_WIDTH - 2 * GRID_PADDING - (GRID_COLUMNS - 1) * GRID_GAP) / GRID_COLUMNS;
// unit size is -> 168 ( 168 X 2 = 336)
