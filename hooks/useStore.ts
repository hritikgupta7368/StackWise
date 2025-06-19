import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Mock Data (Remove this section in production) ---
const USE_MOCK_DATA = true; // Set to false to disable mock data

export const dummyTopics: DsaTopic[] = [
  {
    id: "1",
    title: "Two Pointers",
    subtitle: "Problems related to arrays.",
  },
  {
    id: "2",
    title: "Sliding Window",
    subtitle: "Problems related to sliding window",
  },
];

export const dummyProblems: Problem[] = [
  {
    id: "101",
    topicId: "1", // Belongs to Arrays
    title: "Two Sum",
    problemLink: "https://leetcode.com/problems/two-sum/",
    testCase:
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficultyLevel: "easy",
    explanation: `A common approach is to use a hash map (or dictionary). We iterate through the array, and for each number, we calculate the complement needed to reach the target (complement = target - num).`,
    code: `def twoSum(arr, target):
        n = len(arr)

        # Iterate through each element in the array
        for i in range(n):

            # For each element arr[i], check every
            # other element arr[j] that comes after it
            for j in range(i + 1, n):

                # Check if the sum of the current pair
                # equals the target
                if arr[i] + arr[j] == target:
                    return True

        # If no pair is found after checking
        # all possibilities
        return False `,
    similarProblems: [
      {
        title: "3Sum",
        description:
          "Find three numbers that sum to zero (sorting + two pointers). ",
        shortExplanation: [
          "Sort the input array first.",
          "Iterate through the array, fixing one element.",
          "Use a two-pointer approach on the remaining part to find the other two elements.",
          "Handle duplicates to avoid redundant triplets.",
        ],
        difficultyLevel: "medium",
        code: `
        #this is the first comment
        def threeSum(nums):
            nums.sort()
            result = []
            for i in range(len(nums) - 2):
                if i > 0 and nums[i] == nums[i-1]:
                    continue
                left, right = i + 1, len(nums) - 1
                while left < right:
                    current_sum = nums[i] + nums[left] + nums[right]
                    if current_sum < 0:
                        left += 1
                    elif current_sum > 0:
                        right -= 1
                    else:
                        result.append([nums[i], nums[left], nums[right]])
                        while left < right and nums[left] == nums[left+1]:
                            left += 1
                        while left < right and nums[right] == nums[right-1]:
                            right -= 1
                        left += 1
                        right -= 1
            return result
            `,
      },
      {
        title: "Two Sum II - Input Array Is Sorted",
        description: "Array is sorted, can use two pointers from both ends.",
        shortExplanation: [
          "Initialize two pointers: one at the beginning (left) and one at the end (right).",
          "While left < right:",
          "  If sum > target, decrement right.",
          "  If sum < target, increment left.",
          "  If sum == target, return indices.",
        ],
        difficultyLevel: "easy",
        code: `
        def twoSumSorted(numbers, target):
            left, right = 0, len(numbers) - 1
            while left < right:
                current_sum = numbers[left] + numbers[right]
                if current_sum == target:
                    return [left + 1, right + 1] # 1-indexed output
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1
            return []
            `,
      },
      {
        title: "Two Sum IV - Input is a BST",
        description: "Input is a Binary Search Tree, traverse and use a set.",
        shortExplanation: [
          "Perform an in-order traversal of the BST to get sorted elements, or use a hash set.",
          "During traversal, for each node value, check if `target - node.val` exists in the set.",
          "If it exists, you found a pair.",
          "If not, add `node.val` to the set and continue traversal.",
        ],
        difficultyLevel: "medium",
        code: `
        # Definition for a binary tree node.
        # class TreeNode:
        #     def __init__(self, val=0, left=None, right=None):
        #         self.val = val
        #         self.left = left
        #         self.right = right

        def findTarget(root, k):
            seen = set()
            def dfs(node):
                if not node:
                    return False
                if (k - node.val) in seen:
                    return True
                seen.add(node.val)
                return dfs(node.left) or dfs(node.right)
            return dfs(root)
            `,
      },
    ],
  },

  {
    id: "102",
    topicId: "1", // Belongs to Arrays
    title: "Contains Duplicate",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficultyLevel: "easy",
    explanation:
      "Use a hash set to store numbers as you iterate. If you encounter a number already in the set, you've found a duplicate.",
    code: `def twoSum(arr, target):
          n = len(arr)

          # Iterate through each element in the array
          for i in range(n):

              # For each element arr[i], check every
              # other element arr[j] that comes after it
              for j in range(i + 1, n):

                  # Check if the sum of the current pair
                  # equals the target
                  if arr[i] + arr[j] == target:
                      return True

          # If no pair is found after checking
          # all possibilities
          return False `,
  },
  {
    id: "103",
    topicId: "1", // Belongs to Arrays
    title: "Best Time to Buy and Sell Stock",
    description:
      "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    difficultyLevel: "medium",
    explanation:
      "Iterate through the prices, keeping track of the minimum price found so far and the maximum profit that can be achieved.",
  },
  {
    id: "104",
    topicId: "2", // Belongs to Arrays
    title: "Sliding Window Maximum",
    description:
      "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    difficultyLevel: "medium",
    explanation:
      "Iterate through the prices, keeping track of the minimum price found so far and the maximum profit that can be achieved.",
  },
];
// --- End Mock Data ---

