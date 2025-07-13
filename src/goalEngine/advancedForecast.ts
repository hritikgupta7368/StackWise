// ✅ File: /src/goalEngine/advancedForecasr.ts
import { GoalForecast, GoalHistoryLog, DailyGoal, GoalEngineMetrics } from "./goalTypes";

export function calculateAdvancedForecast(
  history: GoalHistoryLog[],
  dailyGoals: DailyGoal[],
  metrics: GoalEngineMetrics,
  totalAvailableItems: {
    dsa: number;
    core: number;
    interview: number;
    systemDesign: number;
  },
  currentDate: string,
): GoalForecast {
  // Get performance metrics from history
  const domainProgress = calculateDomainProgress(history, totalAvailableItems);

  // Calculate learning velocity (items per active day) for each domain
  const velocities = calculateLearningVelocities(history, 30); // based on last 30 days

  // Apply learning curve adjustments
  const adjustedVelocities = applyLearningCurveAdjustments(velocities, domainProgress, metrics);

  // Calculate ETAs based on adjusted velocities
  const dsaETA = calculateETA(velocities.dsa, domainProgress.dsa.completed, totalAvailableItems.dsa);

  const coreETA = calculateETA(velocities.core, domainProgress.core.completed, totalAvailableItems.core);

  const interviewETA = calculateETA(velocities.interview, domainProgress.interview.completed, totalAvailableItems.interview);

  const systemDesignETA = calculateETA(velocities.systemDesign, domainProgress.systemDesign.completed, totalAvailableItems.systemDesign);

  // Get active days pattern for realistic scheduling
  const activeRatio = calculateActiveRatio(history, 14); // based on last 14 days

  // Account for user's consistency pattern
  const realDaysPerWeek = Math.min(7, Math.max(1, Math.round(7 * activeRatio)));

  // Apply ratio to ETAs (convert from active days to calendar days)
  const adjustedETAs = {
    dsa: adjustByActiveRatio(dsaETA, activeRatio),
    core: adjustByActiveRatio(coreETA, activeRatio),
    interview: adjustByActiveRatio(interviewETA, activeRatio),
    systemDesign: adjustByActiveRatio(systemDesignETA, activeRatio),
  };

  // Create the forecast
  const forecast: GoalForecast = {
    generatedAt: new Date().toISOString(),
    dsaETA: adjustedETAs.dsa,
    coreETA: adjustedETAs.core,
    interviewETA: adjustedETAs.interview,
    systemDesignETA: adjustedETAs.systemDesign,
    basedOn: {
      avgDailyLoad: metrics.avgCompletionRate * (velocities.dsa + velocities.core + velocities.interview + velocities.systemDesign),
      streak: metrics.consistencyStreak,
      missedDays: countMissedDays(history, 30), // last 30 days
      totalAvailableItems,
    },
  };

  return forecast;
}

// Helper function to calculate domain progress
function calculateDomainProgress(history: GoalHistoryLog[], totalItems: any) {
  // Count completed items by domain
  const completed = {
    dsa: 0,
    core: 0,
    interview: 0,
    systemDesign: 0,
  };

  // Track unique completed items
  const uniqueCompleted: Record<string, Set<string>> = {
    dsa: new Set<string>(),
    core: new Set<string>(),
    interview: new Set<string>(),
    systemDesign: new Set<string>(),
  };

  for (const log of history) {
    for (const action of log.actions) {
      if (action.isCompleted) {
        const domain = action.domain;
        uniqueCompleted[domain].add(action.id);
      }
    }
  }

  // Convert sets to counts
  completed.dsa = uniqueCompleted.dsa.size;
  completed.core = uniqueCompleted.core.size;
  completed.interview = uniqueCompleted.interview.size;
  completed.systemDesign = uniqueCompleted.systemDesign.size;

  return {
    dsa: {
      completed: completed.dsa,
      total: totalItems.dsa,
      percent: totalItems.dsa > 0 ? (completed.dsa / totalItems.dsa) * 100 : 0,
    },
    core: {
      completed: completed.core,
      total: totalItems.core,
      percent: totalItems.core > 0 ? (completed.core / totalItems.core) * 100 : 0,
    },
    interview: {
      completed: completed.interview,
      total: totalItems.interview,
      percent: totalItems.interview > 0 ? (completed.interview / totalItems.interview) * 100 : 0,
    },
    systemDesign: {
      completed: completed.systemDesign,
      total: totalItems.systemDesign,
      percent: totalItems.systemDesign > 0 ? (completed.systemDesign / totalItems.systemDesign) * 100 : 0,
    },
  };
}

