import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { seedData } from "./seed/data/problems";

const OUT_DIR = "temp_proof_complex";

// Define problems to test and their working solutions
const TEST_SUITE = [
  {
    id: 25, // Number of Islands (Medium) - Tests char[][] and Graph DFS
    name: "Number of Islands",
    solution: `
class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int i, int j) {
        if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] == '0') return;
        grid[i][j] = '0';
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
}
`,
  },
  {
    id: 26, // Binary Tree Level Order Traversal (Medium) - Tests TreeNode and List<List<Integer>>
    name: "Binary Tree Level Order Traversal",
    solution: `
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            res.add(level);
        }
        return res;
    }
}
`,
  },
  {
    id: 21, // Add Two Numbers (Medium) - Tests ListNode
    name: "Add Two Numbers",
    solution: `
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry > 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            curr.next = new ListNode(sum % 10);
            carry = sum / 10;
            curr = curr.next;
        }
        return dummy.next;
    }
}
`,
  },
];

if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR);

console.log("🚀 Starting Complex Problem Verification...\n");

for (const test of TEST_SUITE) {
  const problem = seedData.find((p) => p.serialNumber === test.id);
  if (!problem) {
    console.error(`❌ Problem ${test.id} not found`);
    continue;
  }

  console.log(`Testing Problem ${test.id}: ${test.name}`);

  const problemDir = path.join(OUT_DIR, `p${test.id}`);
  fs.mkdirSync(problemDir);

  // Prepare Main.java
  // Note: We need to remove 'public' from 'public class Solution' in the provided solution
  // if it exists, to allow it in the same file as Main.
  // The solutions above don't have 'public' on the class, so it's fine.

  const fileContent = `${problem.driverCode.java}\n\n${test.solution}`;
  fs.writeFileSync(path.join(problemDir, "Main.java"), fileContent);

  // Compile
  try {
    execSync(`javac ${path.join(problemDir, "Main.java")}`);
  } catch (_e) {
    console.error(`❌ Compilation failed for ${test.name}`);
    continue;
  }

  // Run Test Cases
  let passed = 0;
  for (const tc of problem.testCases) {
    const inputPath = path.join(problemDir, "input.txt");
    fs.writeFileSync(inputPath, tc.input);

    try {
      const output = execSync(`java -cp ${problemDir} Main < ${inputPath}`)
        .toString()
        .trim();
      // Normalize expected output (remove spaces for comparison if needed, but driver code already does some normalization)
      const expected = tc.expected.trim();

      // Simple string comparison might fail if there are minor spacing differences not handled by driver code.
      // But our driver code does `replaceAll(" ", "")` for Lists/Arrays.
      // Let's assume strict equality for now.

      if (output === expected) {
        passed++;
      } else {
        console.log(`❌ Test Case ${tc.id}: Failed`);
        console.log(`   Input:    ${tc.input}`);
        console.log(`   Expected: ${expected}`);
        console.log(`   Actual:   ${output}`);
      }
    } catch (_e) {
      console.log(`❌ Test Case ${tc.id}: Runtime Error`);
    }
  }

  if (passed === problem.testCases.length) {
    console.log(`✅ All ${passed} test cases passed!`);
  } else {
    console.log(`⚠️  ${passed}/${problem.testCases.length} test cases passed.`);
  }
  console.log("--------------------------------------------------");
}

console.log("\nVerification Complete.");
// We are NOT deleting the OUT_DIR or this script as requested.
