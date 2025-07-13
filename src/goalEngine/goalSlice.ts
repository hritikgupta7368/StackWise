// ✅ File: /src/goalEngine/goalSlice.ts

import { StateCreator } from "zustand";
import { GoalForecast, GoalEngineMetrics, GoalHistoryLog, DailyGoal, PlannedAction, GoalMemory, ScheduledPlan, TimePatternMemory, UserGoalConfig, GoalDigest } from "./goalTypes";
import { calculateGoalEngineMetrics } from "./metricsTracker";
import { updateHourlyAnalytics } from "./hourlyUpdater";
import { AppState } from "@/types/types";
import { generateNext7DaysGoals } from "./generateNext7DaysGoals";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { generateDailySchedule } from "./scheduleGenerator";
import { adjustTodayGoal } from "./adjustTodayGoal";
import { analyzeTimePatterns } from "./timePatternTracker";
import { determineOptimalMode, applyModeToNextGoals } from "./modeController";
import { restructureFutureGoals } from "./restructureEngine";
import { generateGoalDigest } from "./digestGenerator";
import { calculateAdvancedForecast } from "./advancedForecast";

export interface GoalSlice {
  goal: {
    dailyGoals: DailyGoal[];
    historyLogs: GoalHistoryLog[];
    metrics: GoalEngineMetrics | null;
    memory: GoalMemory | null;
    scheduledPlans: ScheduledPlan[];
    timePatterns: TimePatternMemory[];
    goalDigest: GoalDigest | null;
    userConfig: UserGoalConfig;
    lastSyncTime: string | null;
    forecast: GoalForecast | null;
  };
  addDailyGoal: (goal: DailyGoal) => void;
  runHourlyUpdate: (date: string) => void;
  refreshMetrics: () => void;
  generateGoalsFromEngine: () => void; // ✅ Moved outside "goal"
  getTodayGoal: () => DailyGoal | null;
  refreshMemory: () => void;
  markActionCompleted: (goalDate: string, actionId: string) => void;
  generateScheduleForGoal: (goalDate: string) => void;
  updateTimePatterns: () => void;
  getScheduleForDate: (date: string) => ScheduledPlan | null;
  adjustTodayGoal: (goal: DailyGoal, memory: GoalMemory, metrics: GoalEngineMetrics) => void;
  rescheduleAction: (goalDate: string, actionId: string, newStartTime: string) => void;
  markActionStarted: (goalDate: string, actionId: string) => void;
  updateUserConfig: (config: Partial<UserGoalConfig>) => void;
  updateForecast: () => void;
  evaluateAndUpdateMode: () => void;
  restructureFutureGoals: () => void;
  generateDigest: (timeframe?: "daily" | "weekly" | "monthly") => GoalDigest;
  getWidgetData: () => {
    chartDataString: string;
    statusText: "Increasing" | "Steady" | "Slowing";
    displayPercentage: number;
  };
}

