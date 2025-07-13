// types.ts

// --- Generic Content Element Types (Reusable for Problems, Core Subtopics, Interview Answers, System Design Subtopics) ---
/**
 * Defines a single rich content element that can be part of any content array.
 */
import { GoalSlice } from "@/src/goalEngine/goalSlice";
export type ContentElement = { type: "paragraph"; value: string } | { type: "code"; value: string; language?: string } | { type: "image"; value: string[]; alt?: string };

// --- DSA Domain Types ---
export type SimilarProblem = {
  id: string;
  title: string;
  description: string;
  shortExplanation: string | string[];
  difficultyLevel: "easy" | "medium" | "hard";
  code?: string;
};

export type DsaTopic = {
  id: string;
  title: string;
  subtitle: string;
};

export type Problem = {
  id: string;
  topicId: string; // Foreign key linking to DsaTopic
  title: string;
  explanation: string;
  problemLink?: string;
  difficultyLevel: "easy" | "medium" | "hard";
  testCase: string;
  solution: string;
  code: string;
  similarProblems?: SimilarProblem[];
  images?: string[];
};

// --- Core Topics Domain Types ---
export type CoreCategory = {
  id: string;
  name: string;
};

export type CoreTopic = {
  id: string;
  categoryId: string; // Foreign key linking to CoreCategory
  name: string;
};

export type CoreSubtopic = {
  id: string;
  topicId: string; // Foreign key linking to CoreTopic
  title: string;
  content: ContentElement[];
};
export interface CoreState {
  categories: CoreCategory[];
  topics: CoreTopic[];
  subtopics: CoreSubtopic[];
}
// --- Interview Domain Types (New) ---
export type InterviewQuestion = {
  id: string;
  question: string;
  answer: ContentElement[]; // Answer can be rich content (paragraphs, code, etc.)
};
export type InterviewState = {
  questions: InterviewQuestion[];
};
// --- System Design Domain Types (New - Identical structure to Core Topics) ---
export type SystemDesignCategory = {
  id: string;
  name: string;
};
export type SystemDesignTopic = {
  id: string;
  categoryId: string; // Foreign key linking to SystemDesignCategory
  name: string;
};
export type SystemDesignSubtopic = {
  id: string;
  topicId: string; // Foreign key linking to SystemDesignTopic
  title: string;
  content: ContentElement[];
};

export interface SystemDesignState {
  categories: SystemDesignCategory[];
  topics: SystemDesignTopic[];
  subtopics: SystemDesignSubtopic[];
}
// --- Zustand Store State and Actions Types ---
/**
 * Defines the overall structure of the data managed by the Zustand store.
 */
export type AppState = {
  dsa: {
    topics: DsaTopic[];
    problems: Problem[];
  };
  core: {
    categories: CoreCategory[];
    topics: CoreTopic[];
    subtopics: CoreSubtopic[];
  };
  interview: {
    // New Interview data state
    questions: InterviewQuestion[];
  };
  systemDesign: {
    // New System Design data state
    categories: SystemDesignCategory[];
    topics: SystemDesignTopic[];
    subtopics: SystemDesignSubtopic[];
  };
};

/**
 * Defines the actions (functions) available in the Zustand store to manipulate the data.
 */
