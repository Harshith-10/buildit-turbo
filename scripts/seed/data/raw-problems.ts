export type ProblemSeed = {
  serialNumber: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  driverCode: Record<string, string>;
  testCases: { id: number; input: string; expected: string; hidden?: boolean }[];
  tags: string[];
};

export const rawProblems: ProblemSeed[] = [
  {
    serialNumber: 1,
    title: "Pizza Party Distribution",
    difficulty: "easy",
    category: "Math",
    description:
      "Given the number of people, number of pizzas, and slices per pizza, calculate the number of slices each person gets and the number of leftovers. Return an array where index 0 is slices per person and index 1 is leftovers.",
    examples: [
      {
        input: "people = 5, pizzas = 2, slicesPerPizza = 8",
        output: "[3, 1]",
        explanation: "Total 16 slices. 16/5 = 3, 16%5 = 1.",
      },
      {
        input: "people = 4, pizzas = 1, slicesPerPizza = 8",
        output: "[2, 0]",
        explanation: "Total 8 slices. 8/4 = 2, 8%4 = 0.",
      },
      { input: "people = 3, pizzas = 3, slicesPerPizza = 6", output: "[6, 0]" },
    ],
    constraints: ["people > 0", "pizzas > 0", "slicesPerPizza > 0"],
    starterCode: {
      java: `class Solution {
    public int[] pizzaParty(int people, int pizzas, int slicesPerPizza) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "1, 1, 1", expected: "[1, 0]", hidden: false },
      { id: 2, input: "10, 10, 1", expected: "[1, 0]", hidden: false },
      { id: 3, input: "3, 2, 8", expected: "[5, 1]", hidden: false },
      { id: 4, input: "2, 5, 6", expected: "[15, 0]", hidden: false },
      { id: 5, input: "100, 1, 1", expected: "[0, 1]", hidden: false },
      { id: 6, input: "7, 3, 8", expected: "[3, 3]", hidden: true },
      { id: 7, input: "15, 5, 6", expected: "[2, 0]", hidden: true },
      { id: 8, input: "50, 10, 10", expected: "[2, 0]", hidden: true },
      { id: 9, input: "1, 100, 8", expected: "[800, 0]", hidden: true },
      { id: 10, input: "23, 4, 7", expected: "[1, 5]", hidden: true },
    ],
    tags: ["Math", "Basics"],
  },
  {
    serialNumber: 2,
    title: "Numbers to Names",
    difficulty: "easy",
    category: "Control Flow",
    description:
      "Convert a number from 1 to 12 into the corresponding month name. If the number is out of range, return 'Invalid'.",
    examples: [
      { input: "month = 3", output: '"March"' },
      { input: "month = 12", output: '"December"' },
      { input: "month = 13", output: '"Invalid"' },
    ],
    constraints: ["1 <= month <= 100"],
    starterCode: {
      java: `class Solution {
    public String numberToName(int month) {
        // Write your code here
        return "";
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "1", expected: '"January"', hidden: false },
      { id: 2, input: "2", expected: '"February"', hidden: false },
      { id: 3, input: "6", expected: '"June"', hidden: false },
      { id: 4, input: "0", expected: '"Invalid"', hidden: false },
      { id: 5, input: "12", expected: '"December"', hidden: false },
      { id: 6, input: "3", expected: '"March"', hidden: true },
      { id: 7, input: "7", expected: '"July"', hidden: true },
      { id: 8, input: "11", expected: '"November"', hidden: true },
      { id: 9, input: "13", expected: '"Invalid"', hidden: true },
      { id: 10, input: "-1", expected: '"Invalid"', hidden: true },
    ],
    tags: ["Switch Case", "Strings"],
  },
  {
    serialNumber: 3,
    title: "Comparing Numbers",
    difficulty: "easy",
    category: "Logic",
    description:
      "Given three integers, determine the largest number. However, if any two numbers are the same, return -1 to indicate an error state.",
    examples: [
      { input: "a = 1, b = 51, c = 2", output: "51" },
      { input: "a = 10, b = 10, c = 5", output: "-1" },
      { input: "a = 5, b = 4, c = 5", output: "-1" },
    ],
    constraints: ["-10^9 <= a, b, c <= 10^9"],
    starterCode: {
      java: `class Solution {
    public int compareNumbers(int a, int b, int c) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "1, 2, 3", expected: "3", hidden: false },
      { id: 2, input: "100, 50, 25", expected: "100", hidden: false },
      { id: 3, input: "5, 5, 5", expected: "-1", hidden: false },
      { id: 4, input: "1, 2, 2", expected: "-1", hidden: false },
      { id: 5, input: "-10, -5, -20", expected: "-5", hidden: false },
      { id: 6, input: "7, 8, 9", expected: "9", hidden: true },
      { id: 7, input: "15, 15, 10", expected: "-1", hidden: true },
      { id: 8, input: "0, 0, 0", expected: "-1", hidden: true },
      { id: 9, input: "-100, -50, -75", expected: "-50", hidden: true },
      { id: 10, input: "42, 13, 42", expected: "-1", hidden: true },
    ],
    tags: ["Logic", "Conditionals"],
  },
  {
    serialNumber: 4,
    title: "Anagram Checker",
    difficulty: "easy",
    category: "Strings",
    description:
      "Write a function that checks if two provided strings are anagrams of each other.",
    examples: [
      { input: 's1 = "note", s2 = "tone"', output: "true" },
      { input: 's1 = "hello", s2 = "world"', output: "false" },
      { input: 's1 = "listen", s2 = "silent"', output: "true" },
    ],
    constraints: ["Strings consist of lowercase English letters."],
    starterCode: {
      java: `class Solution {
    public boolean isAnagram(String s1, String s2) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"test", "tset"', expected: "true", hidden: false },
      { id: 2, input: '"rat", "car"', expected: "false", hidden: false },
      { id: 3, input: '"anagram", "nagaram"', expected: "true", hidden: false },
      { id: 4, input: '"a", "a"', expected: "true", hidden: false },
      { id: 5, input: '"ab", "a"', expected: "false", hidden: false },
      { id: 6, input: '"listen", "silent"', expected: "true", hidden: true },
      { id: 7, input: '"note", "tone"', expected: "true", hidden: true },
      { id: 8, input: '"abc", "def"', expected: "false", hidden: true },
      { id: 9, input: '"evil", "vile"', expected: "true", hidden: true },
      { id: 10, input: '"apple", "papel"', expected: "true", hidden: true },
    ],
    tags: ["Strings", "Sorting"],
  },
  {
    serialNumber: 5,
    title: "Filtering Evens",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an array of integers, return a new array containing only the even numbers, keeping their original order.",
    examples: [
      { input: "nums = [1, 2, 3, 4, 5, 6]", output: "[2, 4, 6]" },
      { input: "nums = [1, 3, 5]", output: "[]" },
      { input: "nums = [2, 4, 8]", output: "[2, 4, 8]" },
    ],
    constraints: ["Array length <= 1000"],
    starterCode: {
      java: `class Solution {
    public int[] filterEvens(int[] nums) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[10, 11, 12, 13]", expected: "[10, 12]", hidden: false },
      { id: 2, input: "[1, 7, 9]", expected: "[]", hidden: false },
      { id: 3, input: "[0, 2, 4]", expected: "[0, 2, 4]", hidden: false },
      { id: 4, input: "[-2, -1, 0, 1]", expected: "[-2, 0]", hidden: false },
      { id: 5, input: "[]", expected: "[]", hidden: false },
      { id: 6, input: "[2, 4, 6, 8, 10]", expected: "[2, 4, 6, 8, 10]", hidden: true },
      { id: 7, input: "[1, 3, 5, 7, 9]", expected: "[]", hidden: true },
      { id: 8, input: "[100, 200, 300]", expected: "[100, 200, 300]", hidden: true },
      { id: 9, input: "[-10, -5, -2]", expected: "[-10, -2]", hidden: true },
      { id: 10, input: "[0]", expected: "[0]", hidden: true },
    ],
    tags: ["Arrays", "Filtering"],
  },
  {
    serialNumber: 6,
    title: "Computing Statistics",
    difficulty: "easy",
    category: "Math",
    description:
      "Given a list of response times (integers), return an array containing [mean, minimum, maximum]. For the mean, round down to the nearest integer.",
    examples: [
      { input: "times = [100, 200, 1000, 300]", output: "[400, 100, 1000]" },
      { input: "times = [10, 20, 30]", output: "[20, 10, 30]" },
      { input: "times = [5, 5, 5]", output: "[5, 5, 5]" },
    ],
    constraints: ["Array is not empty", "Values are positive"],
    starterCode: {
      java: `class Solution {
    public int[] computeStats(int[] times) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1]", expected: "[1, 1, 1]" },
      { id: 2, input: "[50, 0, 100]", expected: "[50, 0, 100]" },
      { id: 3, input: "[1, 2, 3, 4, 5]", expected: "[3, 1, 5]" },
      { id: 4, input: "[100, 100]", expected: "[100, 100, 100]" },
      { id: 5, input: "[1, 100]", expected: "[50, 1, 100]" },
    ],
    tags: ["Math", "Arrays"],
  },
  {
    serialNumber: 7,
    title: "Word Reverser",
    difficulty: "easy",
    category: "Strings",
    description:
      "Given a sentence string, reverse each word individually while preserving the original word order and whitespace.",
    examples: [
      {
        input: '"Where did the pirate purchase his hook"',
        output: '"erehW did eht etarip esahcrup sih kooh"',
      },
      { input: '"Hello World"', output: '"olleH dlroW"' },
      { input: '"a b c"', output: '"a b c"' },
    ],
    constraints: ["Words are separated by single spaces"],
    starterCode: {
      java: `class Solution {
    public String reverseWords(String sentence) {
        // Write your code here
        return "";
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"Coding is fun"', expected: '"gnidoC si nuf"' },
      { id: 2, input: '"SingleWord"', expected: '"droWelgniS"' },
      { id: 3, input: '"123 456"', expected: '"321 654"' },
      { id: 4, input: '""', expected: '""' },
      { id: 5, input: '"racecar"', expected: '"racecar"' },
    ],
    tags: ["Strings", "Manipulation"],
  },
  {
    serialNumber: 8,
    title: "Score Validator",
    difficulty: "easy",
    category: "Strings",
    description:
      "Given a string containing numbers (0-10) separated by relation signs (<, >, =), check if the entire sequence of relations holds true.",
    examples: [
      { input: '"1<2>1<10=10>2"', output: "true" },
      { input: '"1<1"', output: "false" },
      { input: '"5=5=5"', output: "true" },
    ],
    constraints: ["String follows number-operator-number pattern"],
    starterCode: {
      java: `class Solution {
    public boolean validateScore(String expression) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"10>9>8"', expected: "true" },
      { id: 2, input: '"5<3"', expected: "false" },
      { id: 3, input: '"1=2"', expected: "false" },
      { id: 4, input: '"0<10>0"', expected: "true" },
      { id: 5, input: '"2>1<3"', expected: "true" },
    ],
    tags: ["Parsing", "Logic"],
  },
  {
    serialNumber: 9,
    title: "Comment Extractor",
    difficulty: "easy",
    category: "Lists",
    description:
      "Given a list of strings representing a logbook where every 4th line is a comment (lines 0, 1, 2 are data, line 3 is comment...), return a list containing only the comments.",
    examples: [
      {
        input: '["D1", "D2", "D3", "C1", "D4", "D5", "D6", "C2"]',
        output: '["C1", "C2"]',
      },
      { input: '["A", "B", "C", "Comm1"]', output: '["Comm1"]' },
      { input: '["A", "B"]', output: "[]" },
    ],
    constraints: ["Input list can be empty"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;

class Solution {
    public List<String> extractComments(List<String> logs) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      {
        id: 1,
        input: '["1","2","3","YES","4","5","6","NO"]',
        expected: '["YES", "NO"]',
      },
      { id: 2, input: "[]", expected: "[]" },
      { id: 3, input: '["1","2","3"]', expected: "[]" },
      {
        id: 4,
        input: '["A","B","C","D","E","F","G","H","I"]',
        expected: '["D", "H"]',
      },
      { id: 5, input: '["X","X","X","Comment"]', expected: '["Comment"]' },
    ],
    tags: ["Lists", "Pattern"],
  },
  {
    serialNumber: 10,
    title: "Veggie Cheeser",
    difficulty: "easy",
    category: "Lists",
    description:
      "Given a list of ingredients and a target vegetable, insert the string 'cheese' immediately after every occurrence of that vegetable in the list.",
    examples: [
      {
        input:
          'ingredients = ["tomato", "onion", "lettuce"], target = "tomato"',
        output: '["tomato", "cheese", "onion", "lettuce"]',
      },
      {
        input: 'ingredients = ["bun", "patty"], target = "tomato"',
        output: '["bun", "patty"]',
      },
      {
        input: 'ingredients = ["tomato", "tomato"], target = "tomato"',
        output: '["tomato", "cheese", "tomato", "cheese"]',
      },
    ],
    constraints: ["List is modifiable"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;

class Solution {
    public List<String> addCheese(List<String> ingredients, String vegetable) {
        // Write your code here
        return ingredients;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      {
        id: 1,
        input: '["potato", "rice"], "potato"',
        expected: '["potato", "cheese", "rice"]',
      },
      {
        id: 2,
        input: '["A", "B", "A"], "A"',
        expected: '["A", "cheese", "B", "A", "cheese"]',
      },
      { id: 3, input: '[], "carrot"', expected: "[]" },
      { id: 4, input: '["corn"], "corn"', expected: '["corn", "cheese"]' },
      {
        id: 5,
        input: '["lettuce", "onion"], "tomato"',
        expected: '["lettuce", "onion"]',
      },
    ],
    tags: ["Lists", "Insertion"],
  },

  {
    serialNumber: 11,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    category: "Sliding Window",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: '"abc" length 3' },
      { input: 's = "bbbbb"', output: "1", explanation: '"b" length 1' },
      { input: 's = "pwwkew"', output: "3", explanation: '"wke" length 3' },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    starterCode: {
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '""', expected: "0" },
      { id: 2, input: '" "', expected: "1" },
      { id: 3, input: '"au"', expected: "2" },
      { id: 4, input: '"dvdf"', expected: "3" },
      { id: 5, input: '"abba"', expected: "2" },
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
  },
  {
    serialNumber: 12,
    title: "Container With Most Water",
    difficulty: "medium",
    category: "Two Pointers",
    description:
      "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [
      { input: "[1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "[1,1]", output: "1" },
      { input: "[4,3,2,1,4]", output: "16" },
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5"],
    starterCode: {
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,2,1]", expected: "2" },
      { id: 2, input: "[2,3,4,5,18,17,6]", expected: "17" },
      { id: 3, input: "[1,2,4,3]", expected: "4" },
      { id: 4, input: "[0,2]", expected: "0" },
      { id: 5, input: "[10,9,8,7,6,5,4,3,2,1]", expected: "25" },
    ],
    tags: ["Array", "Two Pointers", "Greedy"],
  },
  {
    serialNumber: 13,
    title: "3Sum",
    difficulty: "medium",
    category: "Two Pointers",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    constraints: ["3 <= nums.length <= 3000"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,-1,-1,0]", expected: "[[-1,0,1]]" },
      { id: 2, input: "[-2,0,1,1,2]", expected: "[[-2,0,2],[-2,1,1]]" },
      { id: 3, input: "[]", expected: "[]" },
      { id: 4, input: "[0]", expected: "[]" },
      { id: 5, input: "[-1,0,1,0]", expected: "[[-1,0,1]]" },
    ],
    tags: ["Array", "Two Pointers", "Sorting"],
  },
  {
    serialNumber: 14,
    title: "Group Anagrams",
    difficulty: "medium",
    category: "Strings",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: ["1 <= strs.length <= 10^4"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      {
        id: 1,
        input: '["cab","tin","pew","duh","may","ill","buy","bar","max","doc"]',
        expected: '[["cab"],["tin"],...]',
      },
      {
        id: 2,
        input: '["bdddddddddd","bbbbbbbbbbc"]',
        expected: '[["bbbbbbbbbbc"],["bdddddddddd"]]',
      },
      {
        id: 3,
        input: '["abc","bca","cba"]',
        expected: '[["abc","bca","cba"]]',
      },
      { id: 4, input: '["a","b","c"]', expected: '[["a"],["b"],["c"]]' },
      { id: 5, input: "[]", expected: "[]" },
    ],
    tags: ["Hash Table", "String", "Sorting"],
  },
  {
    serialNumber: 15,
    title: "Product of Array Except Self",
    difficulty: "medium",
    category: "Arrays",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: ["2 <= nums.length <= 10^5"],
    starterCode: {
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[0,0]", expected: "[0,0]" },
      { id: 2, input: "[1,2]", expected: "[2,1]" },
      { id: 3, input: "[5,10,2]", expected: "[20,10,50]" },
      { id: 4, input: "[1,0,1]", expected: "[0,1,0]" },
      { id: 5, input: "[3,3,3]", expected: "[9,9,9]" },
    ],
    tags: ["Array", "Prefix Sum"],
  },
  {
    serialNumber: 16,
    title: "Top K Frequent Elements",
    difficulty: "medium",
    category: "Heap",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: ["k is in the range [1, the number of unique elements]"],
    starterCode: {
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,2], 2", expected: "[1,2]" },
      { id: 2, input: "[3,0,1,0], 1", expected: "[0]" },
      { id: 3, input: "[1,2,2,3,3,3], 2", expected: "[3,2]" },
      { id: 4, input: "[5,5,5,1,1,2,2,2,2], 1", expected: "[2]" },
      { id: 5, input: "[4,1,-1,2,-1,2,3], 2", expected: "[-1,2]" },
    ],
    tags: ["Array", "Hash Table", "Heap"],
  },
  {
    serialNumber: 17,
    title: "Longest Consecutive Sequence",
    difficulty: "medium",
    category: "Arrays",
    description:
      "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    constraints: ["0 <= nums.length <= 10^5"],
    starterCode: {
      java: `class Solution {
    public int longestConsecutive(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[]", expected: "0" },
      { id: 2, input: "[1]", expected: "1" },
      { id: 3, input: "[1,2,0,1]", expected: "3" },
      { id: 4, input: "[5,4,3,2,1]", expected: "5" },
      { id: 5, input: "[9,1,4,7,3,-1,0,5,8,-1,6]", expected: "7" },
    ],
    tags: ["Array", "Hash Table", "Union Find"],
  },
  {
    serialNumber: 18,
    title: "Valid Sudoku",
    difficulty: "medium",
    category: "Matrix",
    description: "Determine if a 9 x 9 Sudoku board is valid.",
    examples: [
      { input: 'board = [["5","3",".",...]]', output: "true" },
      { input: 'board = [["8","3",".","8"...]]', output: "false" },
    ],
    constraints: ["board.length == 9", "board[i].length == 9"],
    starterCode: {
      java: `class Solution {
    public boolean isValidSudoku(char[][] board) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "valid_full_board", expected: "true" },
      { id: 2, input: "invalid_row_dup", expected: "false" },
      { id: 3, input: "invalid_col_dup", expected: "false" },
      { id: 4, input: "invalid_box_dup", expected: "false" },
      { id: 5, input: "valid_partial_board", expected: "true" },
    ],
    tags: ["Array", "Hash Table", "Matrix"],
  },
  {
    serialNumber: 19,
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    category: "Binary Search",
    description:
      "Given the array nums and an integer target, return the index of target if it is in nums, or -1 if it is not.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
      { input: "nums = [1], target = 0", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 5000"],
    starterCode: {
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,3], 3", expected: "1" },
      { id: 2, input: "[5,1,3], 5", expected: "0" },
      { id: 3, input: "[3,1], 1", expected: "1" },
      { id: 4, input: "[1], 1", expected: "0" },
      { id: 5, input: "[8,9,2,3,4], 9", expected: "1" },
    ],
    tags: ["Array", "Binary Search"],
  },
  {
    serialNumber: 20,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    category: "Binary Search",
    description: "Find the minimum element of this array.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
      { input: "nums = [11,13,15,17]", output: "11" },
    ],
    constraints: ["n == nums.length"],
    starterCode: {
      java: `class Solution {
    public int findMin(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[2,1]", expected: "1" },
      { id: 2, input: "[3,1,2]", expected: "1" },
      { id: 3, input: "[1]", expected: "1" },
      { id: 4, input: "[5,1,2,3,4]", expected: "1" },
      { id: 5, input: "[2,3,4,5,1]", expected: "1" },
    ],
    tags: ["Array", "Binary Search"],
  },

  {
    serialNumber: 21,
    title: "Add Two Numbers",
    difficulty: "medium",
    category: "Linked List",
    description: "Add the two numbers and return the sum as a linked list.",
    examples: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" },
      { input: "l1 = [0], l2 = [0]", output: "[0]" },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
      },
    ],
    constraints: [
      "Number of nodes in each linked list is in the range [1, 100]",
    ],
    starterCode: {
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 * int val;
 * ListNode next;
 * ListNode() {}
 * ListNode(int val) { this.val = val; }
 * ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your code here
        return null;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[5], [5]", expected: "[0,1]" },
      { id: 2, input: "[1,8], [0]", expected: "[1,8]" },
      { id: 3, input: "[1], [9,9]", expected: "[0,0,1]" },
      { id: 4, input: "[9,9,9], [1]", expected: "[0,0,0,1]" },
      { id: 5, input: "[2,4,9], [5,6,4,9]", expected: "[7,0,4,0,1]" },
    ],
    tags: ["Linked List", "Math"],
  },
  {
    serialNumber: 22,
    title: "Remove Nth Node From End of List",
    difficulty: "medium",
    category: "Linked List",
    description:
      "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    examples: [
      { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
      { input: "head = [1], n = 1", output: "[]" },
      { input: "head = [1,2], n = 1", output: "[1]" },
    ],
    constraints: ["1 <= sz <= 30"],
    starterCode: {
      java: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Write your code here
        return null;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,2], 2", expected: "[2]" },
      { id: 2, input: "[1,2,3], 3", expected: "[2,3]" },
      { id: 3, input: "[1,2,3], 1", expected: "[1,2]" },
      { id: 4, input: "[1,2,3,4], 2", expected: "[1,2,4]" },
      { id: 5, input: "[1,2,3,4,5,6], 1", expected: "[1,2,3,4,5]" },
    ],
    tags: ["Linked List", "Two Pointers"],
  },
  {
    serialNumber: 23,
    title: "Daily Temperatures",
    difficulty: "medium",
    category: "Stack",
    description:
      "Return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
    examples: [
      {
        input: "temperatures = [73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]",
      },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" },
      { input: "temperatures = [30,60,90]", output: "[1,1,0]" },
    ],
    constraints: ["1 <= temperatures.length <= 10^5"],
    starterCode: {
      java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[90, 80, 70]", expected: "[0,0,0]" },
      { id: 2, input: "[30, 30, 30]", expected: "[0,0,0]" },
      { id: 3, input: "[70, 71, 72]", expected: "[1,1,0]" },
      { id: 4, input: "[50, 40, 60]", expected: "[2,1,0]" },
      { id: 5, input: "[34, 32, 36, 31, 35]", expected: "[2,1,0,1,0]" },
    ],
    tags: ["Stack", "Array", "Monotonic Stack"],
  },
  {
    serialNumber: 24,
    title: "Generate Parentheses",
    difficulty: "medium",
    category: "Backtracking",
    description:
      "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: [
      {
        input: "n = 3",
        output: '["((()))","(()())","(())()","()(())","()()()"]',
      },
      { input: "n = 1", output: '["()"]' },
    ],
    constraints: ["1 <= n <= 8"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;
class Solution {
    public List<String> generateParenthesis(int n) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "2", expected: '["(())","()()"]' },
      { id: 2, input: "4", expected: '["(((())))",...]' },
      { id: 3, input: "0", expected: "[]" },
      { id: 4, input: "5", expected: "[...]" },
      { id: 5, input: "1", expected: '["()"]' },
    ],
    tags: ["String", "Backtracking", "Dynamic Programming"],
  },
  {
    serialNumber: 25,
    title: "Number of Islands",
    difficulty: "medium",
    category: "Graph",
    description:
      "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    examples: [
      {
        input:
          'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
      },
      {
        input:
          'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
      },
    ],
    constraints: ["m == grid.length", "n == grid[i].length"],
    starterCode: {
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '[["1","0","1"]]', expected: "2" },
      { id: 2, input: '[["1","1","1"]]', expected: "1" },
      { id: 3, input: '[["0","0","0"]]', expected: "0" },
      { id: 4, input: '[["1","0","1","0","1"]]', expected: "3" },
      { id: 5, input: '[["1","1","1","0","1"]]', expected: "2" },
    ],
    tags: ["Array", "DFS", "BFS", "Union Find"],
  },
  {
    serialNumber: 26,
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    category: "Tree",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
      { input: "root = [1]", output: "[[1]]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: ["The number of nodes is in the range [0, 2000]"],
    starterCode: {
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,2,3,4,5]", expected: "[[1],[2,3],[4,5]]" },
      { id: 2, input: "[1,null,2,null,3]", expected: "[[1],[2],[3]]" },
      { id: 3, input: "[1,2,null,3,null,4]", expected: "[[1],[2],[3],[4]]" },
      { id: 4, input: "[1,2,3,4,null,null,5]", expected: "[[1],[2,3],[4,5]]" },
      { id: 5, input: "[]", expected: "[]" },
    ],
    tags: ["Tree", "BFS"],
  },
  {
    serialNumber: 27,
    title: "Validate Binary Search Tree",
    difficulty: "medium",
    category: "Tree",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" },
      { input: "root = [2,2,2]", output: "false" },
    ],
    constraints: ["The number of nodes is in the range [1, 10^4]"],
    starterCode: {
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,1]", expected: "false" },
      { id: 2, input: "[10,5,15,null,null,6,20]", expected: "false" },
      { id: 3, input: "[0]", expected: "true" },
      { id: 4, input: "[3,1,5,0,2,4,6]", expected: "true" },
      { id: 5, input: "[2147483647]", expected: "true" },
    ],
    tags: ["Tree", "DFS", "BST"],
  },
  {
    serialNumber: 28,
    title: "Kth Smallest Element in a BST",
    difficulty: "medium",
    category: "Tree",
    description:
      "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    examples: [
      { input: "root = [3,1,4,null,2], k = 1", output: "1" },
      { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3" },
    ],
    constraints: ["1 <= k <= n <= 10^4"],
    starterCode: {
      java: `class Solution {
    public int kthSmallest(TreeNode root, int k) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[2,1,3], 3", expected: "3" },
      { id: 2, input: "[1,null,2], 2", expected: "2" },
      { id: 3, input: "[5,1,6,null,3], 2", expected: "3" },
      { id: 4, input: "[3,1,4,null,2], 2", expected: "2" },
      { id: 5, input: "[10,5,15], 1", expected: "5" },
    ],
    tags: ["Tree", "DFS", "BST"],
  },
  {
    serialNumber: 29,
    title: "Coin Change",
    difficulty: "medium",
    category: "Dynamic Programming",
    description:
      "Return the fewest number of coins that you need to make up that amount.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
    ],
    constraints: ["1 <= coins.length <= 12"],
    starterCode: {
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[186,419,83,408], 6249", expected: "20" },
      { id: 2, input: "[1,2,5], 100", expected: "20" },
      { id: 3, input: "[2,5,10,1], 27", expected: "4" },
      { id: 4, input: "[1], 1", expected: "1" },
      { id: 5, input: "[1], 2", expected: "2" },
    ],
    tags: ["Array", "DP", "BFS"],
  },
  {
    serialNumber: 30,
    title: "Longest Increasing Subsequence",
    difficulty: "medium",
    category: "Dynamic Programming",
    description:
      "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4" },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
      { input: "nums = [7,7,7,7,7,7,7]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 2500"],
    starterCode: {
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,3,6,7,9,4,10,5,6]", expected: "6" },
      { id: 2, input: "[1,2,3,4,5]", expected: "5" },
      { id: 3, input: "[5,4,3,2,1]", expected: "1" },
      { id: 4, input: "[10,20,10,30,20,50]", expected: "4" },
      { id: 5, input: "[4,10,4,3,8,9]", expected: "3" },
    ],
    tags: ["Array", "DP", "Binary Search"],
  },

  {
    serialNumber: 31,
    title: "Two Sum",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9",
      },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,5,9], 10", expected: "[0,2]" },
      { id: 2, input: "[-3,4,3,90], 0", expected: "[0,2]" },
      { id: 3, input: "[5,75,25], 100", expected: "[1,2]" },
      { id: 4, input: "[2,5,5,11], 10", expected: "[1,2]" },
      { id: 5, input: "[-1,-2,-3,-4,-5], -8", expected: "[2,4]" },
    ],
    tags: ["Array", "Hash Table"],
  },
  {
    serialNumber: 32,
    title: "Palindrome Number",
    difficulty: "easy",
    category: "Math",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation:
          "From left to right, it reads -121. From right to left, it becomes 121-.",
      },
      { input: "x = 10", output: "false" },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: {
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "0", expected: "true" },
      { id: 2, input: "12321", expected: "true" },
      { id: 3, input: "123", expected: "false" },
      { id: 4, input: "-101", expected: "false" },
      { id: 5, input: "1000021", expected: "false" },
    ],
    tags: ["Math"],
  },
  {
    serialNumber: 33,
    title: "Roman to Integer",
    difficulty: "easy",
    category: "Strings",
    description: "Given a roman numeral, convert it to an integer.",
    examples: [
      { input: 's = "III"', output: "3" },
      { input: 's = "LVIII"', output: "58" },
      { input: 's = "MCMXCIV"', output: "1994" },
    ],
    constraints: [
      "1 <= s.length <= 15",
      "s contains only characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')",
    ],
    starterCode: {
      java: `class Solution {
    public int romanToInt(String s) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"IV"', expected: "4" },
      { id: 2, input: '"IX"', expected: "9" },
      { id: 3, input: '"XL"', expected: "40" },
      { id: 4, input: '"XC"', expected: "90" },
      { id: 5, input: '"CD"', expected: "400" },
    ],
    tags: ["Hash Table", "Math", "String"],
  },
  {
    serialNumber: 34,
    title: "Valid Parentheses",
    difficulty: "easy",
    category: "Stack",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
      { input: 's = "([)]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4"],
    starterCode: {
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"()"', expected: "true" },
      { id: 2, input: '"{[]}"', expected: "true" },
      { id: 3, input: '"]"', expected: "false" },
      { id: 4, input: '"["', expected: "false" },
      { id: 5, input: '"((("', expected: "false" },
    ],
    tags: ["String", "Stack"],
  },
  {
    serialNumber: 35,
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    category: "Linked List",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    constraints: ["Number of nodes in both lists is in the range [0, 50]"],
    starterCode: {
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 * int val;
 * ListNode next;
 * ListNode() {}
 * ListNode(int val) { this.val = val; }
 * ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your code here
        return null;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1], [2]", expected: "[1,2]" },
      { id: 2, input: "[5,6], [1,2]", expected: "[1,2,5,6]" },
      { id: 3, input: "[2], [1]", expected: "[1,2]" },
      { id: 4, input: "[1,1,1], [1,1,1]", expected: "[1,1,1,1,1,1]" },
      { id: 5, input: "[-5], [5]", expected: "[-5,5]" },
    ],
    tags: ["Linked List", "Recursion"],
  },
  {
    serialNumber: 36,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the k unique elements.",
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5" },
    ],
    constraints: ["1 <= nums.length <= 3 * 10^4"],
    starterCode: {
      java: `class Solution {
    public int removeDuplicates(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,2,3]", expected: "3" },
      { id: 2, input: "[1,1,1,1]", expected: "1" },
      { id: 3, input: "[-1,0,0,0,3,3]", expected: "3" },
      { id: 4, input: "[10]", expected: "1" },
      { id: 5, input: "[1,2,2,3]", expected: "3" },
    ],
    tags: ["Array", "Two Pointers"],
  },
  {
    serialNumber: 37,
    title: "Search Insert Position",
    difficulty: "easy",
    category: "Binary Search",
    description:
      "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2" },
      { input: "nums = [1,3,5,6], target = 2", output: "1" },
      { input: "nums = [1,3,5,6], target = 7", output: "4" },
    ],
    constraints: ["1 <= nums.length <= 10^4"],
    starterCode: {
      java: `class Solution {
    public int searchInsert(int[] nums, int target) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,3,5,6], 0", expected: "0" },
      { id: 2, input: "[1], 0", expected: "0" },
      { id: 3, input: "[1], 2", expected: "1" },
      { id: 4, input: "[1,2,4,6,7], 3", expected: "2" },
      { id: 5, input: "[-5, -2, 0, 5], -3", expected: "1" },
    ],
    tags: ["Array", "Binary Search"],
  },
  {
    serialNumber: 38,
    title: "Length of Last Word",
    difficulty: "easy",
    category: "Strings",
    description:
      "Given a string s consisting of words and spaces, return the length of the last word in the string.",
    examples: [
      { input: 's = "Hello World"', output: "5" },
      { input: 's = "   fly me   to   the moon  "', output: "4" },
      { input: 's = "luffy is still joyboy"', output: "6" },
    ],
    constraints: ["1 <= s.length <= 10^4"],
    starterCode: {
      java: `class Solution {
    public int lengthOfLastWord(String s) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"a"', expected: "1" },
      { id: 2, input: '"  a  "', expected: "1" },
      { id: 3, input: '"day"', expected: "3" },
      { id: 4, input: '"Hello"', expected: "5" },
      { id: 5, input: '"One Two Three"', expected: "5" },
    ],
    tags: ["String"],
  },
  {
    serialNumber: 39,
    title: "Plus One",
    difficulty: "easy",
    category: "Arrays",
    description:
      "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. Increment the large integer by one and return the resulting array of digits.",
    examples: [
      { input: "digits = [1,2,3]", output: "[1,2,4]" },
      { input: "digits = [4,3,2,1]", output: "[4,3,2,2]" },
      { input: "digits = [9]", output: "[1,0]" },
    ],
    constraints: ["1 <= digits.length <= 100"],
    starterCode: {
      java: `class Solution {
    public int[] plusOne(int[] digits) {
        // Write your code here
        return new int[]{};
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,9]", expected: "[2,0]" },
      { id: 2, input: "[9,9]", expected: "[1,0,0]" },
      { id: 3, input: "[0]", expected: "[1]" },
      { id: 4, input: "[8,9,9]", expected: "[9,0,0]" },
      { id: 5, input: "[1,0,0]", expected: "[1,0,1]" },
    ],
    tags: ["Array", "Math"],
  },
  {
    serialNumber: 40,
    title: "Climbing Stairs",
    difficulty: "easy",
    category: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1, 2" },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "1", expected: "1" },
      { id: 2, input: "4", expected: "5" },
      { id: 3, input: "5", expected: "8" },
      { id: 4, input: "6", expected: "13" },
      { id: 5, input: "10", expected: "89" },
    ],
    tags: ["Math", "Dynamic Programming"],
  },

  {
    serialNumber: 41,
    title: "Valid Palindrome",
    difficulty: "easy",
    category: "Strings",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" },
      { input: 's = " "', output: "true" },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5"],
    starterCode: {
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '"0P"', expected: "false" },
      { id: 2, input: '".,"', expected: "true" },
      { id: 3, input: '"ab_a"', expected: "true" },
      { id: 4, input: '"No lemon, no melon"', expected: "true" },
      { id: 5, input: '"12321"', expected: "true" },
    ],
    tags: ["Two Pointers", "String"],
  },
  {
    serialNumber: 42,
    title: "Single Number",
    difficulty: "easy",
    category: "Bit Manipulation",
    description:
      "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 3 * 10^4"],
    starterCode: {
      java: `class Solution {
    public int singleNumber(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[0,1,0]", expected: "1" },
      { id: 2, input: "[5,1,2,1,2]", expected: "5" },
      { id: 3, input: "[-1,-1,-2]", expected: "-2" },
      { id: 4, input: "[10,20,10]", expected: "20" },
      { id: 5, input: "[1,0,1,0,99]", expected: "99" },
    ],
    tags: ["Bit Manipulation", "Array"],
  },
  {
    serialNumber: 43,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    category: "Arrays",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy day 2 (1), sell day 5 (6)",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No transactions.",
      },
    ],
    constraints: ["1 <= prices.length <= 10^5"],
    starterCode: {
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1,2]", expected: "1" },
      { id: 2, input: "[2,4,1]", expected: "2" },
      { id: 3, input: "[3,2,6,5,0,3]", expected: "4" },
      { id: 4, input: "[2,1,2,0,1]", expected: "1" },
      { id: 5, input: "[1,2,3,4,5]", expected: "4" },
    ],
    tags: ["Array", "Dynamic Programming"],
  },
  {
    serialNumber: 44,
    title: "Missing Number",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 10^4"],
    starterCode: {
      java: `class Solution {
    public int missingNumber(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1]", expected: "0" },
      { id: 2, input: "[0]", expected: "1" },
      { id: 3, input: "[1,2]", expected: "0" },
      { id: 4, input: "[0,2,3]", expected: "1" },
      { id: 5, input: "[1,2,3,4,5,0]", expected: "6" },
    ],
    tags: ["Array", "Hash Table", "Bit Manipulation"],
  },
  {
    serialNumber: 45,
    title: "Move Zeroes",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    constraints: ["1 <= nums.length <= 10^4"],
    starterCode: {
      java: `class Solution {
    public void moveZeroes(int[] nums) {
        // Write your code here
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[0,0,1]", expected: "[1,0,0]" },
      { id: 2, input: "[1,0,1]", expected: "[1,1,0]" },
      {
        id: 3,
        input: "[4,2,4,0,0,3,0,5,1,0]",
        expected: "[4,2,4,3,5,1,0,0,0,0]",
      },
      { id: 4, input: "[1]", expected: "[1]" },
      { id: 5, input: "[1,2,3]", expected: "[1,2,3]" },
    ],
    tags: ["Array", "Two Pointers"],
  },
  {
    serialNumber: 46,
    title: "Reverse String",
    difficulty: "easy",
    category: "Strings",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 <= s.length <= 10^5"],
    starterCode: {
      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your code here
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: '["a"]', expected: '["a"]' },
      { id: 2, input: '["a","b"]', expected: '["b","a"]' },
      { id: 3, input: '["1","2","3"]', expected: '["3","2","1"]' },
      { id: 4, input: '["A"," ","B"]', expected: '["B"," ","A"]' },
      { id: 5, input: '["!"]', expected: '["!"]' },
    ],
    tags: ["Two Pointers", "String"],
  },
  {
    serialNumber: 47,
    title: "Fizz Buzz",
    difficulty: "easy",
    category: "Math",
    description:
      'Given an integer n, return a string array answer (1-indexed) where: answer[i] == "FizzBuzz" if i is divisible by 3 and 5, answer[i] == "Fizz" if i is divisible by 3, answer[i] == "Buzz" if i is divisible by 5, and answer[i] == i (as a string) otherwise.',
    examples: [
      { input: "n = 3", output: '["1","2","Fizz"]' },
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
      { input: "n = 15", output: '[...,"14","FizzBuzz"]' },
    ],
    constraints: ["1 <= n <= 10^4"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;
class Solution {
    public List<String> fizzBuzz(int n) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "1", expected: '["1"]' },
      { id: 2, input: "2", expected: '["1","2"]' },
      { id: 3, input: "6", expected: '["1","2","Fizz","4","Buzz","Fizz"]' },
      { id: 4, input: "10", expected: '[...,"Buzz"]' },
      { id: 5, input: "0", expected: "[]" },
    ],
    tags: ["Math", "String", "Simulation"],
  },
  {
    serialNumber: 48,
    title: "Majority Element",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.",
    examples: [
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 5 * 10^4"],
    starterCode: {
      java: `class Solution {
    public int majorityElement(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1]", expected: "1" },
      { id: 2, input: "[1,1,2]", expected: "1" },
      { id: 3, input: "[6,5,5]", expected: "5" },
      { id: 4, input: "[10,10,20]", expected: "10" },
      { id: 5, input: "[-1,-1,2147483647]", expected: "-1" },
    ],
    tags: ["Array", "Hash Table", "Sorting"],
  },
  {
    serialNumber: 49,
    title: "Contains Duplicate",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
      { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" },
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your code here
        return false;
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1]", expected: "false" },
      { id: 2, input: "[1,1]", expected: "true" },
      { id: 3, input: "[0,1,2,3,4,5,6,0]", expected: "true" },
      { id: 4, input: "[10,20,30]", expected: "false" },
      { id: 5, input: "[-1,-2,-3,-1]", expected: "true" },
    ],
    tags: ["Array", "Hash Table"],
  },
  {
    serialNumber: 50,
    title: "Pascal's Triangle",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an integer numRows, return the first numRows of Pascal's triangle. In Pascal's triangle, each number is the sum of the two numbers directly above it.",
    examples: [
      {
        input: "numRows = 5",
        output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
      },
      { input: "numRows = 1", output: "[[1]]" },
    ],
    constraints: ["1 <= numRows <= 30"],
    starterCode: {
      java: `import java.util.List;
import java.util.ArrayList;
class Solution {
    public List<List<Integer>> generate(int numRows) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
    },
    driverCode: {
      java: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}`,
    },
    testCases: [
      { id: 1, input: "2", expected: "[[1],[1,1]]" },
      { id: 2, input: "3", expected: "[[1],[1,1],[1,2,1]]" },
      { id: 3, input: "4", expected: "[[1],[1,1],[1,2,1],[1,3,3,1]]" },
      { id: 4, input: "6", expected: "[[1],[1,1]...[1,5,10,10,5,1]]" },
      { id: 5, input: "1", expected: "[[1]]" },
    ],
    tags: ["Array", "Dynamic Programming"],
  },
];
