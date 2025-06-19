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
 *
 * 🔸 Tech:
 *   - Zustand (with `persist` middleware)
 *   - AsyncStorage for local data persistence
 *
 * Usage:
 *   - Import `useAppStore()` in any component to access or modify state
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
} from "../types/types"; // Adjust this path

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

// --- Zustand Store Creation ---
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState, // Initialize store with the defined initial state

      // --- DSA Topic Actions ---
      addDsaTopic: (topic) => {
        set((state) => ({
          dsa: { ...state.dsa, topics: [...state.dsa.topics, topic] },
        }));
      },
      deleteDsaTopic: (id) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            topics: state.dsa.topics.filter((t) => t.id !== id),
            problems: state.dsa.problems.filter((p) => p.topicId !== id),
          },
        }));
      },
      updateDsaTopic: (updated) => {
        set((state) => ({
          dsa: {
            ...state.dsa,
            topics: state.dsa.topics.map((t) =>
              t.id === updated.id ? updated : t,
            ),
          },
        }));
      },
      getDsaTopicById: (id) =>
        get().dsa.topics.find((topic) => topic.id === id),

      // --- DSA Problem Actions ---
      addProblem: (problem) => {
        set((state) => ({
          dsa: { ...state.dsa, problems: [...state.dsa.problems, problem] },
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
            problems: state.dsa.problems.map((p) =>
              p.id === updated.id ? updated : p,
            ),
          },
        }));
      },
      getDsaProblemsByTopicId: (topicId) =>
        get().dsa.problems.filter((problem) => problem.topicId === topicId),
      getProblemById: (problemId) =>
        get().dsa.problems.find((problem) => problem.id === problemId),

      // --- Core Category Actions ---
      addCoreCategory: (category) => {
        set((state) => ({
          core: {
            ...state.core,
            categories: [...state.core.categories, category],
          },
        }));
      },
      deleteCoreCategory: (id) => {
        set((state) => {
          const remainingTopics = state.core.topics.filter(
            (t) => t.categoryId !== id,
          );
          return {
            core: {
              ...state.core,
              categories: state.core.categories.filter((c) => c.id !== id),
              topics: remainingTopics,
              subtopics: state.core.subtopics.filter(
                (st) => remainingTopics.some((t) => t.id === st.topicId), // Only keep subtopics whose parent topic remains
              ),
            },
          };
        });
      },
      updateCoreCategory: (updated) => {
        set((state) => ({
          core: {
            ...state.core,
            categories: state.core.categories.map((c) =>
              c.id === updated.id ? updated : c,
            ),
          },
        }));
      },
      getCoreCategoryById: (id) =>
        get().core.categories.find((category) => category.id === id),

      // --- Core Topic Actions ---
      addCoreTopic: (topic) => {
        set((state) => ({
          core: { ...state.core, topics: [...state.core.topics, topic] },
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
            topics: state.core.topics.map((t) =>
              t.id === updated.id ? updated : t,
            ),
          },
        }));
      },
      getCoreTopicsByCategoryId: (categoryId) =>
        get().core.topics.filter((topic) => topic.categoryId === categoryId),
      getCoreTopicById: (id) =>
        get().core.topics.find((topic) => topic.id === id),

      // --- Core Subtopic Actions ---
      addCoreSubtopic: (subtopic) => {
        set((state) => ({
          core: {
            ...state.core,
            subtopics: [...state.core.subtopics, subtopic],
          },
        }));
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
            subtopics: state.core.subtopics.map((st) =>
              st.id === updated.id ? updated : st,
            ),
          },
        }));
      },
      getCoreSubtopicsByTopicId: (topicId) =>
        get().core.subtopics.filter((subtopic) => subtopic.topicId === topicId),
      getCoreSubtopicById: (id) =>
        get().core.subtopics.find((subtopic) => subtopic.id === id),

      // --- Interview Actions (New) ---
      addInterviewQuestion: (question) => {
        set((state) => ({
          interview: {
            ...state.interview,
            questions: [...state.interview.questions, question],
          },
        }));
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
            questions: state.interview.questions.map((q) =>
              q.id === updated.id ? updated : q,
            ),
          },
        }));
      },
      getInterviewQuestionById: (id) =>
        get().interview.questions.find((q) => q.id === id),

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
          const remainingTopics = state.systemDesign.topics.filter(
            (t) => t.categoryId !== id,
          );
          return {
            systemDesign: {
              ...state.systemDesign,
              categories: state.systemDesign.categories.filter(
                (c) => c.id !== id,
              ),
              topics: remainingTopics,
              subtopics: state.systemDesign.subtopics.filter((st) =>
                remainingTopics.some((t) => t.id === st.topicId),
              ),
            },
          };
        });
      },
      updateSystemDesignCategory: (updated) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            categories: state.systemDesign.categories.map((c) =>
              c.id === updated.id ? updated : c,
            ),
          },
        }));
      },
      getSystemDesignCategoryById: (id) =>
        get().systemDesign.categories.find((category) => category.id === id),

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
            subtopics: state.systemDesign.subtopics.filter(
              (st) => st.topicId !== id,
            ),
          },
        }));
      },
      updateSystemDesignTopic: (updated) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            topics: state.systemDesign.topics.map((t) =>
              t.id === updated.id ? updated : t,
            ),
          },
        }));
      },
      getSystemDesignTopicsByCategoryId: (categoryId) =>
        get().systemDesign.topics.filter(
          (topic) => topic.categoryId === categoryId,
        ),
      getSystemDesignTopicById: (id) =>
        get().systemDesign.topics.find((topic) => topic.id === id),

      // --- System Design Subtopic Actions (New) ---
      addSystemDesignSubtopic: (subtopic) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            subtopics: [...state.systemDesign.subtopics, subtopic],
          },
        }));
      },
      deleteSystemDesignSubtopic: (id) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            subtopics: state.systemDesign.subtopics.filter(
              (st) => st.id !== id,
            ),
          },
        }));
      },
      updateSystemDesignSubtopic: (updated) => {
        set((state) => ({
          systemDesign: {
            ...state.systemDesign,
            subtopics: state.systemDesign.subtopics.map((st) =>
              st.id === updated.id ? updated : st,
            ),
          },
        }));
      },
      getSystemDesignSubtopicsByTopicId: (topicId) =>
        get().systemDesign.subtopics.filter(
          (subtopic) => subtopic.topicId === topicId,
        ),
      getSystemDesignSubtopicById: (id) =>
        get().systemDesign.subtopics.find((subtopic) => subtopic.id === id),

      // --- Global Actions ---
      clearAllData: () => {
        set(initialState);
      },
      importData: (data) => {
        set(data);
      },
    }),
    {
      name: "app-learning-store",
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
