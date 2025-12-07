import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";

export async function seedSubmissions(
  userId: string,
  problemIds: string[],
): Promise<number> {
  console.log("Seeding submissions...");

  if (problemIds.length < 6) {
    console.log("Not enough problems to seed submissions");
    return 0;
  }

  const submissionsData = [
    {
      userId: userId,
      problemId: problemIds[0],
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
      language: "javascript",
      status: "accepted" as const,
      runtime: "52ms",
      memory: "42.1MB",
    },
    {
      userId: userId,
      problemId: problemIds[1],
      code: `function isValid(s) {
  const stack = [];
  const map = { '(': ')', '{': '}', '[': ']' };
  for (const char of s) {
    if (map[char]) {
      stack.push(map[char]);
    } else if (stack.pop() !== char) {
      return false;
    }
  }
  return stack.length === 0;
}`,
      language: "javascript",
      status: "accepted" as const,
      runtime: "48ms",
      memory: "41.8MB",
    },
    {
      userId: userId,
      problemId: problemIds[2],
      code: `function mergeTwoLists(l1, l2) {
  // Incomplete solution
  return l1;
}`,
      language: "javascript",
      status: "wrong_answer" as const,
      runtime: "45ms",
      memory: "40.2MB",
    },
    {
      userId: userId,
      problemId: problemIds[3],
      code: `def addTwoNumbers(l1, l2):
    # Solution with infinite loop
    while True:
        pass`,
      language: "python",
      status: "time_limit" as const,
      runtime: null,
      memory: null,
    },
    {
      userId: userId,
      problemId: problemIds[4],
      code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] arr = null;
        return arr[0]; // NPE
    }
}`,
      language: "java",
      status: "runtime_error" as const,
      runtime: null,
      memory: null,
    },
    {
      userId: userId,
      problemId: problemIds[5],
      code: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Syntax error
        return nums  // missing semicolon
    }
};`,
      language: "c++",
      status: "compilation_error" as const,
      runtime: null,
      memory: null,
    },
  ];

  let count = 0;
  for (const sub of submissionsData) {
    const existing = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.userId, userId),
        eq(submissions.problemId, sub.problemId),
      ),
    });
    if (!existing) {
      console.log(
        `Creating submission for problem ${sub.problemId.slice(0, 8)}...`,
      );
      await db.insert(submissions).values(sub);
      count++;
    }
  }

  return count;
}
