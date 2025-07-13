// /src/goalEngine/generateNext7DaysGoals.ts
import { addDays, formatISO } from "date-fns";
import { DailyGoal, PlannedAction, UserGoalConfig, GoalMemory, GoalHistoryLog } from "./goalTypes";
import { AppState } from "@/types/types";
import { selectItemsForRevision } from "./selectRevisionItems";
import { getAvailableItems } from "./getAvailableItems";

type GenerateResult = {
  goals: DailyGoal[];
  updatedMemory: GoalMemory;
};

export function generateNext7DaysGoals({ appState, userConfig, goalMemory, historyLogs = [], startDate, carriedFromPreviousDay = [] }: { appState: AppState; userConfig: UserGoalConfig; goalMemory?: GoalMemory; historyLogs?: GoalHistoryLog[]; startDate: string; carriedFromPreviousDay?: PlannedAction[] }): GenerateResult {
  const goals: DailyGoal[] = [];
  const load = userConfig.preferredDailyLoad || 4;
  const revisionRatio = userConfig.revisionIntensity ?? 0.25; //So: 3 learning + 1 revision per day

  // Track used IDs across ALL days
  const globalUsedIds = new Set<string>();

  // Track IDs used in each specific day
  const usedIdsByDay: Record<string, Set<string>> = {};

  // ⬇️ NEW: Filter out already completed carried items from history
  const completedIdsFromHistory = new Set(historyLogs.flatMap((log) => log.actions.filter((a) => a.isCompleted).map((a) => a.id)));

  // Combine carried items from memory + parameter, remove duplicates by ID, and exclude completed ones
  const uniqueInitialCarry = Array.from(new Map([...carriedFromPreviousDay, ...(goalMemory?.lastDayUncompleted || [])].filter((item) => !completedIdsFromHistory.has(item.id)).map((item) => [item.id, item])).values());

  // Start with unique carry items
  let itemsToCarryOver = [...uniqueInitialCarry];
  itemsToCarryOver.forEach((item) => globalUsedIds.add(item.id));

  for (let i = 0; i < 7; i++) {
    const date = formatISO(addDays(new Date(startDate), i), { representation: "date" });

    // Initialize tracking for this day
    usedIdsByDay[date] = new Set<string>();

    const revisionLimit = Math.floor(load * revisionRatio);
    const learnLimit = Math.max(0, load - revisionLimit);

    const plannedLearning: PlannedAction[] = [];

    // 1. Process carry-over items first (up to the limit)
    for (const item of itemsToCarryOver) {
      // CRITICAL CHECK: Only add if not already used on this day
      if (!usedIdsByDay[date].has(item.id) && plannedLearning.length < learnLimit) {
        plannedLearning.push({ ...item, type: "learn", isCompleted: false });

        // Mark as used for this day AND globally
        usedIdsByDay[date].add(item.id);
        globalUsedIds.add(item.id);
      }
    }

    // 2. Add revision items, ensuring they're not duplicated
    const exclusionIds = new Set<string>([...globalUsedIds, ...plannedLearning.map((item) => item.id)]);

    const plannedRevision = selectItemsForRevision(historyLogs, revisionLimit, Array.from(exclusionIds));

    // Mark revision IDs as used
    plannedRevision.forEach((item) => {
      usedIdsByDay[date].add(item.id);
      globalUsedIds.add(item.id);
    });

    // 3. Fill remaining slots with fresh items
    const remainingSlots = learnLimit - plannedLearning.length;

    if (remainingSlots > 0) {
      const freshItems = getAvailableItems(
        appState,
        Array.from(globalUsedIds), // Exclude all globally used IDs
        "learn",
        remainingSlots,
      );

      // Add fresh items and mark as used
      freshItems.forEach((item) => {
        plannedLearning.push(item);
        usedIdsByDay[date].add(item.id);
        globalUsedIds.add(item.id);
      });
    }

    // Create the daily goal
    const totalPlanned = plannedLearning.length + plannedRevision.length;
    const dailyGoal: DailyGoal = {
      date,
      plannedLearning, // Already guaranteed unique
      plannedRevision, // Already guaranteed unique
      completedActionIds: [],
      totalPlannedActions: totalPlanned,
      totalCompleted: 0,
      percentCompleted: 0,
      goalMet: false,
      status: "active",
      createdAt: new Date().toISOString(),
      carriedFromYesterday: itemsToCarryOver.filter((item) => plannedLearning.some((p) => p.id === item.id)),
    };

    goals.push(dailyGoal);

    // FIXED CARRY LOGIC: Only carry uncompleted items
    // that weren't completed today
    itemsToCarryOver = plannedLearning.filter((item) => !dailyGoal.completedActionIds.includes(item.id));
  }

  const updatedMemory: GoalMemory = {
    ...(goalMemory || {
      id: "memory-" + Date.now(),
      userTraits: {},
      learningPatterns: [],
      lastUpdated: new Date().toISOString(),
    }),
    lastDayUncompleted: itemsToCarryOver,
    lastRun: new Date().toISOString(), // Fixed typo
    lastUpdated: new Date().toISOString(),
  };

  return { goals, updatedMemory };
}