// Helper to calculate learning velocities (items/active day)
function calculateLearningVelocities(history: GoalHistoryLog[], days: number = 30) {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Filter recent history
  const recentHistory = history.filter((log) => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate;
  });

  // Get unique active days per domain
  const activeDays = {
    dsa: new Set<string>(),
    core: new Set<string>(),
    interview: new Set<string>(),
    systemDesign: new Set<string>(),
  };

  // Count completed items per domain
  const completedItems = {
    dsa: 0,
    core: 0,
    interview: 0,
    systemDesign: 0,
  };

  for (const log of recentHistory) {
    for (const action of log.actions) {
      if (action.isCompleted) {
        const domain = action.domain;
        activeDays[domain].add(log.date);
        completedItems[domain]++;
      }
    }
  }

  // Calculate velocities (items/day)
  return {
    dsa: activeDays.dsa.size > 0 ? completedItems.dsa / activeDays.dsa.size : 0,
    core: activeDays.core.size > 0 ? completedItems.core / activeDays.core.size : 0,
    interview: activeDays.interview.size > 0 ? completedItems.interview / activeDays.interview.size : 0,
    systemDesign: activeDays.systemDesign.size > 0 ? completedItems.systemDesign / activeDays.systemDesign.size : 0,
  };
}

// Apply learning curve - as we progress, we get better and faster
function applyLearningCurveAdjustments(velocities: any, progress: any, metrics: GoalEngineMetrics) {
  const result = { ...velocities };

  // Apply learning curve boost based on progress percentage
  Object.keys(result).forEach((domain) => {
    const progressPercent = progress[domain].percent;

    // Modest boost for domains where we've made good progress
    // (experience makes us faster)
    if (progressPercent > 30) {
      result[domain] *= 1 + progressPercent / 200; // Up to 50% boost at 100% completion
    }
  });

  // Also consider streak for overall efficiency boost
  const streakMultiplier = 1 + Math.min(0.2, metrics.consistencyStreak / 50);

  Object.keys(result).forEach((domain) => {
    result[domain] *= streakMultiplier;
  });

  return result;
}

// Calculate ETA in days based on velocity and remaining items
function calculateETA(velocity: number, completed: number, total: number): number {
  if (velocity <= 0) return 999; // Safety check

  const remaining = Math.max(0, total - completed);
  return Math.ceil(remaining / velocity);
}

// Calculate what percentage of days the user is active
function calculateActiveRatio(history: GoalHistoryLog[], days: number = 14): number {
  const now = new Date();
  let daysToCheck = days;
  const activeDays = new Set<string>();

  // Determine how far back we need to look
  const oldestNeeded = new Date(now);
  oldestNeeded.setDate(oldestNeeded.getDate() - days);

  // Count active days
  for (const log of history) {
    const logDate = new Date(log.date);
    if (logDate >= oldestNeeded) {
      if (log.actions.some((a) => a.isCompleted)) {
        activeDays.add(log.date);
      }
    }
  }

  // Calculate ratio
  return activeDays.size / daysToCheck;
}

// Adjust days estimate based on active ratio
function adjustByActiveRatio(days: number, activeRatio: number): number {
  // Safety checks
  if (activeRatio <= 0) return days * 7; // Assume 1 day/week worst case
  if (activeRatio >= 1) return days; // No adjustment needed

  // Convert active days to calendar days
  // For example, if user studies 4 days/week, multiply by 7/4
  return Math.ceil(days / activeRatio);
}

// Count days where user had goals but didn't complete anything
function countMissedDays(history: GoalHistoryLog[], days: number): number {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  let missed = 0;

  for (const log of history) {
    const logDate = new Date(log.date);
    if (logDate >= cutoffDate && logDate <= now) {
      if (log.actions.length > 0 && !log.actions.some((a) => a.isCompleted)) {
        missed++;
      }
    }
  }

  return missed;
}
