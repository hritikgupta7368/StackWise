// /src/goalEngine/autoRestructure.ts
import { DailyGoal, GoalHistoryLog, GoalMemory } from "./goalTypes";

// Utility: simple pattern check
function analyzeDeviations(logs: GoalHistoryLog[]): GoalMemory["userTraits"] {
  const traits: GoalMemory["userTraits"] = {};

  const totalDays = logs.length;
  const weekendMisses = logs.filter((log) => {
    const day = new Date(log.date).getDay();
    const lastHourlyStat = log.hourlyStats?.[log.hourlyStats.length - 1];
    return (day === 0 || day === 6) && lastHourlyStat?.deviations?.unscheduledStarted !== undefined;
  }).length;

  const hardTasks = logs.flatMap((log) => log.actions).filter((a) => a.difficultyLevel === "hard");
  const hardGivesUp = hardTasks.filter((a) => !a.isCompleted).length;

  traits.skipsWeekend = weekendMisses > totalDays * 0.3;
  traits.givesUpOnHardTasks = hardGivesUp > hardTasks.length * 0.4;

  return traits;
}

// Rebalance logic: shifts goals slightly
export function autoRestructureGoals(futureGoals: DailyGoal[], historyLogs: GoalHistoryLog[], goalMemory: GoalMemory): DailyGoal[] {
  const traits = analyzeDeviations(historyLogs);

  return futureGoals.map((goal, index) => {
    const newGoal = { ...goal };

    // 📉 Lower load if struggling recently
    if (traits.givesUpOnHardTasks && newGoal.plannedLearning.length > 3) {
      newGoal.plannedLearning = newGoal.plannedLearning.slice(0, 2);
      newGoal.totalPlannedActions = newGoal.plannedLearning.length;
    }

    // 🧠 Avoid weekends if skip-prone
    const isWeekend = [0, 6].includes(new Date(newGoal.date).getDay());
    if (traits.skipsWeekend && isWeekend) {
      newGoal.status = "light"; // mark as light-load day (or push to weekday)
    }

    // ✅ Add memory-aware rescheduling logic here later...
    return newGoal;
  });
}
