// ✅ File: /src/goalEngine/restructureEngine.ts
import { DailyGoal, GoalEngineMetrics, GoalHistoryLog, PlannedAction } from "./goalTypes";

export function restructureFutureGoals(goals: DailyGoal[], todayIndex: number, metrics: GoalEngineMetrics, history: GoalHistoryLog[]): DailyGoal[] {
  // Clone goals to avoid mutation
  const updatedGoals = [...goals];

  // Exit if no future goals or today is not found
  if (todayIndex < 0 || todayIndex >= goals.length - 1) {
    return updatedGoals;
  }

  // Get today's goal metrics
  const todayGoal = goals[todayIndex];
  const todayCompleted = todayGoal.completedActionIds.length;
  const todayTotal = todayGoal.totalPlannedActions;
  const todayPerformance = todayTotal > 0 ? todayCompleted / todayTotal : 0;

  // Determine performance type
  const isOverperforming = todayPerformance >= 1 && todayTotal >= 3; // Completed everything
  const isUnderperforming = todayPerformance < 0.5; // Less than half completed
  const isAveragePerforming = !isOverperforming && !isUnderperforming;

  // Calculate difficulty adjustment factors
  let difficultyAdjustment = 0;
  let loadAdjustment = 0;

  if (isOverperforming) {
    // User is doing well - can increase difficulty or load
    difficultyAdjustment = 1;
    loadAdjustment = Math.min(2, Math.floor(todayTotal * 0.2)); // Increase by up to 20%
  } else if (isUnderperforming) {
    // User is struggling - decrease difficulty and load
    difficultyAdjustment = -1;
    loadAdjustment = -Math.min(2, Math.ceil(todayTotal * 0.2)); // Decrease by up to 20%
  }

  // Get incomplete tasks from today to roll over
  const incompleteActions = [...todayGoal.plannedLearning, ...todayGoal.plannedRevision].filter((action) => !todayGoal.completedActionIds.includes(action.id));

  // Process future goals
  for (let i = todayIndex + 1; i < updatedGoals.length; i++) {
    const futureGoal = { ...updatedGoals[i] };

    // For the next day, add incomplete actions from today
    if (i === todayIndex + 1 && incompleteActions.length > 0) {
      // Add carried items to the beginning
      futureGoal.plannedLearning = [...incompleteActions.filter((a) => a.type === "learn"), ...futureGoal.plannedLearning];

      futureGoal.plannedRevision = [...incompleteActions.filter((a) => a.type === "revise"), ...futureGoal.plannedRevision];

      // Mark these as carried over
      futureGoal.carriedFromYesterday = incompleteActions;
    }

    // Apply difficulty adjustments for all future days
    if (difficultyAdjustment !== 0) {
      futureGoal.plannedLearning = adjustDifficulty(futureGoal.plannedLearning, difficultyAdjustment);
    }

    // Apply load adjustments for days after tomorrow
    if (i > todayIndex + 1 && loadAdjustment !== 0) {
      futureGoal.plannedLearning = adjustLoad(futureGoal.plannedLearning, loadAdjustment);
    }

    // Recalculate totals
    futureGoal.totalPlannedActions = futureGoal.plannedLearning.length + futureGoal.plannedRevision.length;

    // Update in our goals array
    updatedGoals[i] = futureGoal;
  }

  return updatedGoals;
}

// Helper to adjust difficulty of planned actions
function adjustDifficulty(actions: PlannedAction[], adjustment: number): PlannedAction[] {
  if (adjustment === 0) return actions;

  // Sort actions by difficulty
  const difficultyMap = { easy: 1, medium: 2, hard: 3, undefined: 2 };

  // Clone and sort by difficulty
  return [...actions].sort((a, b) => {
    const aDiff = difficultyMap[a.difficultyLevel || "medium"] || 2;
    const bDiff = difficultyMap[b.difficultyLevel || "medium"] || 2;

    // If increasing difficulty, put harder items first
    // If decreasing difficulty, put easier items first
    return adjustment > 0 ? bDiff - aDiff : aDiff - bDiff;
  });
}

// Helper to adjust load by adding or removing items
function adjustLoad(actions: PlannedAction[], adjustment: number): PlannedAction[] {
  if (adjustment === 0) return actions;

  if (adjustment > 0) {
    // No actions to add here - we'd need to pull from available pool
    // This would be done in the main goal generation
    return actions;
  } else {
    // Reduce load by removing items from the end
    const newCount = Math.max(1, actions.length + adjustment);
    return actions.slice(0, newCount);
  }
}
