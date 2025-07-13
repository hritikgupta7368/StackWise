// /src/goalEngine/timePatternTracker.ts
import { TimePatternMemory, GoalHistoryLog } from "./goalTypes";

export function analyzeTimePatterns(historyLogs: GoalHistoryLog[]): TimePatternMemory[] {
  // Group by domain-type
  const patternGroups: Record<
    string,
    {
      domain: "dsa" | "core" | "interview" | "systemDesign";
      actionType: "learn" | "revise";
      windows: Record<
        string,
        {
          usages: number;
          completions: number;
          totalDuration: number;
        }
      >;
    }
  > = {};

  for (const log of historyLogs) {
    for (const action of log.actions) {
      // Skip actions without timing data
      if (!action.startedAt) continue;

      const key = `${action.domain}-${action.type}`;
      if (!patternGroups[key]) {
        patternGroups[key] = {
          domain: action.domain,
          actionType: action.type,
          windows: {},
        };
      }

      // Determine the hour block (we'll use 2-hour blocks)
      const startHour = new Date(action.startedAt).getHours();
      const hourBlock = Math.floor(startHour / 2) * 2;
      const windowKey = `${hourBlock.toString().padStart(2, "0")}:00`;
      const endHour = hourBlock + 2;
      const endKey = `${endHour.toString().padStart(2, "0")}:00`;

      // Create or update window stats
      if (!patternGroups[key].windows[windowKey]) {
        patternGroups[key].windows[windowKey] = {
          usages: 0,
          completions: 0,
          totalDuration: 0,
        };
      }

      patternGroups[key].windows[windowKey].usages++;

      if (action.isCompleted) {
        patternGroups[key].windows[windowKey].completions++;

        if (action.startedAt && action.completedAt) {
          const startTime = new Date(action.startedAt).getTime();
          const endTime = new Date(action.completedAt).getTime();
          const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
          patternGroups[key].windows[windowKey].totalDuration += durationMinutes;
        }
      }
    }
  }

  // Convert to TimePatternMemory objects
  const timePatterns: TimePatternMemory[] = Object.entries(patternGroups).map(([key, group]) => {
    const timeWindows = Object.entries(group.windows).map(([startTime, stats]) => {
      // Calculate end time (2 hours after start)
      const [hours] = startTime.split(":").map(Number);
      const endHours = (hours + 2) % 24;
      const endTime = `${endHours.toString().padStart(2, "0")}:00`;

      return {
        start: startTime,
        end: endTime,
        averageDuration: stats.completions > 0 ? stats.totalDuration / stats.completions : 30, // default to 30 mins
        successRate: stats.usages > 0 ? stats.completions / stats.usages : 0,
        usageCount: stats.usages,
      };
    });

    return {
      id: key, // Using the composite key as ID
      actionType: group.actionType,
      domain: group.domain,
      timeWindows: timeWindows,
      lastUpdated: new Date().toISOString(),
    };
  });

  return timePatterns;
}
