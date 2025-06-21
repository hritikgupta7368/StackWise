// types.ts

// --- Generic Content Element Types (Reusable for Problems, Core Subtopics, Interview Answers, System Design Subtopics) ---
/**
 * Defines a single rich content element that can be part of any content array.
 */
export type ContentElement =
  | { type: "paragraph"; value: string }
  | { type: "code"; value: string; language?: string }
  | { type: "image"; value: string; alt?: string };

// --- DSA Domain Types ---
export type SimilarProblem = {
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
};

// --- Core Topics Domain Types ---
export type CoreCategory = {
  id: string;
  name: string;
  description?: string;
};

export type CoreTopic = {
  id: string;
  categoryId: string; // Foreign key linking to CoreCategory
  name: string;
  description?: string;
};

export type CoreSubtopic = {
  id: string;
  topicId: string; // Foreign key linking to CoreTopic
  title: string;
  content: ContentElement[];
};

// --- Interview Domain Types (New) ---
export type InterviewQuestion = {
  id: string;
  question: string;
  answer: ContentElement[]; // Answer can be rich content (paragraphs, code, etc.)
};

// --- System Design Domain Types (New - Identical structure to Core Topics) ---
export type SystemDesignCategory = {
  id: string;
  name: string;
  description?: string;
};

export type SystemDesignTopic = {
  id: string;
  categoryId: string; // Foreign key linking to SystemDesignCategory
  name: string;
  description?: string;
};

export type SystemDesignSubtopic = {
  id: string;
  topicId: string; // Foreign key linking to SystemDesignTopic
  title: string;
  content: ContentElement[];
};

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

  // Core Category Actions
  addCoreCategory: (category: CoreCategory) => void;
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

  // Interview Actions (New)
  addInterviewQuestion: (question: InterviewQuestion) => void;
  deleteInterviewQuestion: (id: string) => void;
  updateInterviewQuestion: (updated: InterviewQuestion) => void;
  getInterviewQuestionById: (id: string) => InterviewQuestion | undefined;

  // System Design Category Actions (New)
  addSystemDesignCategory: (category: SystemDesignCategory) => void;
  deleteSystemDesignCategory: (id: string) => void;
  updateSystemDesignCategory: (updated: SystemDesignCategory) => void;
  getSystemDesignCategoryById: (id: string) => SystemDesignCategory | undefined;

  // System Design Topic Actions (New)
  addSystemDesignTopic: (topic: SystemDesignTopic) => void;
  deleteSystemDesignTopic: (id: string) => void;
  updateSystemDesignTopic: (updated: SystemDesignTopic) => void;
  getSystemDesignTopicsByCategoryId: (
    categoryId: string,
  ) => SystemDesignTopic[];
  getSystemDesignTopicById: (id: string) => SystemDesignTopic | undefined;

  // System Design Subtopic Actions (New)
  addSystemDesignSubtopic: (subtopic: SystemDesignSubtopic) => void;
  deleteSystemDesignSubtopic: (id: string) => void;
  updateSystemDesignSubtopic: (updated: SystemDesignSubtopic) => void;
  getSystemDesignSubtopicsByTopicId: (
    topicId: string,
  ) => SystemDesignSubtopic[];
  getSystemDesignSubtopicById: (id: string) => SystemDesignSubtopic | undefined;

  // Global actions
  clearAllData: () => void;
  importData: (data: AppState) => void;
};

/**
 * Combines the state and actions to define the full shape of the Zustand store.
 */
export type AppStore = AppState & AppActions;
