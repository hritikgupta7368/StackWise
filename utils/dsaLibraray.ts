import { StriverSheet } from "@/constants/DsaProblemSet1";

export type ProblemStats = {
  totalProblems: number;
  categoryWise: {
    [category: string]: {
      total: number;
      Easy: number;
      Medium: number;
      Hard: number;
    };
  };
};

export function dsaLibrary(): ProblemStats {
  const stats: ProblemStats = {
    totalProblems: 0,
    categoryWise: {},
  };
  const sheet = StriverSheet;

  for (const category in sheet) {
    const problems = sheet[category];
    const categoryStats = { total: 0, Easy: 0, Medium: 0, Hard: 0 };

    for (const problem of problems) {
      categoryStats.total += 1;
      categoryStats[problem.difficulty] += 1;
      stats.totalProblems += 1;
    }

    stats.categoryWise[category] = categoryStats;
  }

  return stats;
}
