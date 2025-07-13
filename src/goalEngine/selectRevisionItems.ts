// ✅ File: /src/goalEngine/selectRevisionItems.ts (FIXED)

import { PlannedAction, GoalHistoryLog } from "./goalTypes";

/**
 * Selects items for revision based on spaced repetition, excluding any IDs that are already planned for the day.
 * @param history - The user's goal history.
 * @param limit - The maximum number of revision items to return.
 * @param excludeIds - An array of item IDs to exclude from the selection pool.
 * @returns An array of PlannedAction items for revision.
 */
export function selectItemsForRevision(history: GoalHistoryLog[], limit: number = 0.3, excludeIds: string[] = []): PlannedAction[] {
  if (!history || history.length === 0 || limit <= 0) {
    return [];
  }

  // Get completed actions with timestamps
  const completedActions = history.flatMap((log) =>
    log.actions
      .filter((act) => act.isCompleted && act.completedAt)
      .map((act) => ({
        action: act,
        completedAt: act.completedAt!,
        date: log.date,
      })),
  );

  // Group by ID to get the latest completion for each item
  const latestByItem = new Map<string, { action: PlannedAction; completedAt: string; date: string }>();
  for (const item of completedActions) {
    if (!latestByItem.has(item.action.id) || new Date(item.completedAt) > new Date(latestByItem.get(item.action.id)!.completedAt)) {
      latestByItem.set(item.action.id, item);
    }
  }

  // --- ⬇️ CHANGE 1: Filter out excluded IDs BEFORE calculating anything else ---
  const eligibleCandidates = Array.from(latestByItem.values()).filter((item) => !excludeIds.includes(item.action.id));
  // --- ⬆️ END OF CHANGE 1 ---

  // Calculate spaced repetition intervals for the eligible candidates
  const now = new Date();
  const candidatesWithPriority = eligibleCandidates.map((item) => {
    const daysSinceCompletion = Math.floor((now.getTime() - new Date(item.completedAt).getTime()) / (1000 * 60 * 60 * 24));

    // Spaced repetition intervals (1, 3, 7, 14, 30 days)
    const intervals = [1, 3, 7, 14, 30];
    const dueForReview = intervals.some((interval) => daysSinceCompletion >= interval && daysSinceCompletion <= interval + 1);

    return {
      ...item,
      daysSinceCompletion,
      dueForReview,
      reviewPriority: dueForReview ? 30 - daysSinceCompletion : daysSinceCompletion, // Prioritize due items, then oldest items
    };
  });

  // Sort candidates: due items first, then by priority
  const sortedCandidates = candidatesWithPriority.sort((a, b) => {
    if (a.dueForReview && !b.dueForReview) return -1;
    if (!a.dueForReview && b.dueForReview) return 1;
    return b.reviewPriority - a.reviewPriority;
  });

  // --- ⬇️ CHANGE 2: Use the 'limit' parameter directly ---
  const selectedItems = sortedCandidates.slice(0, limit);
  // --- ⬆️ END OF CHANGE 2 ---

  // Convert back to PlannedActions, ensuring the type is 'revise'
  return selectedItems.map((item) => ({
    id: item.action.id,
    domain: item.action.domain,
    originalType: item.action.originalType,
    type: "revise",
    topicId: item.action.topicId,
    topicTitle: item.action.topicTitle,
    title: item.action.title,
    difficultyLevel: item.action.difficultyLevel,
    isCompleted: false, // Always reset for the new goal
  }));
}
