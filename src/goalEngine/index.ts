// /src/goalEngine/index.ts
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { AppState } from "react-native";
import { useAppStore } from "@/store/useStore";
import { logDebug } from "@/utils/logUtils";

// Constants
const GOAL_ENGINE_SYNC_TASK = "GOAL_ENGINE_SYNC_TASK";
let foregroundTimer: ReturnType<typeof setInterval> | null = null;

// ⛔ Set this to false once you're in a dev build or prod build
const isExpoGo = false;

// 🔧 Define the background task
TaskManager.defineTask(GOAL_ENGINE_SYNC_TASK, async () => {
  try {
    logDebug("🔄 Background: Running goal engine sync");
    await performGoalEngineSync();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    logDebug(error, {
      label: "index.ts",
      level: "error",
      stringify: true,
      trace: true,
    });
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// 🔁 The main logic shared across both modes
async function performGoalEngineSync() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  logDebug(`🧠 Goal Engine Sync @ ${now.toLocaleTimeString()}`, {
    label: "performGoalEngineSync",
    level: "info",
  });

  try {
    const store = useAppStore.getState();
    const { goal: goalState, dsa, core, interview, systemDesign } = store;

    if (!goalState) {
      logDebug("❌ Store or goal slice not available", {
        label: "performGoalEngineSync",
        level: "warn",
      });
      return;
    }

    // --- State Machine Logic for Goal Generation ---
    const hasContent = dsa.problems.length > 0 || core.subtopics.length > 0 || interview.questions.length > 0 || systemDesign.subtopics.length > 0;
    const todayGoal = store.getTodayGoal();
    const todayGoalExists = !!todayGoal;
    const todayGoalIsEmpty = todayGoalExists && todayGoal.totalPlannedActions === 0;

    // DECISION: Should we generate goals?
    // We generate if:
    // 1. There are no goals for today, AND we have content.
    // 2. Or, there IS a goal for today, but it's empty (from a previous run), AND we now have content.
    const shouldGenerateGoals = hasContent && (!todayGoalExists || todayGoalIsEmpty);

    if (shouldGenerateGoals) {
      logDebug("🎯 Condition met. Generating new goals...");
      store.generateGoalsFromEngine();
    }
    // --- End of State Machine Logic ---

    // The rest of the engine runs based on the (now potentially updated) state.
    store.runHourlyUpdate?.(todayStr);
    store.refreshMetrics?.();
    store.evaluateAndUpdateMode?.();

    if (!goalState.goalDigest) {
      store.generateDigest?.("weekly");
    }

    if (goalState.metrics && goalState.userConfig.forecastEnabled) {
      store.updateForecast?.();
    }

    // Use the potentially newly generated goal for today's adjustments
    const finalTodayGoal = store.getTodayGoal();
    if (finalTodayGoal && now.getHours() >= 14) {
      store.adjustTodayGoal?.(finalTodayGoal, goalState.memory, goalState.metrics);
    }

    if (now.getHours() < 10) {
      store.updateTimePatterns?.();
      store.refreshMemory?.();
    }

    if (now.getHours() >= 18) {
      store.restructureFutureGoals?.();
    }

    logDebug("✅ Goal engine sync complete");
  } catch (err) {
    logDebug(err, {
      label: "performGoalEngineSync",
      level: "error",
      stringify: true,
      trace: true,
    });
    throw err;
  }
}

// 🔐 Register background task
async function registerBackgroundTask() {
  try {
    await BackgroundTask.registerTaskAsync(GOAL_ENGINE_SYNC_TASK, {
      minimumInterval: 60, // minutes
    });
    logDebug("✅ Background task registered");
  } catch (e) {
    logDebug(e, {
      label: "registerBackgroundTask",
      level: "error",
      stringify: true,
      trace: true,
    });
  }
}

// ❌ Unregister task
async function unregisterBackgroundTask() {
  try {
    await BackgroundTask.unregisterTaskAsync(GOAL_ENGINE_SYNC_TASK);
    logDebug("✅ Task unregistered");
  } catch (e) {
    logDebug(e, {
      label: "unregisterBackgroundTask",
      level: "error",
      stringify: true,
      trace: true,
    });
  }
}

// 🔎 Check task status
async function checkBackgroundTaskStatus() {
  const status = await BackgroundTask.getStatusAsync();
  const tasks = await TaskManager.getRegisteredTasksAsync();
  const isRegistered = tasks.some((t) => t.taskName === GOAL_ENGINE_SYNC_TASK);

  logDebug(`📊 BackgroundTask status: ${BackgroundTask.BackgroundTaskStatus[status]}`, {
    label: "checkBackgroundTaskStatus",
    level: "info",
  });
  logDebug(`📝 Task registered: ${isRegistered}`, {
    label: "GoalEngine",
    level: "info",
  });

  return {
    status,
    isRegistered,
  };
}

// 🚀 Start the engine
export async function startGoalEngine() {
  await performGoalEngineSync();

  const startForegroundLoop = (intervalMs: number) => {
    if (!foregroundTimer) {
      foregroundTimer = setInterval(() => performGoalEngineSync(), intervalMs);
      AppState.addEventListener("change", (state) => {
        if (state === "active") {
          performGoalEngineSync();
        }
      });
    }
  };

  if (isExpoGo) {
    logDebug("⚠️ Expo Go: using foreground-only mode", {
      label: "startGoalEngine",
      level: "warn",
    });
    startForegroundLoop(3 * 60 * 1000); // every 15 min
  } else {
    const { status, isRegistered } = await checkBackgroundTaskStatus();

    if (status === BackgroundTask.BackgroundTaskStatus.Available) {
      if (!isRegistered) await registerBackgroundTask();
      startForegroundLoop(60 * 60 * 1000); // every 1 hour
    } else {
      logDebug("⚠️ BG task unavailable, fallback to foreground", {
        label: "startGoalEngine",
        level: "warn",
      });
      startForegroundLoop(15 * 60 * 1000);
    }
  }

  logDebug("✅ Goal Engine started");

  return () => {
    if (foregroundTimer) {
      clearInterval(foregroundTimer);
      foregroundTimer = null;
    }
  };
}

// 📦 Export controller for external use
export const GoalEngineBackgroundService = {
  registerTask: registerBackgroundTask,
  unregisterTask: unregisterBackgroundTask,
  checkStatus: checkBackgroundTaskStatus,
  taskName: GOAL_ENGINE_SYNC_TASK,
};