export const createGoalSlice: StateCreator<AppState & GoalSlice, [["zustand/immer", never]], [], GoalSlice> = (set, get, store) => ({
  goal: {
    dailyGoals: [],
    historyLogs: [],
    metrics: null,
    memory: {
      id: uuidv4(),
      userTraits: {},
      learningPatterns: [],
      lastUpdated: new Date().toISOString(),
    },
    scheduledPlans: [],
    timePatterns: [],
    userConfig: {
      mode: "normal",
      allowAutoAdjustment: true,
      forecastEnabled: true,
      revisionIntensity: 0.3,
      preferredDailyLoad: 4,
      streakProtection: true,
      createdAt: new Date().toISOString(),
    },
    goalDigest: null,
    lastSyncTime: null,
    forecast: null,
  },
  addDailyGoal: (goal) => {
    set((state) => {
      state.goal.dailyGoals.push(goal);
      state.goal.historyLogs.push({
        date: goal.date,
        actions: [...goal.plannedLearning, ...goal.plannedRevision].map((a) => ({
          ...a,
          startedAt: undefined,
          completedAt: undefined,
          scheduledStart: undefined,
          scheduledEnd: undefined,
          wasRescheduled: false,
        })),
        metadata: { generatedGoalId: goal.date },
        createdAt: new Date().toISOString(),
      });
    });
  },

  runHourlyUpdate: (date) => {
    set((state) => {
      const index = state.goal.historyLogs.findIndex((log) => log.date === date);
      if (index === -1) {
        console.warn("⚠️ No GoalHistoryLog found for date:", date);
        return;
      }

      const updated = updateHourlyAnalytics(state.goal.historyLogs[index]);
      // console.log("✅ Updated hourly analytics:", updated.hourlyStats.at(-1));
      state.goal.historyLogs[index] = updated;
    });
  },

  refreshMetrics: () => {
    const logs = get().goal.historyLogs;
    const metrics = calculateGoalEngineMetrics(logs);
    set((state) => {
      state.goal.metrics = metrics;
    });
  },

  generateGoalsFromEngine: () => {
    const state = get();

    const hasContent = state.dsa.problems.length > 0 || state.core.subtopics.length > 0 || state.interview.questions.length > 0 || state.systemDesign.subtopics.length > 0;

    if (!hasContent) {
      console.log("⚠️ No content found. Skipping goal generation.");
      return; // Exit if there's nothing to schedule
    }

    const startDate = new Date().toISOString().split("T")[0];

    //calls this function to generate goals for 7 days and store these goals in the DailyGoals array
    const { goals, updatedMemory } = generateNext7DaysGoals({
      appState: state,
      userConfig: {
        preferredDailyLoad: 4,
        revisionIntensity: 0.0, // ✅ No revision needed on day 1 (nothing to revise)
        mode: "normal", // ← required by GoalConfig
        allowAutoAdjustment: true, // ✅ Allow system to evolve in future
        forecastEnabled: false, // ❌ Skip forecast now — no data to base predictions on
        createdAt: new Date().toISOString(),
      },
      historyLogs: state.goal.historyLogs,
      startDate,
      carriedFromPreviousDay: state.goal.memory?.lastDayUncompleted || [],
      goalMemory: state.goal.memory,
    });

    set((state) => {
      state.goal.dailyGoals = goals;
      state.goal.memory = updatedMemory;

      // Correctly map PlannedAction to a HistoryLog action
      const newHistoryLogs = goals
        // Prevent adding duplicate logs if they already exist
        .filter((g) => !state.goal.historyLogs.some((log) => log.date === g.date))
        .map((goal) => ({
          date: goal.date,
          actions: [...goal.plannedLearning, ...goal.plannedRevision].map((a: PlannedAction) => ({
            id: a.id,
            domain: a.domain,
            originalType: a.originalType,
            type: a.type,
            title: a.title, // Add title
            topicId: a.topicId, // Add topicId
            topicTitle: a.topicTitle, // Add topicTitle
            difficultyLevel: a.difficultyLevel, // Add difficultyLevel
            isCompleted: false, // Ensure this is explicitly set
          })),
          metadata: { generatedGoalId: goal.date },
          createdAt: new Date().toISOString(),
        }));

      state.goal.historyLogs.push(...newHistoryLogs);
    });

    for (const goal of goals) {
      get().generateScheduleForGoal(goal.date);
    }
  },

  getTodayGoal: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().goal.dailyGoals.find((g) => g.date === today) || null;
  },
  refreshMemory: () => {
    const logs = get().goal.historyLogs;
    const memory: GoalMemory = {
      id: uuidv4(),
      userTraits: {},
      learningPatterns: [],
      lastUpdated: new Date().toISOString(),
    };
    let weekendSkips = 0;
    let hardTaskFailures = 0;
    let morningRevisions = 0;
    let endWeekStrong = 0;

    for (const log of logs) {
      const date = new Date(log.date);
      const isWeekend = date.getDay() === 6 || date.getDay() === 0;
      const completedIds = new Set(log.actions.filter((a) => a.isCompleted).map((a) => a.id));

      if (isWeekend && completedIds.size === 0) weekendSkips++;
      if (log.actions.some((a) => a.difficultyLevel === "hard" && !a.isCompleted)) hardTaskFailures++;
      if (log.actions.some((a) => a.type === "revise" && a.scheduledStart && new Date(a.scheduledStart).getHours() < 12)) morningRevisions++;
      if (date.getDay() === 5 && completedIds.size > 0) endWeekStrong++;
    }
    const total = logs.length;
    memory.userTraits = {
      skipsWeekend: weekendSkips >= total * 0.4,
      givesUpOnHardTasks: hardTaskFailures >= total * 0.3,
      prefersRevisionInMorning: morningRevisions >= 3,
      finishesStrongEndOfWeek: endWeekStrong >= 2,
    };
    memory.learningPatterns = [...(memory.userTraits.skipsWeekend ? ["weekend_drop"] : []), ...(memory.userTraits.givesUpOnHardTasks ? ["hard_avoid"] : []), ...(memory.userTraits.prefersRevisionInMorning ? ["morning_revision"] : []), ...(memory.userTraits.finishesStrongEndOfWeek ? ["strong_friday"] : [])];
    set((state) => {
      state.goal.memory = memory;
    });
  },

  generateScheduleForGoal: (goalDate) => {
    set((state) => {
      const goal = state.goal.dailyGoals.find((g) => g.date === goalDate);
      if (!goal) return;

      const actions = [...goal.plannedLearning, ...goal.plannedRevision];
      const schedule = generateDailySchedule(goalDate, actions, state.goal.timePatterns, state.goal.memory);

      const existingIndex = state.goal.scheduledPlans?.findIndex((p) => p.date === goalDate);
      if (existingIndex >= 0) {
        state.goal.scheduledPlans[existingIndex] = schedule;
      } else {
        state.goal.scheduledPlans?.push(schedule);
      }
    });
  },
  updateTimePatterns: () => {
    set((state) => {
      const logs = state.goal.historyLogs;
      const patterns = analyzeTimePatterns(logs);
      state.goal.timePatterns = patterns;
    });
  },
  getScheduleForDate: (date) => {
    const state = get();
    // Add null check to ensure scheduledPlans exists
    if (!state.goal || !state.goal.scheduledPlans) {
      console.log("⚠️ scheduledPlans not initialized");
      return null;
    }
    return state.goal.scheduledPlans.find((p) => p.date === date) || null;
  },
  adjustTodayGoal: (goal, memory, metrics) => {
    set((state) => {
      const goalIndex = state.goal.dailyGoals.findIndex((g) => g.date === goal.date);
      if (goalIndex === -1) return;

      // Use the adjustTodayGoal function we already defined
      const adjustedGoal = adjustTodayGoal({
        todayGoal: goal,
        goalMemory: memory,
        metrics: metrics,
      });

      state.goal.dailyGoals[goalIndex] = adjustedGoal;
    });
  },
  evaluateAndUpdateMode: () => {
    const state = get();

    if (!state.goal.metrics || !state.goal.historyLogs.length || !state.goal.userConfig) {
      console.log("⚠️ Can't evaluate mode: missing metrics, history, or config");
      return; // Can't evaluate without data
    }

    // Determine optimal mode based on current performance
    const optimalMode = determineOptimalMode(state.goal.metrics, state.goal.historyLogs, state.goal.userConfig);

    // Only update if auto-adjustment is enabled or mode is recovery (important)
    if (state.goal.userConfig.allowAutoAdjustment || optimalMode === "recovery") {
      const updatedConfigParts = applyModeToNextGoals(optimalMode, state.goal.userConfig);

      set((state) => {
        state.goal.userConfig = {
          ...state.goal.userConfig,
          ...updatedConfigParts,
        };

        // Also update metrics to reflect mode change
        if (state.goal.metrics) {
          state.goal.metrics.currentMode = optimalMode;
        }
      });
    }
  },
  restructureFutureGoals: () => {
    const state = get();
    const today = new Date().toISOString().split("T")[0];

    // Find today's goal index
    const todayIndex = state.goal.dailyGoals.findIndex((g) => g.date === today);

    if (todayIndex === -1 || !state.goal.metrics) {
      return; // Can't restructure without today's goal or metrics
    }

    // Restructure future goals based on today's performance
    const updatedGoals = restructureFutureGoals(state.goal.dailyGoals, todayIndex, state.goal.metrics, state.goal.historyLogs);

    set((state) => {
      state.goal.dailyGoals = updatedGoals;
    });

    // Re-generate schedules for the updated goals
    for (let i = todayIndex + 1; i < updatedGoals.length; i++) {
      get().generateScheduleForGoal(updatedGoals[i].date);
    }
  },
  generateDigest: (timeframe = "weekly") => {
    const state = get();

    const digest = generateGoalDigest(state.goal.historyLogs, timeframe);

    set((state) => {
      state.goal.goalDigest = digest;
    });

    return digest;
  },
  updateForecast: () => {
    const state = get();

    // Calculate domain totals
    const totalAvailableItems = {
      dsa: state.dsa.problems.length,
      core: state.core.subtopics.length,
      interview: state.interview.questions.length,
      systemDesign: state.systemDesign.subtopics.length,
    };

    if (state.goal.metrics) {
      const forecast = calculateAdvancedForecast(state.goal.historyLogs, state.goal.dailyGoals, state.goal.metrics, totalAvailableItems, new Date().toISOString().split("T")[0]);

      set((state) => {
        state.goal.forecast = forecast;
      });
    }
  },
  updateUserConfig: (config) => {
    set((state) => {
      state.goal.userConfig = {
        ...state.goal.userConfig,
        ...config,
        updatedAt: new Date().toISOString(),
      };
    });
  },
  markActionStarted: (goalDate, actionId) => {
    set((state) => {
      // Update in history logs
      const logIndex = state.goal.historyLogs.findIndex((log) => log.date === goalDate);
      if (logIndex >= 0) {
        const actionIndex = state.goal.historyLogs[logIndex].actions.findIndex((a) => a.id === actionId);
        if (actionIndex >= 0) {
          state.goal.historyLogs[logIndex].actions[actionIndex].startedAt = new Date().toISOString();
          console.log(`✅ Started action: ${actionId} at ${new Date().toLocaleTimeString()}`);
        } else {
          console.log(`⚠️ Action ${actionId} not found in logs`);
        }
      } else {
        console.log(`⚠️ Log for date ${goalDate} not found`);
      }
    });
  },
  // ✅ File: /src/goalEngine/goalSlice.ts

  markActionCompleted: (goalDate, actionId) => {
    const now = new Date().toISOString();

    set((state) => {
      // Find the index, not the object, to ensure we can modify the draft
      const goalIndex = state.goal.dailyGoals.findIndex((g) => g.date === goalDate);
      if (goalIndex === -1) return;

      const goal = state.goal.dailyGoals[goalIndex];
      if (goal.completedActionIds.includes(actionId)) return;

      // --- Correctly update the DailyGoal object in the draft state ---
      goal.completedActionIds.push(actionId);
      goal.totalCompleted = goal.completedActionIds.length;
      goal.percentCompleted = (goal.totalCompleted / goal.totalPlannedActions) * 100;
      goal.goalMet = goal.totalCompleted >= goal.totalPlannedActions;
      goal.updatedAt = now;

      // --- Correctly update the HistoryLog object in the draft state ---
      const logIndex = state.goal.historyLogs.findIndex((log) => log.date === goalDate);
      if (logIndex !== -1) {
        const actionIndex = state.goal.historyLogs[logIndex].actions.findIndex((a) => a.id === actionId);
        if (actionIndex !== -1) {
          // This modification now happens on the Immer draft, which is correct.
          state.goal.historyLogs[logIndex].actions[actionIndex].isCompleted = true;
          state.goal.historyLogs[logIndex].actions[actionIndex].completedAt = now;
        }
      }
    });

    // These will now run with the correctly updated state.
    get().refreshMetrics();
    get().evaluateAndUpdateMode();
    get().restructureFutureGoals();
  },
  rescheduleAction: (goalDate, actionId, newStartTime) => {
    set((state) => {
      // Update scheduled plan
      const planIndex = state.goal.scheduledPlans.findIndex((p) => p.date === goalDate);
      if (planIndex >= 0) {
        const slotIndex = state.goal.scheduledPlans[planIndex].slots.findIndex((s) => s.actionId === actionId);
        if (slotIndex >= 0) {
          const slot = state.goal.scheduledPlans[planIndex].slots[slotIndex];
          const oldStartTime = slot.startTime;

          // Calculate duration
          const startParts = oldStartTime.split(":").map(Number);
          const endParts = slot.endTime.split(":").map(Number);
          const durationMinutes = endParts[0] * 60 + endParts[1] - (startParts[0] * 60 + startParts[1]);

          // Calculate new end time
          const newStartParts = newStartTime.split(":").map(Number);
          const newEndMinutes = newStartParts[0] * 60 + newStartParts[1] + durationMinutes;
          const newEndHours = Math.floor(newEndMinutes / 60) % 24;
          const newEndMins = newEndMinutes % 60;
          const newEndTime = `${newEndHours.toString().padStart(2, "0")}:${newEndMins.toString().padStart(2, "0")}`;

          // Update slot
          state.goal.scheduledPlans[planIndex].slots[slotIndex].startTime = newStartTime;
          state.goal.scheduledPlans[planIndex].slots[slotIndex].endTime = newEndTime;
          state.goal.scheduledPlans[planIndex].slots[slotIndex].generatedBy = "user";
        }
      }

      // Also mark as rescheduled in history logs
      const logIndex = state.goal.historyLogs.findIndex((log) => log.date === goalDate);
      if (logIndex >= 0) {
        const actionIndex = state.goal.historyLogs[logIndex].actions.findIndex((a) => a.id === actionId);
        if (actionIndex >= 0) {
          state.goal.historyLogs[logIndex].actions[actionIndex].wasRescheduled = true;
          state.goal.historyLogs[logIndex].actions[actionIndex].scheduledStart = newStartTime;
        }
      }
    });
  },
  getWidgetData: () => {
    const { historyLogs } = get().goal;
    const state = get();

    // --- Overall Progress Calculation (for the 89% number) ---
    const allCompletedIds = new Set<string>();
    historyLogs.forEach((log) => {
      log.actions.forEach((action) => {
        if (action.isCompleted) allCompletedIds.add(action.id);
      });
    });
    const maxCompletedEver = allCompletedIds.size;

    const currentTotalItems = state.dsa.problems.length + state.core.subtopics.length + state.interview.questions.length + state.systemDesign.subtopics.length;
    const totalKnownItems = Math.max(currentTotalItems, maxCompletedEver);
    const displayPercentage = totalKnownItems > 0 ? Math.round((maxCompletedEver / totalKnownItems) * 100) : 0;

    // --- Chart Line Calculation (Daily Performance) ---
    const performanceByDate = new Map<string, number>();
    if (historyLogs.length > 0) {
      const sortedLogs = [...historyLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstDay = new Date(sortedLogs[0].date);
      const today = new Date();

      // Pre-populate all days from start to today with 0
      for (let day = new Date(firstDay); day <= today; day.setDate(day.getDate() + 1)) {
        performanceByDate.set(day.toISOString().slice(0, 10), 0);
      }

      // Now, fill in the actual completion counts for each day
      sortedLogs.forEach((log) => {
        const dailyCount = log.actions.filter((a) => a.isCompleted).length;
        performanceByDate.set(log.date, dailyCount);
      });
    }

    const chartPoints = Array.from(performanceByDate.values()).slice(-30); // Show last 30 days
    if (chartPoints.length < 2) {
      // Ensure there's always a line to draw
      chartPoints.unshift(0);
      if (chartPoints.length < 2) chartPoints.push(0);
    }

    const peakValue = Math.max(...chartPoints, 0);

    // --- Trend Calculation ---
    let statusText: "Increasing" | "Steady" | "Slowing" = "Steady";
    if (chartPoints.length >= 7) {
      const recentAverage = chartPoints.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const previousAverage = chartPoints.slice(-7, -4).reduce((a, b) => a + b, 0) / 3;
      if (recentAverage > previousAverage) statusText = "Increasing";
      if (recentAverage < previousAverage) statusText = "Slowing";
    }

    return {
      chartDataString: chartPoints.join(", "),
      statusText,
      displayPercentage,
      peakValue, // Send the peak value to the component
    };
  },
});
