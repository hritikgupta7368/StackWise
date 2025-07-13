// ✅ File: /src/goalEngine/adjustTodayGoal.ts
import { DailyGoal, GoalMemory, GoalEngineMetrics } from "./goalTypes";

export function adjustTodayGoal({ todayGoal, goalMemory, metrics }: { todayGoal: DailyGoal; goalMemory: GoalMemory; metrics: GoalEngineMetrics }): DailyGoal {
  const adjusted = { ...todayGoal };
  const now = new Date();
  const hour = now.getHours();

  // ✅ 1. Already completed
  if (todayGoal.percentCompleted === 100) return todayGoal;

  // ✅ 2. Skip adjustments before 2PM
  if (hour < 14) return todayGoal;

  // ✅ 3. Smart adaptation based on metrics
  if (metrics.skippedRate > 0.5) {
    adjusted.plannedLearning = adjusted.plannedLearning.slice(0, 2); // reduce load
  }

  if (metrics.consistencyStreak < 2 && adjusted.plannedLearning.length > 2) {
    adjusted.plannedLearning = adjusted.plannedLearning.slice(0, 2);
  }

  // ✅ 4. Traits-based tweaks (optional expansion)
  if (goalMemory.userTraits?.prefersRevisionInMorning) {
    adjusted.plannedRevision.forEach((r) => {
      r.scheduledStart = new Date().setHours(9, 0, 0, 0); // 9 AM
    });
  }

  // ✅ 5. Fallback logic from your older version
  const unstarted = adjusted.plannedLearning.filter((a) => !a.isCompleted);
  if (unstarted.length > 2) {
    adjusted.plannedLearning.pop(); // trim one item
  }

  // ✅ 6. Update counts
  adjusted.totalPlannedActions = adjusted.plannedLearning.length + adjusted.plannedRevision.length;
  adjusted.updatedAt = new Date().toISOString();

  return adjusted;
}
