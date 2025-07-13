//for tracking
export type DailyGoal = {
  date: string; //Today date
  plannedLearning: PlannedAction[]; //New Topic/Question List for Learning Today
  plannedRevision: PlannedAction[]; //New Topic/Question List for Revision Today
  completedActionIds: string[]; // IDs of completed actions
  totalPlannedActions: number; // plannedLearning.length + plannedRevision.length
  totalCompleted: number; // derived from completedActionIds
  goalMet: boolean; // if totalCompleted === totalPlannedActions
  percentCompleted: number; // (totalCompleted / totalPlannedActions) * 100
  status: "active" | "missed" | "partially_completed" | "skipped" | "pending" | "light";
  //metadata
  notes?: string; // user reflection or comments
  carriedFromYesterday?: PlannedAction[]; // optional: unfinished yesterday actions
  createdAt: string; // ISO timestamp when today's goal was created
  updatedAt?: string; // when last item was marked completed
};

export type PlannedAction = {
  id: string; // unique ID of problem/subtopic/question
  domain: "dsa" | "core" | "interview" | "systemDesign"; // domain of the action
  originalType: "problem" | "subtopic" | "question"; // useful for tracing content type
  type: "learn" | "revise"; // revise or new Topic
  topicId?: string; // dsa -> DsaTopic.id , core or systemDesign -> CoreTopic.id , interview -> InterviewQuestion.id
  topicTitle?: string; // dsa -> DsaTopic.title , core or systemDesign -> CoreTopic.title , interview -> InterviewQuestion.question
  categoryId?: string; // only for core/systemDesign (optional)
  title: string; // dsa -> Problem.title , core -> subtopicTitle Interview -> questionTitle
  difficultyLevel?: "easy" | "medium" | "hard"; // DSA only
  isCompleted: boolean; // DSA only
  scheduledStart?: string | number;
};

//This is calculated by the app (or later ML model) to predict how long it’ll take to finish all your content, based on your speed and behavior.
export type GoalForecast = {
  generatedAt: string;
  dsaETA: number;
  coreETA: number;
  interviewETA: number;
  systemDesignETA: number;
  basedOn: {
    avgDailyLoad: number;
    streak: number;
    missedDays: number;
    totalAvailableItems: {
      dsa: number;
      core: number;
      interview: number;
      systemDesign: number;
    };
  };
};
//This stores stats that help the app understand how you’re performing overall: provides stats
export type GoalEngineMetrics = {
  totalGoalsGenerated: number;
  avgCompletionRate: number;
  consistencyStreak: number;
  maxStreak: number;
  currentMode: "normal" | "light" | "boost" | "lowLoad" | "recovery";
  avgTimePerTask?: number;
  skippedRate?: number;
  earlyCompletionRate?: number;
  preferredTimesOfDay?: ("morning" | "evening" | "night")[];
  updatedAt: string;
};

// Very Basic Settings User Can Tweak
export type UserGoalConfig = {
  mode: "normal" | "boost" | "light";
  allowAutoAdjustment: boolean;
  forecastEnabled: boolean;
  revisionIntensity?: number; // 0.3 means 30% revision in mix
  preferredDailyLoad?: number; // e.g. 4 tasks/day
  streakProtection?: boolean;
  createdAt: string;
  updatedAt?: string;
};
//Over time, the app will build a private memory of your learning behavior:
export type GoalMemory = {
  id: string; // random UUID
  userTraits: {
    prefersRevisionInMorning?: boolean;
    givesUpOnHardTasks?: boolean;
    skipsWeekend?: boolean;
    finishesStrongEndOfWeek?: boolean;
  };
  learningPatterns: string[]; // e.g. ["short_burst_evenings", "fails_on_long_days"]
  lastUpdated: string;
  lastDayUncompleted?: PlannedAction[]; // carry these into next day
  lastRun?: string; // ISO timestamp
};

//This creates a summary from piles of daily data, like:
export type GoalDigest = {
  timeframe: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  totalTasks: number;
  completed: number;
  skipped: number;
  bonus: number;
  missedGoals: number;
  topDomain: "dsa" | "core" | "interview" | "systemDesign";
  weakDomain?: string;
  mostStudiedTopic?: string;
  moodSummary?: {
    great: number;
    okay: number;
    tired: number;
    bad: number;
  };
};

export type GoalHistoryLog = {
  date: string;
  actions: HistoryLogAction[];

  hourlyStats?: HourlyAnalytics[];

  metadata: {
    generatedGoalId?: string;
    mood?: "great" | "okay" | "tired" | "low";
    carriedCount?: number;
    notes?: string;
  };

  createdAt: string;
};

export type ScheduledPlan = {
  date: string; // Same as DailyGoal.date
  slots: ScheduledTask[];
};

export type ScheduledTask = {
  actionId: string; // ID of the PlannedAction
  startTime: string; // "10:30" — recommended
  endTime: string; // "11:10" — based on past performance
  expectedDuration: number; // in minutes
  generatedBy: "algo" | "user"; // who set the schedule
  wasAttempted?: boolean;
};

export type TimePatternMemory = {
  actionType: "learn" | "revise";
  domain: "dsa" | "core" | "interview" | "systemDesign";
  timeWindows: {
    start: string; // "10:30"
    end: string; // "11:15"
    averageDuration: number;
    successRate: number; // % of times you completed in this window
    usageCount: number;
  }[];
  lastUpdated: string;
};

export type HourlyAnalytics = {
  timestamp: string; // "2025-07-08T13:00:00"
  plannedActionsSnapshot: {
    total: number;
    completed: number;
    missedSoFar: number;
    remaining: number;
  };
  deviations: {
    early: number;
    late: number;
    unscheduledStarted: number;
    rescheduledByUser: number;
  };
};

export type RescheduleLog = {
  date: string;
  changes: {
    actionId: string;
    oldStartTime: string;
    newStartTime: string;
    reason?: string; // optional
    rescheduledBy: "user" | "algo";
    timestamp: string;
  }[];
};

export type HistoryLogAction = {
  id: string;
  domain: "dsa" | "core" | "interview" | "systemDesign";
  originalType: "problem" | "subtopic" | "question";
  type: "learn" | "revise";
  isCompleted: boolean;

  // Add the missing optional properties from PlannedAction
  title: string;
  topicId?: string;
  topicTitle?: string;
  difficultyLevel?: "easy" | "medium" | "hard";

  // Keep the history-specific properties
  timeSpentInMinutes?: number;
  startedAt?: string;
  completedAt?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  wasRescheduled?: boolean;
};
