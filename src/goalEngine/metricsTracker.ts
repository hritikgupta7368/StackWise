// ✅ File: /src/goalEngine/metricsTracker.ts

import { GoalEngineMetrics, GoalHistoryLog } from "./goalTypes";

export function calculateGoalEngineMetrics(history: GoalHistoryLog[]): GoalEngineMetrics {
  const totalGoalsGenerated = history.length;
  let totalCompleted = 0;
  let totalScheduled = 0;
  let skipped = 0;
  let early = 0;
  let avgTimePerTaskSum = 0;
  let taskCountWithTime = 0;
  let preferredTimes: Record<string, number> = {}; // hour -> count

  let currentStreak = 0;
  let maxStreak = 0;
  let streak = 0;

  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split("T")[0];
    const dayLog = history.find((h) => h.date === dateStr);

    if (dayLog && dayLog.actions.some((a) => a.isCompleted)) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      if (i === 0) currentStreak = 0;
      else break;
    }
  }

  for (const log of history) {
    for (const action of log.actions) {
      totalScheduled++;
      if (action.isCompleted) {
        totalCompleted++;

        if (action.startedAt && action.completedAt) {
          const start = new Date(action.startedAt);
          const end = new Date(action.completedAt);
          const timeSpent = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
          avgTimePerTaskSum += timeSpent;
          taskCountWithTime++;

          const hour = start.getHours();
          preferredTimes[hour] = (preferredTimes[hour] || 0) + 1;

          // early completion detection
          if (action.scheduledStart && start < new Date(action.scheduledStart)) {
            early++;
          }
        }
      } else {
        skipped++;
      }
    }
  }

  const avgCompletionRate = totalScheduled > 0 ? totalCompleted / totalScheduled : 0;
  const skippedRate = totalScheduled > 0 ? skipped / totalScheduled : 0;
  const earlyCompletionRate = totalCompleted > 0 ? early / totalCompleted : 0;
  const avgTimePerTask = taskCountWithTime > 0 ? avgTimePerTaskSum / taskCountWithTime : undefined;

  const preferredTimesOfDay = Object.entries(preferredTimes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([hour]) => {
      const h = parseInt(hour);
      if (h < 12) return "morning";
      if (h < 18) return "evening";
      return "night";
    });

  const metrics: GoalEngineMetrics = {
    totalGoalsGenerated,
    avgCompletionRate,
    consistencyStreak: streak,
    maxStreak,
    currentMode: "normal", // this can be updated externally or by another logic block
    avgTimePerTask,
    skippedRate,
    earlyCompletionRate,
    preferredTimesOfDay,
    updatedAt: new Date().toISOString(),
  };

  return metrics;
}
