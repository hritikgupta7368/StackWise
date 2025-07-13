// ✅ File: /src/goalEngine/scheduleGenerator.ts
import { PlannedAction, ScheduledPlan, ScheduledTask, TimePatternMemory, GoalMemory } from "./goalTypes";

export function generateDailySchedule(date: string, actions: PlannedAction[], timePatterns: TimePatternMemory[] = [], memory?: GoalMemory | null): ScheduledPlan {
  const plan: ScheduledPlan = {
    date,
    slots: [],
  };

  // Check if we have any user traits to consider
  const userTraits = memory?.userTraits || {};

  // Define default time blocks (morning, afternoon, evening)
  const defaultBlocks = [
    { start: "08:00", end: "12:00", label: "morning" },
    { start: "13:00", end: "17:00", label: "afternoon" },
    { start: "18:00", end: "22:00", label: "evening" },
  ];

  // Adjust time blocks based on user traits
  const timeBlocks = [...defaultBlocks];

  // Skip weekend mornings if user tends to skip weekends
  const dateObj = new Date(date);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
  if (isWeekend && userTraits.skipsWeekend) {
    timeBlocks[0].start = "10:00"; // Later start on weekends
  }

  // Assign morning slots for revision if user prefers that
  const revisionActions = actions.filter((a) => a.type === "revise");
  const learningActions = actions.filter((a) => a.type === "learn");

  // Sort actions based on user traits
  if (userTraits.givesUpOnHardTasks) {
    // Put easier tasks later in the day
    learningActions.sort((a, b) => {
      const diffMap = { easy: 2, medium: 1, hard: 0, undefined: 1 };
      return (diffMap[b.difficultyLevel || "medium"] || 1) - (diffMap[a.difficultyLevel || "medium"] || 1);
    });
  } else {
    // Put harder tasks earlier when user is fresh
    learningActions.sort((a, b) => {
      const diffMap = { easy: 0, medium: 1, hard: 2, undefined: 1 };
      return (diffMap[b.difficultyLevel || "medium"] || 1) - (diffMap[a.difficultyLevel || "medium"] || 1);
    });
  }

  // Use time patterns to find optimal slots for each action type
  const bestTimes: Record<string, string[]> = {};

  timePatterns.forEach((pattern) => {
    const key = `${pattern.domain}-${pattern.actionType}`;

    // Find windows with highest success rate
    const goodWindows = pattern.timeWindows.filter((w) => w.successRate >= 0.6 && w.usageCount >= 2).sort((a, b) => b.successRate - a.successRate);

    if (goodWindows.length) {
      bestTimes[key] = goodWindows.map((w) => w.start);
    }
  });

  // Schedule actions based on optimal times and user traits
  let currentTime = parseTime(timeBlocks[0].start); // Start at beginning of first block

  // First schedule revisions if user prefers mornings for revision
  if (userTraits.prefersRevisionInMorning) {
    for (const action of revisionActions) {
      const duration = estimateTaskDuration(action, timePatterns);

      plan.slots.push({
        actionId: action.id,
        startTime: formatTime(currentTime),
        endTime: formatTime(addMinutes(currentTime, duration)),
        expectedDuration: duration,
        generatedBy: "algo",
      });

      currentTime = addMinutes(currentTime, duration + 5); // 5 min break
    }
  }

  // Then schedule learning actions
  for (const action of learningActions) {
    const duration = estimateTaskDuration(action, timePatterns);
    const key = `${action.domain}-${action.type}`;

    // Try to schedule at a preferred time if available
    if (bestTimes[key] && bestTimes[key].length) {
      const preferredStartTime = parseTime(bestTimes[key][0]);

      // If preferred time is still in the future, use it
      if (preferredStartTime > currentTime) {
        currentTime = preferredStartTime;
      }
    }

    // If we've moved past the last time block, reset to start of next day
    const lastBlockEnd = parseTime(timeBlocks[timeBlocks.length - 1].end);
    if (currentTime > lastBlockEnd) {
      // We're out of hours for today
      // (In a real app, you'd probably want to handle this differently)
      currentTime = parseTime(timeBlocks[0].start);
    }

    plan.slots.push({
      actionId: action.id,
      startTime: formatTime(currentTime),
      endTime: formatTime(addMinutes(currentTime, duration)),
      expectedDuration: duration,
      generatedBy: "algo",
    });

    currentTime = addMinutes(currentTime, duration + 5); // 5 min break
  }

  // Schedule any remaining revisions if not done earlier
  if (!userTraits.prefersRevisionInMorning) {
    for (const action of revisionActions) {
      const duration = estimateTaskDuration(action, timePatterns);

      plan.slots.push({
        actionId: action.id,
        startTime: formatTime(currentTime),
        endTime: formatTime(addMinutes(currentTime, duration)),
        expectedDuration: duration,
        generatedBy: "algo",
      });

      currentTime = addMinutes(currentTime, duration + 5); // 5 min break
    }
  }

  return plan;
}

// Helper functions
function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

function estimateTaskDuration(action: PlannedAction, timePatterns: TimePatternMemory[]): number {
  // Try to find duration from patterns
  const relevantPatterns = timePatterns.filter((p) => p.domain === action.domain && p.actionType === action.type);

  if (relevantPatterns.length > 0) {
    // Calculate average duration from all time windows
    const allDurations = relevantPatterns.flatMap((p) => p.timeWindows.map((w) => w.averageDuration));

    if (allDurations.length > 0) {
      return Math.ceil(allDurations.reduce((sum, d) => sum + d, 0) / allDurations.length);
    }
  }

  // Fallback: Use difficulty to estimate duration
  const baseDuration = action.type === "revise" ? 20 : 30;

  // Adjust by difficulty
  if (!action.difficultyLevel) return baseDuration;

  switch (action.difficultyLevel) {
    case "easy":
      return Math.round(baseDuration * 0.7);
    case "medium":
      return baseDuration;
    case "hard":
      return Math.round(baseDuration * 1.5);
    default:
      return baseDuration;
  }
}
