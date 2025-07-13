import { useAppStore } from "@/store/useStore";
import { useMemo } from "react";

export function useProblemStats() {
  const problems = useAppStore((state) => state.dsa.problems);
  const topics = useAppStore((state) => state.dsa.topics);

  const colorPalette = useMemo(() => ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FCD34D", "#6EE7B7", "#93C5FD", "#D8B4FE"], []);

  const difficultyStats = useMemo(() => {
    let easy = 0,
      medium = 0,
      hard = 0;

    problems.forEach((p) => {
      if (p.difficultyLevel === "easy") easy++;
      else if (p.difficultyLevel === "medium") medium++;
      else if (p.difficultyLevel === "hard") hard++;

      if (Array.isArray(p.similarProblems)) {
        p.similarProblems.forEach((sp) => {
          if (sp.difficultyLevel === "easy") easy++;
          else if (sp.difficultyLevel === "medium") medium++;
          else if (sp.difficultyLevel === "hard") hard++;
        });
      }
    });

    return { easy, medium, hard, total: easy + medium + hard };
  }, [problems]);

  const topicStats = useMemo(() => {
    return topics
      .map((topic, index) => {
        const count = problems.filter((p) => p.topicId === topic.id).length;

        return {
          name: topic.title,
          count,
          color: colorPalette[index % colorPalette.length],
          legendFontColor: "#e5e5e5",
          legendFontSize: 12,
        };
      })
      .filter((t) => t.count > 0);
  }, [topics, problems, colorPalette]);

  return {
    ...difficultyStats, // easy, medium, hard, total
    topicStats, // chart data
  };
}
