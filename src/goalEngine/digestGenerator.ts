// ✅ File: /src/goalEngine/digestGenerator.ts
import { GoalDigest, GoalHistoryLog } from "./goalTypes";

export function generateGoalDigest(logs: GoalHistoryLog[], timeframe: "daily" | "weekly" | "monthly" = "weekly"): GoalDigest {
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  // Determine time range
  switch (timeframe) {
    case "daily":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "monthly":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // Default to weekly
  }

  // Filter logs in the time range
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  });

  // Collect stats
  let totalTasks = 0;
  let completed = 0;
  let skipped = 0;
  let bonus = 0;
  let missedGoals = 0;

  // Track domain performance
  const domainStats: Record<
    string,
    {
      total: number;
      completed: number;
      percentComplete: number;
    }
  > = {
    dsa: { total: 0, completed: 0, percentComplete: 0 },
    core: { total: 0, completed: 0, percentComplete: 0 },
    interview: { total: 0, completed: 0, percentComplete: 0 },
    systemDesign: { total: 0, completed: 0, percentComplete: 0 },
  };

  // Track topics
  const topicCounts: Record<string, number> = {};

  // Track mood if available
  const moodCounts = {
    great: 0,
    okay: 0,
    tired: 0,
    bad: 0,
  };

  // Process each log
  for (const log of filteredLogs) {
    // Count overall tasks
    const logTotalTasks = log.actions.length;
    const logCompletedTasks = log.actions.filter((a) => a.isCompleted).length;

    totalTasks += logTotalTasks;
    completed += logCompletedTasks;
    skipped += logTotalTasks - logCompletedTasks;

    // Check if goal was missed
    if (logCompletedTasks < logTotalTasks * 0.7) {
      // Less than 70% completion
      missedGoals++;
    }

    // Count any tasks beyond what was scheduled as bonus
    if (log.metadata?.extraCompleted) {
      bonus += log.metadata?.extraCompleted;
    }

    // Track domain stats
    for (const action of log.actions) {
      // Update domain totals
      if (domainStats[action.domain]) {
        domainStats[action.domain].total++;
        if (action.isCompleted) {
          domainStats[action.domain].completed++;
        }
      }

      // Track topics
      const topicKey = action?.topicTitle || action?.title;
      topicCounts[topicKey] = (topicCounts[topicKey] || 0) + 1;
    }

    // Track mood if available
    if (log.metadata.mood) {
      const mood = log.metadata.mood;
      if (mood === "great" || mood === "okay" || mood === "tired" || mood === "low") {
        moodCounts[mood === "low" ? "bad" : mood]++;
      }
    }
  }

  // Calculate domain percentages
  Object.keys(domainStats).forEach((domain) => {
    const stats = domainStats[domain];
    stats.percentComplete = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  });

  // Find top and weak domains
  const sortedDomains = Object.entries(domainStats).sort((a, b) => b[1].percentComplete - a[1].percentComplete);

  const topDomain = sortedDomains.length > 0 ? (sortedDomains[0][0] as "dsa" | "core" | "interview" | "systemDesign") : "dsa";

  const weakDomain = sortedDomains.length > 1 && sortedDomains[sortedDomains.length - 1][1].total > 0 ? sortedDomains[sortedDomains.length - 1][0] : undefined;

  // Find most studied topic
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  const mostStudiedTopic = sortedTopics.length > 0 ? sortedTopics[0][0] : undefined;

  // Build the digest
  const digest: GoalDigest = {
    timeframe,
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    totalTasks,
    completed,
    skipped,
    bonus,
    missedGoals,
    topDomain,
    weakDomain,
    mostStudiedTopic,
    moodSummary: Object.keys(moodCounts).some((k) => moodCounts[k as keyof typeof moodCounts] > 0) ? moodCounts : undefined,
  };

  return digest;
}
