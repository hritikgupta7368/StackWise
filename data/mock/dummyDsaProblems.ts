// data/mock/dummyDsaProblems.ts
import { Problem } from "../../types/types"; // Adjust path as per your project structure

export const dummyDsaProblems: Problem[] = [
  {
    id: "prob-101",
    topicId: "dsa-1", // Belongs to Two Pointers
    title: "Two Sum",
    problemLink: "https://leetcode.com/problems/two-sum/",
    difficultyLevel: "easy",
    content: [
      {
        type: "paragraph",
        value:
          "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      },
      {
        type: "paragraph",
        value:
          "Input: `nums = [2,7,11,15]`, `target = 9`\nOutput: `[0,1]`\nExplanation: Because `nums[0] + nums[1] == 9`, we return `[0, 1]`.",
      },
      {
        type: "paragraph",
        value:
          "A common approach is to use a hash map (or dictionary). We iterate through the array, and for each number, we calculate the complement needed to reach the target (`complement = target - num`). We then check if this complement exists in our hash map. If it does, we've found our pair.",
      },
      {
        type: "code",
        value: `def twoSum(nums, target):
    num_map = {} # Value -> Index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
        language: "python",
      },
      {
        type: "image",
        // This 'value' should correspond to a path relative to your assets/images/dsa directory.
        // For local assets, you might load them via require() in the renderer.
        // For simplicity, here we use a placeholder that matches the expected path structure.
        value: "dsa/twoPointers/two_sum_hashmap_diagram.png",
        alt: "Diagram illustrating the Two Sum problem with a hash map.",
      },
      {
        type: "list",
        value: [
          "Time Complexity: $O(n)$ because we iterate through the list once.",
          "Space Complexity: $O(n)$ for the hash map in the worst case.",
        ],
      },
    ],
    similarProblems: [
      {
        title: "3Sum",
        description:
          "Find all unique triplets in the array which gives the sum of zero.",
        shortExplanation: [
          "Sort the input array.",
          "Iterate and fix one element.",
          "Use a two-pointer approach on the remaining part to find the other two elements.",
          "Handle duplicates carefully.",
        ],
        difficultyLevel: "medium",
        code: `def threeSum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            if current_sum < 0: left += 1
            elif current_sum > 0: right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]: left += 1
                while left < right and nums[right] == nums[right-1]: right -= 1
                left += 1
                right -= 1
    return result`,
      },
    ],
  },
  {
    id: "prob-102",
    topicId: "dsa-1", // Belongs to Two Pointers
    title: "Container With Most Water",
    problemLink: "https://leetcode.com/problems/container-with-most-water/",
    difficultyLevel: "medium",
    content: [
      {
        type: "paragraph",
        value:
          "Given `n` non-negative integers `a1, a2, ..., an` where each represents a point at coordinate `(i, ai)`. `n` vertical lines are drawn such that the two endpoints of the line `i` is at `(i, ai)` and `(i, 0)`. Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
      },
      {
        type: "paragraph",
        value:
          "The area of water a container can hold is determined by the shorter of the two lines multiplied by the distance between them. A two-pointer approach efficiently explores possible pairs of lines.",
      },
      {
        type: "code",
        value: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        current_water = min(height[left], height[right]) * (right - left)
        max_water = max(max_water, current_water)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
        language: "python",
      },
    ],
    similarProblems: [],
  },
  {
    id: "prob-201",
    topicId: "dsa-2", // Belongs to Sliding Window
    title: "Longest Substring Without Repeating Characters",
    problemLink:
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    difficultyLevel: "medium",
    content: [
      {
        type: "paragraph",
        value:
          "Given a string `s`, find the length of the longest substring without repeating characters.",
      },
      {
        type: "paragraph",
        value:
          "This is a classic sliding window problem. Use a hash set to keep track of characters in the current window. Expand the right pointer, and if a duplicate is found, shrink the left pointer until the window is valid again.",
      },
      {
        type: "code",
        value: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,
        language: "python",
      },
    ],
    similarProblems: [],
  },
];