// --- Type Definitions ---
export type Problem = {
  id: string;
  topicId: string;
  title: string;
  testCase?: string;
  description: string;
  difficultyLevel: "easy" | "medium" | "hard";
  problemLink?: string;
  explanation: string;
  images?: string[];
  code?: string;
  similarProblems?: {
    title: string;
    description: string;
    shortExplanation: string | string[];
    difficultyLevel: "easy" | "medium" | "hard";
    code?: string;
  }[];
};

export type DsaTopic = {
  id: string;
  title: string;
  subtitle: string;
};

// --- Store Type Definition ---
type ProblemStore = {
  topics: DsaTopic[];
  problems: Problem[]; // NEW: Array to hold all problems
  // --- DSA Topics CRUD ---
  addTopic: (topic: DsaTopic) => void;
  deleteTopic: (id: string) => void;
  updateTopic: (updated: DsaTopic) => void;
  // --- DSA Problems CRUD ---
  addProblem: (problem: Problem) => void;
  deleteProblem: (id: string) => void;
  updateProblem: (updated: Problem) => void;
  getProblemsByTopicId: (topicId: string) => Problem[];
  clearAll: () => void; // For development/resetting
};

// --- Zustand Store Creation ---
export const useProblemStore = create<ProblemStore>()(
  persist(
    (set, get) => ({
      topics: USE_MOCK_DATA ? dummyTopics : [],
      problems: USE_MOCK_DATA ? dummyProblems : [], // Initialize the problems array
      // Topic actions
      addTopic: (topic) => {
        try {
          set({ topics: [...get().topics, topic] });
        } catch (error) {
          console.error("Error adding topic:", error);
        }
      },
      deleteTopic: (id) => {
        try {
          set((state) => ({
            topics: state.topics.filter((t) => t.id !== id),
            // When a topic is deleted, also remove its associated problems
            problems: state.problems.filter((p) => p.topicId !== id),
          }));
        } catch (error) {
          console.error("Error deleting topic:", error);
        }
      },
      updateTopic: (updated) => {
        try {
          set({
            topics: get().topics.map((t) =>
              t.id === updated.id ? updated : t,
            ),
          });
        } catch (error) {
          console.error("Error updating topic:", error);
        }
      },
      // Problem actions
      addProblem: (problem) => {
        try {
          set({ problems: [...get().problems, problem] });
        } catch (error) {
          console.error("Error adding problem:", error);
        }
      },
      deleteProblem: (id) => {
        try {
          set({ problems: get().problems.filter((p) => p.id !== id) });
        } catch (error) {
          console.error("Error deleting problem:", error);
        }
      },
      updateProblem: (updated) => {
        try {
          set({
            problems: get().problems.map((p) =>
              p.id === updated.id ? updated : p,
            ),
          });
        } catch (error) {
          console.error("Error updating problem:", error);
        }
      },
      // Selector for problems by topic
      getProblemsByTopicId: (topicId: string) => {
        try {
          // Filter the main problems array to return only those belonging to the given topicId
          return get().problems.filter(
            (problem) => problem.topicId === topicId,
          );
        } catch (error) {
          console.error("Error getting problems by topic ID:", error);
          return [];
        }
      },
      // Clear all data (for debugging/testing)
      clearAll: () => {
        try {
          set({ topics: [], problems: [] });
        } catch (error) {
          console.error("Error clearing all data:", error);
        }
      },
    }),
    {
      name: "problem-store", // Name for AsyncStorage key
      storage: {
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error("Error reading from storage:", error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error("Error writing to storage:", error);
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error("Error removing from storage:", error);
          }
        },
      },
      // You can add partialize to control what gets persisted if needed
      // partialize: (state) => ({ topics: state.topics, problems: state.problems }),
    },
  ),
);
