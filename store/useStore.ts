/**
 * Zustand-based global state management for the learning app.
 *
 * This store manages multiple domains of learning content using Zustand and AsyncStorage for persistence:
 *
 * 🔸 Domains:
 *   - DSA: Topics and associated problems
 *   - Core: Categories, topics, and subtopics
 *   - Interview: Standalone interview questions
 *   - System Design: Categories, topics, and subtopics
 *
 * 🔸 Features:
 *   - CRUD operations for all entities in each domain
 *   - Cascading deletions (e.g., deleting a category removes nested topics/subtopics)
 *   - Utility getters (by ID, by parentId, etc.)
 *   - Data persistence with AsyncStorage via Zustand middleware
 *   - Supports toggling mock data via `USE_MOCK_DATA`
 *   - Global utilities: clear all data, import/export entire state
 *   - Enhanced with Immer for better performance and cleaner code
 *
 * 🔸 Tech:
 *   - Zustand (with `persist` and `immer` middleware)
 *   - AsyncStorage for local data persistence
 *   - Immer for immutable state updates
 *
 * Usage:
 *   - Import `useAppStore()` in any component to access or modify state
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  AppState,
  AppActions,
  AppStore,
  DsaTopic,
  Problem,
  CoreCategory,
  CoreTopic,
  CoreSubtopic,
  InterviewQuestion, // New
  SystemDesignCategory, // New
  SystemDesignTopic, // New
  SystemDesignSubtopic, // New
  SimilarProblem,
  ContentElement,
} from "../types/types"; // Adjust this path
import { createGoalSlice } from "@/src/goalEngine/goalSlice";
// --- Mock Data Imports ---
import { dummyDsaTopics } from "../data/mock/dummyDsaTopics";
import { dummyDsaProblems } from "../data/mock/dummyDsaProblems";
import { dummyCoreCategories } from "../data/mock/dummyCoreCategories";
import { dummyCoreTopics } from "../data/mock/dummyCoreTopics";
import { dummyCoreSubtopics } from "../data/mock/dummyCoreSubtopics";
import { dummyInterviewQuestions } from "../data/mock/dummyInterviewQuestions"; // New
import { dummySystemDesignCategories } from "../data/mock/dummySystemDesignCategories"; // New
import { dummySystemDesignTopics } from "../data/mock/dummySystemDesignTopics"; // New
import { dummySystemDesignSubtopics } from "../data/mock/dummySystemDesignSubtopics"; // New

// --- Configuration ---
const USE_MOCK_DATA = true; // Set to false to disable mock data for persistence

// --- Initial State Definition ---
const initialState: AppState = {
  dsa: {
    topics: USE_MOCK_DATA ? dummyDsaTopics : [],
    problems: USE_MOCK_DATA ? dummyDsaProblems : [],
  },
  core: {
    categories: USE_MOCK_DATA ? dummyCoreCategories : [],
    topics: USE_MOCK_DATA ? dummyCoreTopics : [],
    subtopics: USE_MOCK_DATA ? dummyCoreSubtopics : [],
  },
  interview: {
    // Initialize new interview domain
    questions: USE_MOCK_DATA ? dummyInterviewQuestions : [],
  },
  systemDesign: {
    // Initialize new system design domain
    categories: USE_MOCK_DATA ? dummySystemDesignCategories : [],
    topics: USE_MOCK_DATA ? dummySystemDesignTopics : [],
    subtopics: USE_MOCK_DATA ? dummySystemDesignSubtopics : [],
  },
};

// --- Zustand Store Creation with Immer ---
export const useAppStore = create<AppStore>()(
  persist(
    immer((set, get, store) => ({
      ...initialState, // Initialize store with the defined initial state
      ...createGoalSlice(set, get, store),

      // --- DSA Topic Actions ---
      addDsaTopic: (topic) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            topics: [...state.dsa.topics, topic],
          },
        }));
      },

      deleteDsaTopic: (title) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            topics: state.dsa.topics.filter((t) => t.title !== title),
            problems: state.dsa.problems.filter((p) => p.topicId !== title),
          },
        }));
      },

      updateDsaTopic: (updated) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            topics: state.dsa.topics.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
          },
        }));
      },

      getDsaTopicById: (id) => get().dsa.topics.find((topic) => topic.id === id),

      // --- DSA Problem Actions ---
      addProblem: (problem) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            problems: [...state.dsa.problems, problem],
          },
        }));
      },

      deleteProblem: (id) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            problems: state.dsa.problems.filter((p) => p.id !== id),
          },
        }));
      },

      updateProblem: (updated) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            problems: state.dsa.problems.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
          },
        }));
      },
      getSimilarProblemById: (id) => {
        const problems = get().dsa.problems;

        for (const problem of problems) {
          const match = problem.similarProblems?.find((sp) => sp.id === id);
          if (match) {
            return { problemId: problem.id, similarProblem: match };
          }
        }

        return undefined;
      },

      moveSimilarProblem: (similarProblemId, targetProblemId) => {
        set((state) => {
          let movedSimilar: SimilarProblem | undefined;

          const updatedProblems = state.dsa.problems.map((problem) => {
            const filteredSimilar = problem.similarProblems?.filter((sp) => {
              if (sp.id === similarProblemId) {
                movedSimilar = sp;
                return false;
              }
              return true;
            });

            return {
              ...problem,
              similarProblems: filteredSimilar,
            };
          });

          if (movedSimilar) {
            return {
              dsa: {
                ...state.dsa,
                problems: updatedProblems.map((problem) => {
                  if (problem.id === targetProblemId) {
                    return {
                      ...problem,
                      similarProblems: [...(problem.similarProblems || []), movedSimilar!],
                    };
                  }
                  return problem;
                }),
              },
            };
          }

          // If not found or nothing to move, return unchanged state
          return {
            dsa: {
              ...state.dsa,
              problems: updatedProblems,
            },
          };
        });
      },

      getDsaProblemsByTopicId: (topicId) => get().dsa.problems.filter((problem) => problem.topicId === topicId),

      getProblemById: (problemId) => get().dsa.problems.find((problem) => problem.id === problemId),

      // --- Core Category Actions ---
      addCoreCategory: (category, insertIndex = null) => {
        set((state) => {
          const existing = [...state.core.categories];

          // Clamp insertIndex safely between 0 and existing.length
          const safeIndex = typeof insertIndex === "number" && insertIndex >= 0 && insertIndex <= existing.length ? insertIndex : existing.length;

          existing.splice(safeIndex, 0, category); // Insert at correct position

          return {
            core: {
              ...state.core,
              categories: existing,
            },
          };
        });
      },

      deleteCoreCategory: (id) => {
        set((state) => {
          const topicIdsToDelete = state.core.topics.filter((t) => t.categoryId === id).map((t) => t.id);

          return {
            core: {
              ...state.core,
              categories: state.core.categories.filter((c) => c.id !== id),
              topics: state.core.topics.filter((t) => t.categoryId !== id),
              subtopics: state.core.subtopics.filter((st) => !topicIdsToDelete.includes(st.topicId)),
            },
          };
        });
      },

      updateCoreCategory: (updated) => {
        set((state) => ({
          core: {
            ...state.core,
            categories: state.core.categories.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
          },
        }));
      },
      getCoreCategoryById: (id) => get().core.categories.find((category) => category.id === id),

      // --- Core Topic Actions ---
      addCoreTopic: (topic) => {
        set((state) => ({
          core: {
            ...state.core,
            topics: [...state.core.topics, topic],
          },
        }));
      },

      deleteCoreTopic: (id) => {
        set((state) => ({
          core: {
            ...state.core,
            topics: state.core.topics.filter((t) => t.id !== id),
            subtopics: state.core.subtopics.filter((st) => st.topicId !== id),
          },
        }));
      },

      updateCoreTopic: (updated) => {
        set((state) => ({
          core: {
            ...state.core,
            topics: state.core.topics.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
          },
        }));
      },
      getCoreTopicsByCategoryId: (categoryId) => get().core.topics.filter((topic) => topic.categoryId === categoryId),
      getCoreTopicById: (id) => get().core.topics.find((topic) => topic.id === id),

      // --- Core Subtopic Actions ---
      addCoreSubtopic: (subtopic, options = {}) => {
        set((state) => {
          const { index, addAtIndex = false } = options;
          const all = state.core.subtopics;
          const topicSubs = all.filter((s) => s.topicId === subtopic.topicId);
          const otherSubs = all.filter((s) => s.topicId !== subtopic.topicId);

          let updatedSubs = topicSubs;
          if (addAtIndex && typeof index === "number") {
            updatedSubs = [...topicSubs];
            updatedSubs.splice(index + 1, 0, subtopic); // Insert after index
          } else {
            updatedSubs = [...topicSubs, subtopic]; // Append at end
          }

          return {
            core: {
              ...state.core,
              subtopics: [...otherSubs, ...updatedSubs],
            },
          };
        });
      },

      deleteCoreSubtopic: (id) => {
        set((state) => ({
          core: {
            ...state.core,
            subtopics: state.core.subtopics.filter((st) => st.id !== id),
          },
        }));
      },

      updateCoreSubtopic: (updated) => {
        set((state) => ({
          core: {
            ...state.core,
            subtopics: state.core.subtopics.map((st) => (st.id === updated.id ? { ...st, ...updated } : st)),
          },
        }));
      },

      getCoreSubtopicsByTopicId: (topicId) => get().core.subtopics.filter((subtopic) => subtopic.topicId === topicId),
      getCoreSubtopicById: (id) => get().core.subtopics.find((subtopic) => subtopic.id === id),

      // --- Block-Level Actions ---
      updateBlockInSubtopic: (subtopicId, index, block) => {
        set((state) => {
          const sub = state.core.subtopics.find((s) => s.id === subtopicId);
          if (sub && sub.content[index]) {
            sub.content[index] = block;
          }
        });
      },

      deleteBlockInSubtopic: (subtopicId, index) => {
        set((state) => {
          state.core.subtopics = state.core.subtopics.map((s) => {
            if (s.id !== subtopicId) return s;
            // build a brand-new object with a new content array
            return {
              ...s,
              content: s.content.filter((_, i) => i !== index),
            };
          });
        });
      },
      insertBlockInSubtopic: (subtopicId, index, block) => {
        set((state) => {
          const sub = state.core.subtopics.find((s) => s.id === subtopicId);
          if (sub) {
            sub.content.splice(index, 0, block);
          }
        });
      },

      // --- Interview Actions (New) ---
      addInterviewQuestion: (question, insertIndex = null) => {
        set((state) => {
          const updatedQuestions = [...state.interview.questions];
          if (insertIndex !== null && insertIndex >= 0 && insertIndex <= updatedQuestions.length) {
            updatedQuestions.splice(insertIndex, 0, question); // Insert at index
          } else {
            updatedQuestions.push(question); // Default to push
          }

          return {
            interview: {
              ...state.interview,
              questions: updatedQuestions,
            },
          };
        });
      },

      deleteInterviewQuestion: (id) => {
        set((state) => ({
          interview: {
            ...state.interview,
            questions: state.interview.questions.filter((q) => q.id !== id),
          },
        }));
      },

      updateInterviewQuestion: (updated) => {
        set((state) => ({
          interview: {
            ...state.interview,
            questions: state.interview.questions.map((q) => (q.id === updated.id ? { ...q, ...updated } : q)),
          },
        }));
      },
      getInterviewQuestionById: (id) => get().interview.questions.find((q) => q.id === id),

      // --- Interview Block-Level Actions ---
      updateInterviewAnswerBlock: (questionId: string, index: number, block: ContentElement) => {
        set((state) => {
          const question = state.interview.questions.find((q) => q.id === questionId);
          if (question && question.answer[index]) {
            question.answer[index] = block;
          }
        });
      },

      insertInterviewAnswerBlock: (questionId: string, index: number, block: ContentElement) => {
        set((state) => {
          const question = state.interview.questions.find((q) => q.id === questionId);
          if (question) {
            question.answer.splice(index, 0, block);
          }
        });
      },

      deleteInterviewAnswerBlock: (questionId: string, index: number) => {
        set((state) => {
          state.interview.questions = state.interview.questions.map((q) => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              answer: q.answer.filter((_, i) => i !== index),
            };
          });
        });
      },

      // --- System Design Category Actions (New) ---
      addSystemDesignCategory: (category) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            categories: [...state.systemDesign.categories, category],
          },
        }));
      },

      deleteSystemDesignCategory: (id) => {
        set((state) => {
          const topicIdsToDelete = state.systemDesign.topics.filter((t) => t.categoryId === id).map((t) => t.id);

          return {
            systemDesign: {
              ...state.systemDesign,
              categories: state.systemDesign.categories.filter((c) => c.id !== id),
              topics: state.systemDesign.topics.filter((t) => t.categoryId !== id),
              subtopics: state.systemDesign.subtopics.filter((st) => !topicIdsToDelete.includes(st.topicId)),
            },
          };
        });
      },

      updateSystemDesignCategory: (updated) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            categories: state.systemDesign.categories.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
          },
        }));
      },
      getSystemDesignCategoryById: (id) => get().systemDesign.categories.find((category) => category.id === id),

      // --- System Design Topic Actions (New) ---
      addSystemDesignTopic: (topic) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            topics: [...state.systemDesign.topics, topic],
          },
        }));
      },

      deleteSystemDesignTopic: (id) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            topics: state.systemDesign.topics.filter((t) => t.id !== id),
            subtopics: state.systemDesign.subtopics.filter((st) => st.topicId !== id),
          },
        }));
      },

      updateSystemDesignTopic: (updated) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            topics: state.systemDesign.topics.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
          },
        }));
      },
      getSystemDesignTopicsByCategoryId: (categoryId) => get().systemDesign.topics.filter((topic) => topic.categoryId === categoryId),
      getSystemDesignTopicById: (id) => get().systemDesign.topics.find((topic) => topic.id === id),

      // --- System Design Subtopic Actions (Updated) ---
      addSystemDesignSubtopic: (subtopic, options = {}) => {
        set((state) => {
          const { index, addAtIndex = false } = options;
          const all = state.systemDesign.subtopics;
          const topicSubs = all.filter((s) => s.topicId === subtopic.topicId);
          const otherSubs = all.filter((s) => s.topicId !== subtopic.topicId);

          let updatedSubs = topicSubs;
          if (addAtIndex && typeof index === "number") {
            updatedSubs = [...topicSubs];
            updatedSubs.splice(index + 1, 0, subtopic); // Insert after index
          } else {
            updatedSubs = [...topicSubs, subtopic]; // Append at end
          }

          return {
            systemDesign: {
              ...state.systemDesign,
              subtopics: [...otherSubs, ...updatedSubs],
            },
          };
        });
      },

      deleteSystemDesignSubtopic: (id) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            subtopics: state.systemDesign.subtopics.filter((st) => st.id !== id),
          },
        }));
      },

      updateSystemDesignSubtopic: (updated) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            subtopics: state.systemDesign.subtopics.map((st) => (st.id === updated.id ? { ...st, ...updated } : st)),
          },
        }));
      },

      getSystemDesignSubtopicsByTopicId: (topicId) => get().systemDesign.subtopics.filter((subtopic) => subtopic.topicId === topicId),

      getSystemDesignSubtopicById: (id) => get().systemDesign.subtopics.find((subtopic) => subtopic.id === id),

      // --- Block-Level Actions for systemDesign ---
      updateBlockInSystemDesignSubtopic: (subtopicId, index, block) => {
        set((state) => {
          const sub = state.systemDesign.subtopics.find((s) => s.id === subtopicId);
          if (sub && sub.content[index]) {
            sub.content[index] = block;
          }
        });
      },

      deleteBlockInSystemDesignSubtopic: (subtopicId, index) => {
        set((state) => {
          state.systemDesign.subtopics = state.systemDesign.subtopics.map((s) => {
            if (s.id !== subtopicId) return s;
            return {
              ...s,
              content: s.content.filter((_, i) => i !== index),
            };
          });
        });
      },

      insertBlockInSystemDesignSubtopic: (subtopicId, index, block) => {
        set((state) => {
          const sub = state.systemDesign.subtopics.find((s) => s.id === subtopicId);
          if (sub) {
            sub.content.splice(index, 0, block);
          }
        });
      },

      // --- Global Actions ---
      clearAllData: () => {
        set(() => ({ ...initialState }));
      },
      importData: (data) => {
        set(() => ({ ...data }));
      },
    })),
    {
      name: "StackWise",
      storage: {
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error("Zustand: Error reading from storage:", error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error("Zustand: Error writing to storage:", error);
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error("Zustand: Error removing from storage:", error);
          }
        },
      },
    },
  ),
);
export const getAppState = (): AppState => useAppStore.getState();
