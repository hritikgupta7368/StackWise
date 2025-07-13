import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/useStore";
import { BlankCheckBoxIcon, CheckedCheckBoxIcon } from "@/components/common/icons";
import { PlannedAction } from "@/src/goalEngine/goalTypes";
import { logDebug } from "@/utils/logUtils";

const TodaysTasks = () => {
  const todayGoal = useAppStore((state) => state.goal.dailyGoals.find((g) => g.date === new Date().toISOString().slice(0, 10)));
  // const markCompleted = useAppStore((state) => state.markActionCompleted);
  // const markStarted = useAppStore((state) => state.markActionStarted);

  if (!todayGoal) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.noTaskText}>No tasks for today</Text>
      </View>
    );
  }

  const allTasksMap = new Map<string, PlannedAction>();
  [...todayGoal.plannedLearning, ...todayGoal.plannedRevision].forEach((item) => {
    allTasksMap.set(item.id, item);
  });
  const allTasks = Array.from(allTasksMap.values());

  // logDebug(
  //   {
  //     message: "Today's Tasks New",
  //     data: todayGoal.plannedLearning,
  //   },
  //   {
  //     level: "debug",
  //     label: "TasksListWidget",
  //     stringify: true,
  //   },
  // );
  // logDebug(`Revision ${todayGoal.plannedRevision} `, {
  //   level: "debug",
  //   label: "TasksListWidget",
  //   stringify: true,
  // });
  const handleCompleteTask = (taskId: string) => {
    useAppStore.getState().markActionCompleted(todayGoal.date, taskId);
  };

  // const handleStartTask = (taskId: string) => {
  //   markStarted(todayGoal.date, taskId);
  // };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <Text style={styles.completeionText}>
          {todayGoal.totalCompleted} / {todayGoal.totalPlannedActions}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allTasks.length <= 0 && <Text style={styles.noTasksText}>No tasks for today</Text>}
        {allTasks.map((item) => {
          const isCompleted = todayGoal.completedActionIds.includes(item.id);

          return (
            <View key={item.id} style={styles.taskRow}>
              <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>{isCompleted ? <CheckedCheckBoxIcon color="#00ed66" size={22} /> : <BlankCheckBoxIcon color="#888" size={22} />}</TouchableOpacity>

              <View style={styles.taskTextWrapper}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.taskTitle}>
                  {item.title}
                </Text>
                <Text style={styles.taskMeta}>
                  {item.domain} • {item.type === "learn" ? "New" : "Revision"}
                  {item.difficultyLevel ? ` • ${item.difficultyLevel}` : ""}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TodaysTasks;

const styles = StyleSheet.create({
  wrapper: {
    width: 168,
    height: 168,
    borderRadius: 20,
    backgroundColor: "#121212",
    padding: 10,
    overflow: "hidden",
    marginVertical: 4,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noTaskText: {
    color: "#888",
    textAlign: "center",
    fontSize: 14,
    paddingTop: 60,
  },
  scrollContent: {
    gap: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  taskTextWrapper: {
    flex: 1,
  },
  taskTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  taskMeta: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 1,
  },
  noTasksText: {
    color: "#888",
    textAlign: "center",
    fontSize: 14,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  completeionText: {
    color: "#888",
    fontSize: 14,
  },
});
