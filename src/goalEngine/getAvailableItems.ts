// /src/goalEngine/getAvailableItems.ts
import { PlannedAction } from "./goalTypes";
import { AppState } from "@/types/types";

export function getAvailableItems(appState: AppState, excludeIds: string[], type: "learn" | "revise", limit: number): PlannedAction[] {
  const actions: PlannedAction[] = [];
  // Use a Set for efficient lookups
  const seen = new Set(excludeIds);

  // DSA domain
  appState.dsa.problems.forEach((p) => {
    if (!seen.has(p.id)) {
      actions.push({
        id: p.id,
        domain: "dsa",
        originalType: "problem",
        type,
        topicId: p.topicId,
        topicTitle: appState.dsa.topics.find((t) => t.id === p.topicId)?.title,
        title: p.title,
        difficultyLevel: p.difficultyLevel,
        isCompleted: false,
      });
      seen.add(p.id); // Mark as seen immediately to prevent duplicates within this function
    }
  });

  // Core domain
  appState.core.subtopics.forEach((s) => {
    if (!seen.has(s.id)) {
      const topic = appState.core.topics.find((t) => t.id === s.topicId);
      const category = topic ? appState.core.categories.find((c) => c.id === topic.categoryId) : undefined;

      actions.push({
        id: s.id,
        domain: "core",
        originalType: "subtopic",
        type,
        topicId: s.topicId,
        topicTitle: topic?.name,
        categoryId: category?.id,
        title: s.title,
        isCompleted: false,
      });
      seen.add(s.id);
    }
  });

  // Interview domain
  appState.interview.questions.forEach((q) => {
    if (!seen.has(q.id)) {
      actions.push({
        id: q.id,
        domain: "interview",
        originalType: "question",
        type,
        title: q.question.substring(0, 50) + (q.question.length > 50 ? "..." : ""),
        isCompleted: false,
      });
      seen.add(q.id);
    }
  });

  // System Design domain
  appState.systemDesign.subtopics.forEach((s) => {
    if (!seen.has(s.id)) {
      const topic = appState.systemDesign.topics.find((t) => t.id === s.topicId);
      const category = topic ? appState.systemDesign.categories.find((c) => c.id === topic.categoryId) : undefined;

      actions.push({
        id: s.id,
        domain: "systemDesign",
        originalType: "subtopic",
        type,
        topicId: s.topicId,
        topicTitle: topic?.name,
        categoryId: category?.id,
        title: s.title,
        isCompleted: false,
      });
      seen.add(s.id);
    }
  });

  // Randomize to avoid always selecting items in the same order
  const shuffled = actions.sort(() => 0.5 - Math.random());

  // Final safety check to ensure no duplicates
  const result: PlannedAction[] = [];
  const finalIds = new Set<string>();

  for (const item of shuffled) {
    if (!finalIds.has(item.id) && result.length < limit) {
      result.push(item);
      finalIds.add(item.id);
    }
  }

  return result;
}
