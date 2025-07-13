// /src/goalEngine/modeController.ts
import { GoalEngineMetrics, GoalHistoryLog, UserGoalConfig } from "./goalTypes";

export type ModeType = "normal" | "boost" | "light" | "lowLoad" | "recovery";

export interface ModeSettings {
  preferredDailyLoad: number;
  revisionIntensity: number;
  maxDifficulty: "easy" | "medium" | "hard";
}

export function getModeSettings(mode: ModeType, baseConfig: UserGoalConfig): ModeSettings {
  // Base load is from user config
  const baseLoad = baseConfig.preferredDailyLoad || 4;
  const baseRevision = baseConfig.revisionIntensity || 0.25;

  switch (mode) {
    case "boost":
      return {
        preferredDailyLoad: Math.ceil(baseLoad * 1.5),
        revisionIntensity: baseRevision * 0.8, // Less revision, more new content
        maxDifficulty: "hard",
      };
    case "light":
      return {
        preferredDailyLoad: Math.floor(baseLoad * 0.7),
        revisionIntensity: baseRevision * 1.2, // More revision
        maxDifficulty: "medium",
      };
    case "lowLoad":
      return {
        preferredDailyLoad: Math.max(1, Math.floor(baseLoad * 0.5)),
        revisionIntensity: baseRevision * 1.5, // Heavy focus on revision
        maxDifficulty: "easy",
      };
    case "recovery":
      return {
        preferredDailyLoad: Math.max(1, Math.floor(baseLoad * 0.3)),
        revisionIntensity: 0.5, // Half revision, half easy new content
        maxDifficulty: "easy",
      };
    case "normal":
    default:
      return {
        preferredDailyLoad: baseLoad,
        revisionIntensity: baseRevision,
        maxDifficulty: "hard",
      };
  }
}

export function determineOptimalMode(metrics: GoalEngineMetrics, history: GoalHistoryLog[], currentConfig: UserGoalConfig | null): ModeType {
  // If user has explicitly set a mode and it's recent, respect it
  const userModeAge = currentConfig && currentConfig.updatedAt ? (Date.now() - new Date(currentConfig.updatedAt).getTime()) / (1000 * 60 * 60 * 24) : 999; // Default to old

  // If user set mode in last 2 days, respect it
  if (userModeAge < 2 && currentConfig) {
    return currentConfig.mode || "normal";
  }

  // Otherwise determine algorithmically

  // Check streak status
  const hasStreak = metrics.consistencyStreak > 3;

  // Check completion rates
  const poorCompletion = metrics.avgCompletionRate < 0.5;
  const goodCompletion = metrics.avgCompletionRate > 0.8;

  // Check recent performance (last 3 days)
  const last3Days = history
    .filter((log) => {
      const logDate = new Date(log.date);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return logDate >= threeDaysAgo;
    })
    .slice(0, 3);

  const recentCompletionRate = last3Days.length
    ? last3Days.reduce((sum, log) => {
        const completed = log.actions.filter((a) => a.isCompleted).length;
        const total = log.actions.length;
        return sum + (total ? completed / total : 0);
      }, 0) / last3Days.length
    : 0;

  // Decision tree
  if (!hasStreak && poorCompletion) {
    // User is struggling - go to recovery mode
    return "recovery";
  } else if (hasStreak && recentCompletionRate < 0.4) {
    // User has streak but struggled in last 3 days - go to lowLoad
    return "lowLoad";
  } else if (hasStreak && recentCompletionRate > 0.9) {
    // User is doing great - offer boost
    return "boost";
  } else if (hasStreak && goodCompletion) {
    // User is doing well - normal mode
    return "normal";
  } else {
    // Default - light mode
    return "light";
  }
}

export function applyModeToNextGoals(mode: ModeType, baseConfig: UserGoalConfig): UserGoalConfig {
  const modeSettings = getModeSettings(mode, baseConfig);

  return {
    preferredDailyLoad: modeSettings.preferredDailyLoad,
    revisionIntensity: modeSettings.revisionIntensity,
    updatedAt: new Date().toISOString(),
  };
}
