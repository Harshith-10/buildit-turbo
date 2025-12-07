export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  acceptance: number;
  submissions: number;
  solved: boolean;
  bookmarked: boolean;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: { input: string; expected: string }[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  status: "upcoming" | "live" | "completed";
  score?: number;
  maxScore?: number;
  passed?: boolean;
  topics: string[];
}

export interface Submission {
  id: string;
  problemId: string;
  status:
    | "accepted"
    | "wrong_answer"
    | "time_limit"
    | "runtime_error"
    | "compilation_error";
  language: string;
  runtime: string;
  memory: string;
  timestamp: string;
  code: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  problemsSolved: number;
  examScore: number;
  streak: number;
}

// Problems
export const mockProblems: Problem[] = [
  {
    id: "prob-1",
    title: "Two Sum",
    difficulty: "easy",
    category: "Arrays",
    tags: ["Array", "Hash Table"],
    acceptance: 49.2,
    submissions: 15420,
    solved: true,
    bookmarked: false,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
  
  You may assume that each input would have exactly one solution, and you may not use the same element twice.
  
  You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      javascript: `/**
   * @param {number[]} nums
   * @param {number} target
   * @return {number[]}
   */
  function twoSum(nums, target) {
      // Write your code here
  }`,
      python: `class Solution:
      def twoSum(self, nums: List[int], target: int) -> List[int]:
          # Write your code here
          pass`,
      java: `class Solution {
      public int[] twoSum(int[] nums, int target) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      vector<int> twoSum(vector<int>& nums, int target) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[2,7,11,15]\n9", expected: "[0,1]" },
      { input: "[3,2,4]\n6", expected: "[1,2]" },
      { input: "[3,3]\n6", expected: "[0,1]" },
    ],
  },
  {
    id: "prob-2",
    title: "Valid Parentheses",
    difficulty: "easy",
    category: "Strings",
    tags: ["String", "Stack"],
    acceptance: 40.5,
    submissions: 12300,
    solved: true,
    bookmarked: true,
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
  
  An input string is valid if:
  1. Open brackets must be closed by the same type of brackets.
  2. Open brackets must be closed in the correct order.
  3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      javascript: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isValid(s) {
      // Write your code here
  }`,
      python: `class Solution:
      def isValid(self, s: str) -> bool:
          # Write your code here
          pass`,
      java: `class Solution {
      public boolean isValid(String s) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      bool isValid(string s) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "()", expected: "true" },
      { input: "()[]{}", expected: "true" },
      { input: "(]", expected: "false" },
    ],
  },
  {
    id: "prob-3",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    category: "Linked Lists",
    tags: ["Linked List", "Recursion"],
    acceptance: 62.1,
    submissions: 9800,
    solved: false,
    bookmarked: false,
    description: `You are given the heads of two sorted linked lists list1 and list2.
  
  Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
  
  Return the head of the merged linked list.`,
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    starterCode: {
      javascript: `/**
   * @param {ListNode} list1
   * @param {ListNode} list2
   * @return {ListNode}
   */
  function mergeTwoLists(list1, list2) {
      // Write your code here
  }`,
      python: `class Solution:
      def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
          # Write your code here
          pass`,
      java: `class Solution {
      public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expected: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", expected: "[]" },
      { input: "[]\n[0]", expected: "[0]" },
    ],
  },
  {
    id: "prob-4",
    title: "Add Two Numbers",
    difficulty: "medium",
    category: "Linked Lists",
    tags: ["Linked List", "Math", "Recursion"],
    acceptance: 39.8,
    submissions: 8700,
    solved: false,
    bookmarked: true,
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
  
  You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
      { input: "l1 = [0], l2 = [0]", output: "[0]" },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    starterCode: {
      javascript: `/**
   * @param {ListNode} l1
   * @param {ListNode} l2
   * @return {ListNode}
   */
  function addTwoNumbers(l1, l2) {
      // Write your code here
  }`,
      python: `class Solution:
      def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
          # Write your code here
          pass`,
      java: `class Solution {
      public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[2,4,3]\n[5,6,4]", expected: "[7,0,8]" },
      { input: "[0]\n[0]", expected: "[0]" },
    ],
  },
  {
    id: "prob-5",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    category: "Strings",
    tags: ["String", "Sliding Window", "Hash Table"],
    acceptance: 33.8,
    submissions: 11200,
    solved: true,
    bookmarked: false,
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      javascript: `/**
   * @param {string} s
   * @return {number}
   */
  function lengthOfLongestSubstring(s) {
      // Write your code here
  }`,
      python: `class Solution:
      def lengthOfLongestSubstring(self, s: str) -> int:
          # Write your code here
          pass`,
      java: `class Solution {
      public int lengthOfLongestSubstring(String s) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      int lengthOfLongestSubstring(string s) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "abcabcbb", expected: "3" },
      { input: "bbbbb", expected: "1" },
      { input: "pwwkew", expected: "3" },
    ],
  },
  {
    id: "prob-6",
    title: "3Sum",
    difficulty: "medium",
    category: "Arrays",
    tags: ["Array", "Two Pointers", "Sorting"],
    acceptance: 32.4,
    submissions: 9500,
    solved: false,
    bookmarked: false,
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
  
  Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    starterCode: {
      javascript: `/**
   * @param {number[]} nums
   * @return {number[][]}
   */
  function threeSum(nums) {
      // Write your code here
  }`,
      python: `class Solution:
      def threeSum(self, nums: List[int]) -> List[List[int]]:
          # Write your code here
          pass`,
      java: `class Solution {
      public List<List<Integer>> threeSum(int[] nums) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      vector<vector<int>> threeSum(vector<int>& nums) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" },
      { input: "[0,1,1]", expected: "[]" },
    ],
  },
  {
    id: "prob-7",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    category: "Trees",
    tags: ["Tree", "BFS", "Binary Tree"],
    acceptance: 63.2,
    submissions: 7800,
    solved: true,
    bookmarked: true,
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    starterCode: {
      javascript: `/**
   * @param {TreeNode} root
   * @return {number[][]}
   */
  function levelOrder(root) {
      // Write your code here
  }`,
      python: `class Solution:
      def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
          # Write your code here
          pass`,
      java: `class Solution {
      public List<List<Integer>> levelOrder(TreeNode root) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      vector<vector<int>> levelOrder(TreeNode* root) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expected: "[[3],[9,20],[15,7]]" },
      { input: "[1]", expected: "[[1]]" },
    ],
  },
  {
    id: "prob-8",
    title: "Merge Intervals",
    difficulty: "medium",
    category: "Arrays",
    tags: ["Array", "Sorting"],
    acceptance: 45.9,
    submissions: 8900,
    solved: false,
    bookmarked: false,
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation:
          "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4",
    ],
    starterCode: {
      javascript: `/**
   * @param {number[][]} intervals
   * @return {number[][]}
   */
  function merge(intervals) {
      // Write your code here
  }`,
      python: `class Solution:
      def merge(self, intervals: List[List[int]]) -> List[List[int]]:
          # Write your code here
          pass`,
      java: `class Solution {
      public int[][] merge(int[][] intervals) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      vector<vector<int>> merge(vector<vector<int>>& intervals) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        expected: "[[1,6],[8,10],[15,18]]",
      },
      { input: "[[1,4],[4,5]]", expected: "[[1,5]]" },
    ],
  },
  {
    id: "prob-9",
    title: "Trapping Rain Water",
    difficulty: "hard",
    category: "Arrays",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    acceptance: 58.7,
    submissions: 6500,
    solved: false,
    bookmarked: true,
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation:
          "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.",
      },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    starterCode: {
      javascript: `/**
   * @param {number[]} height
   * @return {number}
   */
  function trap(height) {
      // Write your code here
  }`,
      python: `class Solution:
      def trap(self, height: List[int]) -> int:
          # Write your code here
          pass`,
      java: `class Solution {
      public int trap(int[] height) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      int trap(vector<int>& height) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
      { input: "[4,2,0,3,2,5]", expected: "9" },
    ],
  },
  {
    id: "prob-10",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    category: "Arrays",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    acceptance: 36.2,
    submissions: 5400,
    solved: false,
    bookmarked: false,
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
  
  The overall run time complexity should be O(log (m+n)).`,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation:
          "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6",
    ],
    starterCode: {
      javascript: `/**
   * @param {number[]} nums1
   * @param {number[]} nums2
   * @return {number}
   */
  function findMedianSortedArrays(nums1, nums2) {
      // Write your code here
  }`,
      python: `class Solution:
      def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
          # Write your code here
          pass`,
      java: `class Solution {
      public double findMedianSortedArrays(int[] nums1, int[] nums2) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[1,3]\n[2]", expected: "2.00000" },
      { input: "[1,2]\n[3,4]", expected: "2.50000" },
    ],
  },
  {
    id: "prob-11",
    title: "Maximum Subarray",
    difficulty: "medium",
    category: "Dynamic Programming",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    acceptance: 50.1,
    submissions: 10200,
    solved: true,
    bookmarked: false,
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `/**
   * @param {number[]} nums
   * @return {number}
   */
  function maxSubArray(nums) {
      // Write your code here
  }`,
      python: `class Solution:
      def maxSubArray(self, nums: List[int]) -> int:
          # Write your code here
          pass`,
      java: `class Solution {
      public int maxSubArray(int[] nums) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      int maxSubArray(vector<int>& nums) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "[1]", expected: "1" },
    ],
  },
  {
    id: "prob-12",
    title: "Word Break",
    difficulty: "medium",
    category: "Dynamic Programming",
    tags: ["String", "Dynamic Programming", "Hash Table", "Trie"],
    acceptance: 45.3,
    submissions: 7600,
    solved: false,
    bookmarked: false,
    description: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
  
  Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation:
          'Return true because "leetcode" can be segmented as "leet code".',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: "true",
        explanation:
          'Return true because "applepenapple" can be segmented as "apple pen apple".',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters.",
      "All the strings of wordDict are unique.",
    ],
    starterCode: {
      javascript: `/**
   * @param {string} s
   * @param {string[]} wordDict
   * @return {boolean}
   */
  function wordBreak(s, wordDict) {
      // Write your code here
  }`,
      python: `class Solution:
      def wordBreak(self, s: str, wordDict: List[str]) -> bool:
          # Write your code here
          pass`,
      java: `class Solution {
      public boolean wordBreak(String s, List<String> wordDict) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      bool wordBreak(string s, vector<string>& wordDict) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: 'leetcode\n["leet","code"]', expected: "true" },
      { input: 'applepenapple\n["apple","pen"]', expected: "true" },
    ],
  },
  {
    id: "prob-13",
    title: "LRU Cache",
    difficulty: "medium",
    category: "Design",
    tags: ["Design", "Hash Table", "Linked List"],
    acceptance: 40.8,
    submissions: 6900,
    solved: false,
    bookmarked: true,
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
  
  Implement the LRUCache class:
  - LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
  - int get(int key) Return the value of the key if the key exists, otherwise return -1.
  - void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.
  
  The functions get and put must each run in O(1) average time complexity.`,
    examples: [
      {
        input:
          '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
      },
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put.",
    ],
    starterCode: {
      javascript: `/**
   * @param {number} capacity
   */
  var LRUCache = function(capacity) {
      // Write your code here
  };
  
  /** 
   * @param {number} key
   * @return {number}
   */
  LRUCache.prototype.get = function(key) {
      // Write your code here
  };
  
  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  LRUCache.prototype.put = function(key, value) {
      // Write your code here
  };`,
      python: `class LRUCache:
  
      def __init__(self, capacity: int):
          # Write your code here
          pass
  
      def get(self, key: int) -> int:
          # Write your code here
          pass
  
      def put(self, key: int, value: int) -> None:
          # Write your code here
          pass`,
      java: `class LRUCache {
  
      public LRUCache(int capacity) {
          // Write your code here
      }
      
      public int get(int key) {
          // Write your code here
      }
      
      public void put(int key, int value) {
          // Write your code here
      }
  }`,
      cpp: `class LRUCache {
  public:
      LRUCache(int capacity) {
          // Write your code here
      }
      
      int get(int key) {
          // Write your code here
      }
      
      void put(int key, int value) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      {
        input:
          '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        expected: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
      },
    ],
  },
  {
    id: "prob-14",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "hard",
    category: "Trees",
    tags: ["Tree", "Design", "String", "BFS", "DFS"],
    acceptance: 55.4,
    submissions: 4800,
    solved: false,
    bookmarked: false,
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.
  
  Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
      },
      { input: "root = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000",
    ],
    starterCode: {
      javascript: `/**
   * Encodes a tree to a single string.
   * @param {TreeNode} root
   * @return {string}
   */
  var serialize = function(root) {
      // Write your code here
  };
  
  /**
   * Decodes your encoded data to tree.
   * @param {string} data
   * @return {TreeNode}
   */
  var deserialize = function(data) {
      // Write your code here
  };`,
      python: `class Codec:
  
      def serialize(self, root):
          """Encodes a tree to a single string."""
          # Write your code here
          pass
          
      def deserialize(self, data):
          """Decodes your encoded data to tree."""
          # Write your code here
          pass`,
      java: `public class Codec {
  
      // Encodes a tree to a single string.
      public String serialize(TreeNode root) {
          // Write your code here
      }
  
      // Decodes your encoded data to tree.
      public TreeNode deserialize(String data) {
          // Write your code here
      }
  }`,
      cpp: `class Codec {
  public:
  
      // Encodes a tree to a single string.
      string serialize(TreeNode* root) {
          // Write your code here
      }
  
      // Decodes your encoded data to tree.
      TreeNode* deserialize(string data) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[1,2,3,null,null,4,5]", expected: "[1,2,3,null,null,4,5]" },
      { input: "[]", expected: "[]" },
    ],
  },
  {
    id: "prob-15",
    title: "Reverse Linked List",
    difficulty: "easy",
    category: "Linked Lists",
    tags: ["Linked List", "Recursion"],
    acceptance: 72.5,
    submissions: 14200,
    solved: true,
    bookmarked: false,
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: {
      javascript: `/**
   * @param {ListNode} head
   * @return {ListNode}
   */
  function reverseList(head) {
      // Write your code here
  }`,
      python: `class Solution:
      def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
          # Write your code here
          pass`,
      java: `class Solution {
      public ListNode reverseList(ListNode head) {
          // Write your code here
      }
  }`,
      cpp: `class Solution {
  public:
      ListNode* reverseList(ListNode* head) {
          // Write your code here
      }
  };`,
    },
    testCases: [
      { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" },
      { input: "[1,2]", expected: "[2,1]" },
    ],
  },
];

// Exams
export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Data Structures Fundamentals",
    description:
      "Test your knowledge of arrays, linked lists, stacks, and queues.",
    duration: 90,
    totalQuestions: 15,
    difficulty: "easy",
    category: "Data Structures",
    startDate: "2025-06-10",
    startTime: "09:00",
    endTime: "10:30",
    status: "upcoming",
    topics: ["Arrays", "Linked Lists", "Stacks", "Queues"],
  },
  {
    id: "exam-2",
    title: "Algorithm Design & Analysis",
    description:
      "Comprehensive exam covering sorting, searching, and complexity analysis.",
    duration: 120,
    totalQuestions: 20,
    difficulty: "medium",
    category: "Algorithms",
    startDate: "2025-06-12",
    startTime: "14:00",
    endTime: "16:00",
    status: "upcoming",
    topics: ["Sorting", "Searching", "Time Complexity", "Space Complexity"],
  },
  {
    id: "exam-3",
    title: "Dynamic Programming Mastery",
    description:
      "Advanced exam focusing on DP patterns and optimization techniques.",
    duration: 150,
    totalQuestions: 12,
    difficulty: "hard",
    category: "Algorithms",
    startDate: "2025-06-15",
    startTime: "10:00",
    endTime: "12:30",
    status: "upcoming",
    topics: ["Memoization", "Tabulation", "Optimization", "State Machines"],
  },
  {
    id: "exam-4",
    title: "Graph Algorithms",
    description:
      "Exam covering BFS, DFS, shortest paths, and minimum spanning trees.",
    duration: 120,
    totalQuestions: 18,
    difficulty: "medium",
    category: "Algorithms",
    startDate: "2025-06-18",
    startTime: "09:00",
    endTime: "11:00",
    status: "upcoming",
    topics: ["BFS", "DFS", "Dijkstra", "MST"],
  },
  {
    id: "exam-5",
    title: "Object-Oriented Programming",
    description:
      "Test your understanding of OOP principles and design patterns.",
    duration: 90,
    totalQuestions: 25,
    difficulty: "easy",
    category: "Programming",
    status: "live",
    topics: ["Classes", "Inheritance", "Polymorphism", "Design Patterns"],
  },
  {
    id: "exam-6",
    title: "Database Management",
    description: "SQL queries, normalization, and transaction management.",
    duration: 90,
    totalQuestions: 20,
    difficulty: "medium",
    category: "Databases",
    startDate: "2025-05-20",
    status: "completed",
    score: 85,
    maxScore: 100,
    passed: true,
    topics: ["SQL", "Normalization", "Transactions", "Indexing"],
  },
  {
    id: "exam-7",
    title: "Web Development Fundamentals",
    description: "HTML, CSS, JavaScript, and modern web frameworks.",
    duration: 120,
    totalQuestions: 30,
    difficulty: "easy",
    category: "Web Development",
    startDate: "2025-05-15",
    status: "completed",
    score: 92,
    maxScore: 100,
    passed: true,
    topics: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: "exam-8",
    title: "System Design Basics",
    description: "Introduction to scalability, load balancing, and caching.",
    duration: 180,
    totalQuestions: 10,
    difficulty: "hard",
    category: "System Design",
    startDate: "2025-05-10",
    status: "completed",
    score: 68,
    maxScore: 100,
    passed: false,
    topics: ["Scalability", "Load Balancing", "Caching", "Databases"],
  },
  {
    id: "exam-9",
    title: "Operating Systems",
    description: "Processes, threads, memory management, and file systems.",
    duration: 120,
    totalQuestions: 25,
    difficulty: "medium",
    category: "Systems",
    startDate: "2025-05-05",
    status: "completed",
    score: 78,
    maxScore: 100,
    passed: true,
    topics: ["Processes", "Threads", "Memory", "File Systems"],
  },
  {
    id: "exam-10",
    title: "Computer Networks",
    description: "TCP/IP, routing, and network security fundamentals.",
    duration: 90,
    totalQuestions: 20,
    difficulty: "medium",
    category: "Networking",
    startDate: "2025-04-28",
    status: "completed",
    score: 88,
    maxScore: 100,
    passed: true,
    topics: ["TCP/IP", "Routing", "Security", "Protocols"],
  },
];

// Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: "u1", name: "Sarah Chen", avatar: "/female-student-1.jpg" },
    problemsSolved: 245,
    examScore: 98,
    streak: 45,
  },
  {
    rank: 2,
    user: { id: "u2", name: "James Wilson", avatar: "/male-student-1.jpg" },
    problemsSolved: 238,
    examScore: 96,
    streak: 32,
  },
  {
    rank: 3,
    user: {
      id: "u3",
      name: "Emily Rodriguez",
      avatar: "/female-student-2.png",
    },
    problemsSolved: 231,
    examScore: 95,
    streak: 28,
  },
  {
    rank: 4,
    user: { id: "u4", name: "Michael Park", avatar: "/male-student-2.png" },
    problemsSolved: 225,
    examScore: 94,
    streak: 21,
  },
  {
    rank: 5,
    user: { id: "u5", name: "Lisa Thompson", avatar: "/female-student-3.png" },
    problemsSolved: 218,
    examScore: 92,
    streak: 19,
  },
  {
    rank: 6,
    user: { id: "u6", name: "David Kim", avatar: "/male-student-3.jpg" },
    problemsSolved: 210,
    examScore: 91,
    streak: 17,
  },
  {
    rank: 7,
    user: { id: "u7", name: "Amanda Foster", avatar: "/female-student-4.jpg" },
    problemsSolved: 198,
    examScore: 89,
    streak: 15,
  },
  {
    rank: 8,
    user: { id: "u8", name: "Chris Martinez", avatar: "/male-student-4.jpg" },
    problemsSolved: 185,
    examScore: 87,
    streak: 12,
  },
  {
    rank: 9,
    user: { id: "u9", name: "Rachel Brown", avatar: "/female-student-5.jpg" },
    problemsSolved: 172,
    examScore: 85,
    streak: 10,
  },
  {
    rank: 10,
    user: { id: "u10", name: "Kevin Lee", avatar: "/male-student-5.jpg" },
    problemsSolved: 160,
    examScore: 83,
    streak: 8,
  },
];

// Performance data for charts
export const mockPerformanceData = [
  { month: "Jan", problemsSolved: 15, examScore: 72 },
  { month: "Feb", problemsSolved: 22, examScore: 78 },
  { month: "Mar", problemsSolved: 28, examScore: 82 },
  { month: "Apr", problemsSolved: 35, examScore: 85 },
  { month: "May", problemsSolved: 42, examScore: 88 },
  { month: "Jun", problemsSolved: 48, examScore: 91 },
];

export const mockDifficultyDistribution = [
  { name: "Easy", value: 45, color: "#22c55e" },
  { name: "Medium", value: 38, color: "#f59e0b" },
  { name: "Hard", value: 17, color: "#ef4444" },
];

export const mockCategoryProgress = [
  { category: "Arrays", solved: 28, total: 40 },
  { category: "Strings", solved: 22, total: 35 },
  { category: "Linked Lists", solved: 15, total: 25 },
  { category: "Trees", solved: 18, total: 30 },
  { category: "Dynamic Programming", solved: 12, total: 35 },
  { category: "Graphs", solved: 10, total: 25 },
];

// Submissions history
export const mockRecentSubmissions: Submission[] = [
  {
    id: "sub-1",
    problemId: "prob-1",
    status: "accepted",
    language: "javascript",
    runtime: "52 ms",
    memory: "42.1 MB",
    timestamp: "2025-06-05T10:30:00Z",
    code: `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) {
              return [map.get(complement), i];
          }
          map.set(nums[i], i);
      }
      return [];
  }`,
  },
  {
    id: "sub-2",
    problemId: "prob-5",
    status: "accepted",
    language: "python",
    runtime: "48 ms",
    memory: "14.2 MB",
    timestamp: "2025-06-05T09:15:00Z",
    code: `class Solution:
      def lengthOfLongestSubstring(self, s: str) -> int:
          char_set = set()
          left = 0
          max_length = 0
          for right in range(len(s)):
              while s[right] in char_set:
                  char_set.remove(s[left])
                  left += 1
              char_set.add(s[right])
              max_length = max(max_length, right - left + 1)
          return max_length`,
  },
  {
    id: "sub-3",
    problemId: "prob-3",
    status: "wrong_answer",
    language: "javascript",
    runtime: "N/A",
    memory: "N/A",
    timestamp: "2025-06-04T16:45:00Z",
    code: `function mergeTwoLists(list1, list2) {
      // Incomplete solution
      return list1;
  }`,
  },
];
