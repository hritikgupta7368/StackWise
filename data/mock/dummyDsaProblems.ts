// data/mock/dummyDsaProblems.ts
import { Problem } from "../../types/types"; // Adjust path as per your project structure

export const dummyDsaProblems: Problem[] = [
  {
    id: "prob-101",
    topicId: "dsa-1", // Belongs to Two Pointers
    title: "Two Sum",
    explanation:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    problemLink: "https://leetcode.com/problems/two-sum/",
    testCase:
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    difficultyLevel: "easy",
    solution:
      "We can use more methods like Binary Search and Hashing to solve this problem (Please refer Two Sum article for details) in better time complexity but Two Pointer Technique is the best solution for this problem that works well for sorted arrays.",
    code: `# Function to check whether any pair exists
    # whose sum is equal to the given target value
    def two_sum(arr, target):
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
        return False

    arr = [0, -1, 2, -3, 1]
    target = -2

    # Call the two_sum function and print the result
    if two_sum(arr, target):
        print("true")
    else:
        print("false")`,
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
    explanation:
      "Given `n` non-negative integers `a1, a2, ..., an` where each represents a point at coordinate `(i, ai)`. `n` vertical lines are drawn such that the two endpoints of the line `i` is at `(i, ai)` and `(i, 0)`. Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
    problemLink: "https://leetcode.com/problems/container-with-most-water/",
    testCase:
      "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.",
    difficultyLevel: "medium",
    code: `def maxArea(height):
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
    solution:
      "The area of water a container can hold is determined by the shorter of the two lines multiplied by the distance between them. A two-pointer approach efficiently explores possible pairs of lines.",
    similarProblems: [],
  },
  {
    id: "prob-201",
    topicId: "dsa-2", // Belongs to Sliding Window
    title: "Longest Substring Without Repeating Characters",
    explanation:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    problemLink:
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    testCase:
      'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.',
    difficultyLevel: "medium",
    solution:
      "Use a hash map to store the last index of each character. Expand the right pointer, and if a duplicate is found, update the left pointer to the next index of the duplicate character.",
    code: `def lengthOfLongestSubstring(s):
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

    similarProblems: [],
  },
];