export type AppActions = {
  // DSA Topic Actions
  addDsaTopic: (topic: DsaTopic) => void;
  deleteDsaTopic: (id: string) => void;
  updateDsaTopic: (updated: DsaTopic) => void;
  getDsaProblemsByTopicId: (topicId: string) => Problem[];
  getDsaTopicById: (id: string) => DsaTopic | undefined;

  // DSA Problem Actions
  addProblem: (problem: Problem) => void;
  deleteProblem: (id: string) => void;
  updateProblem: (updated: Problem) => void;
  getProblemById: (problemId: string) => Problem | undefined;
  getSimilarProblemById: (id: string) => { problemId: string; similarProblem: SimilarProblem } | undefined;
  moveSimilarProblem: (similarProblemId: string, targetProblemId: string) => void;

  // Core Category Actions
  addCoreCategory: (category: CoreCategory, insertIndex: number | null) => void;
  deleteCoreCategory: (id: string) => void;
  updateCoreCategory: (updated: CoreCategory) => void;
  getCoreCategoryById: (id: string) => CoreCategory | undefined;

  // Core Topic Actions
  addCoreTopic: (topic: CoreTopic) => void;
  deleteCoreTopic: (id: string) => void;
  updateCoreTopic: (updated: CoreTopic) => void;
  getCoreTopicsByCategoryId: (categoryId: string) => CoreTopic[];
  getCoreTopicById: (id: string) => CoreTopic | undefined;

  // Core Subtopic Actions
  addCoreSubtopic: (subtopic: CoreSubtopic) => void;
  deleteCoreSubtopic: (id: string) => void;
  updateCoreSubtopic: (updated: CoreSubtopic) => void;
  getCoreSubtopicsByTopicId: (topicId: string) => CoreSubtopic[];
  getCoreSubtopicById: (id: string) => CoreSubtopic | undefined;

  // Block-level editing
  updateBlockInSubtopic: (subtopicId: string, index: number, block: ContentElement) => void;
  deleteBlockInSubtopic: (subtopicId: string, index: number) => void;
  insertBlockInSubtopic: (subtopicId: string, index: number, block: ContentElement) => void;

  // Interview Actions (New)
  addInterviewQuestion: (question: InterviewQuestion, index: number) => void;
  deleteInterviewQuestion: (id: string) => void;
  updateInterviewQuestion: (updated: InterviewQuestion) => void;
  getInterviewQuestionById: (id: string) => InterviewQuestion | undefined;

  // Interview Answer Block Actions (New)
  updateInterviewAnswerBlock: (questionId: string, index: number, block: ContentElement) => void;
  insertInterviewAnswerBlock: (questionId: string, index: number, block: ContentElement) => void;
  deleteInterviewAnswerBlock: (questionId: string, index: number) => void;

  // System Design Category Actions (New)
  addSystemDesignCategory: (category: SystemDesignCategory, insertIndex: number | null) => void;
  deleteSystemDesignCategory: (id: string) => void;
  updateSystemDesignCategory: (updated: SystemDesignCategory) => void;
  getSystemDesignCategoryById: (id: string) => SystemDesignCategory | undefined;

  // System Design Topic Actions (New)
  addSystemDesignTopic: (topic: SystemDesignTopic) => void;
  deleteSystemDesignTopic: (id: string) => void;
  updateSystemDesignTopic: (updated: SystemDesignTopic) => void;
  getSystemDesignTopicsByCategoryId: (categoryId: string) => SystemDesignTopic[];
  getSystemDesignTopicById: (id: string) => SystemDesignTopic | undefined;

  // System Design Subtopic Actions
  addSystemDesignSubtopic: (subtopic: SystemDesignSubtopic) => void;
  deleteSystemDesignSubtopic: (id: string) => void;
  updateSystemDesignSubtopic: (updated: SystemDesignSubtopic) => void;
  getSystemDesignSubtopicsByTopicId: (topicId: string) => SystemDesignSubtopic[];
  getSystemDesignSubtopicById: (id: string) => SystemDesignSubtopic | undefined;

  // Block-level editing
  updateBlockInSystemDesignSubtopic: (subtopicId: string, index: number, block: ContentElement) => void;
  deleteBlockInSystemDesignSubtopic: (subtopicId: string, index: number) => void;
  insertBlockInSystemDesignSubtopic: (subtopicId: string, index: number, block: ContentElement) => void;

  // Global actions
  clearAllData: () => void;
  importData: (data: AppState) => void;
};

export type AppStore = AppState & AppActions & GoalSlice;
