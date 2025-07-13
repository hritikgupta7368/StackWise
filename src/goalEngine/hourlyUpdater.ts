// ✅ File: /src/goalEngine/hourlyUpdater.ts
import { GoalHistoryLog, HourlyAnalytics } from "./goalTypes";

export function updateHourlyAnalytics(log: GoalHistoryLog): GoalHistoryLog {
  const now = new Date();
  const currentHour = now.getHours();
  const timestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour).toISOString();

  const total = log.actions.length;
  const completed = log.actions.filter((a) => a.isCompleted).length;
  const missedSoFar = log.actions.filter((a) => {
    if (!a.scheduledEnd) return false;
    return new Date(a.scheduledEnd) < now && !a.isCompleted;
  }).length;
  const remaining = total - completed;

  const early = log.actions.filter((a) => a.startedAt && a.scheduledStart && new Date(a.startedAt) < new Date(a.scheduledStart)).length;
  const late = log.actions.filter((a) => a.startedAt && a.scheduledStart && new Date(a.startedAt) > new Date(a.scheduledStart)).length;
  const unscheduledStarted = log.actions.filter((a) => a.startedAt && !a.scheduledStart).length;
  const rescheduledByUser = log.actions.filter((a) => a.wasRescheduled).length;

  const hourlySnapshot: HourlyAnalytics = {
    timestamp,
    plannedActionsSnapshot: {
      total,
      completed,
      missedSoFar,
      remaining,
    },
    deviations: {
      early,
      late,
      unscheduledStarted,
      rescheduledByUser,
    },
  };

  log.hourlyStats = log.hourlyStats || [];
  log.hourlyStats.push(hourlySnapshot);

  return log;
}
