import { type ProblemSeed, rawProblems } from "./raw-problems";

function generateDriverCode(starterCode: string): string {
  // 1. Extract Method Signature
  const methodMatch = starterCode.match(
    /public\s+([\w<>[\]]+)\s+(\w+)\s*\(([^)]*)\)/,
  );

  if (!methodMatch) {
    console.warn("Could not parse method signature from starter code");
    return starterCode; // Fallback
  }

  const [_, returnType, methodName, argsString] = methodMatch;

  const args = argsString.split(",").map((arg) => {
    const parts = arg.trim().split(/\s+/);
    return {
      type: parts.slice(0, -1).join(" "),
      name: parts[parts.length - 1],
    };
  });

  // 2. Generate Input Parsing Logic
  let parsingLogic = `
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        String[] parts = splitArgs(input);
        
        if (parts.length != ${args.length}) {
            // Handle edge case or error, but for now assume valid input
        }
  `;

  const argVars: string[] = [];

  args.forEach((arg, index) => {
    const varName = `arg${index}`;
    argVars.push(varName);

    let parseStmt = "";

    switch (arg.type) {
      case "int":
        parseStmt = `int ${varName} = Integer.parseInt(parts[${index}].trim());`;
        break;
      case "long":
        parseStmt = `long ${varName} = Long.parseLong(parts[${index}].trim());`;
        break;
      case "double":
        parseStmt = `double ${varName} = Double.parseDouble(parts[${index}].trim());`;
        break;
      case "boolean":
        parseStmt = `boolean ${varName} = Boolean.parseBoolean(parts[${index}].trim());`;
        break;
      case "String":
        parseStmt = `String ${varName} = parseString(parts[${index}].trim());`;
        break;
      case "int[]":
        parseStmt = `int[] ${varName} = parseIntArray(parts[${index}].trim());`;
        break;
      case "char[]":
        parseStmt = `char[] ${varName} = parseCharArray(parts[${index}].trim());`;
        break;
      case "char[][]":
        parseStmt = `char[][] ${varName} = parseChar2DArray(parts[${index}].trim());`;
        break;
      case "String[]":
        parseStmt = `String[] ${varName} = parseStringArray(parts[${index}].trim());`;
        break;
      case "List<Integer>":
        parseStmt = `List<Integer> ${varName} = parseIntegerList(parts[${index}].trim());`;
        break;
      case "List<String>":
        parseStmt = `List<String> ${varName} = parseStringList(parts[${index}].trim());`;
        break;
      case "ListNode":
        parseStmt = `ListNode ${varName} = parseListNode(parts[${index}].trim());`;
        break;
      case "TreeNode":
        parseStmt = `TreeNode ${varName} = parseTreeNode(parts[${index}].trim());`;
        break;
      default:
        parseStmt = `// Unsupported type: ${arg.type}`;
    }
    parsingLogic += `        ${parseStmt}\n`;
  });

  // 3. Call Solution
  let callLogic = "";
  if (returnType === "void") {
    callLogic = `        sol.${methodName}(${argVars.join(", ")});
        // For void methods, we usually need to print one of the arguments that was modified in place
        // Heuristic: print the first array/list argument
        printResult(${argVars[0]});`;
    // Note: This is a heuristic. For "moveZeroes", it works. For others, it might not.
    // But looking at the problems (Move Zeroes, Reverse String), they modify the first arg.
  } else {
    callLogic = `        ${returnType} result = sol.${methodName}(${argVars.join(", ")});
        printResult(result);`;
  }

  // 4. Construct Full Class
  const helpers = getHelpers();

  // Handle ListNode and TreeNode definitions if needed
  const _extraClasses = "";
  if (starterCode.includes("class ListNode")) {
    // It's usually in comments, we need to make sure it's available.
    // We will define it in our helpers if it's not already defined in the solution file (which it isn't, usually)
    // But wait, the starterCode has it in comments.
    // We should define it as a static class in Main or a separate class.
    // To avoid conflicts, let's define it.
  }

  // We will append standard definitions for ListNode and TreeNode just in case
  const definitions = `
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
`;

  return `import java.util.*;
import java.util.stream.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        ${parsingLogic}
        ${callLogic}
    }

    ${helpers}
}

${definitions}
`;
}

function getHelpers(): string {
  return `
    private static String[] splitArgs(String input) {
        List<String> args = new ArrayList<>();
        int balance = 0;
        StringBuilder current = new StringBuilder();
        boolean inQuote = false;
        
        for (char c : input.toCharArray()) {
            if (c == '"') {
                inQuote = !inQuote;
                current.append(c);
            } else if (inQuote) {
                current.append(c);
            } else if (c == '[' || c == '{' || c == '(') {
                balance++;
                current.append(c);
            } else if (c == ']' || c == '}' || c == ')') {
                balance--;
                current.append(c);
            } else if (c == ',' && balance == 0) {
                args.add(current.toString().trim());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        args.add(current.toString().trim());
        return args.toArray(new String[0]);
    }

    private static String parseString(String s) {
        if (s.length() >= 2 && s.startsWith("\\"") && s.endsWith("\\"")) {
            return s.substring(1, s.length() - 1);
        }
        return s;
    }

    private static int[] parseIntArray(String s) {
        if (s.equals("[]")) return new int[0];
        s = s.substring(1, s.length() - 1);
        if (s.trim().isEmpty()) return new int[0];
        String[] parts = s.split(",");
        int[] res = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            res[i] = Integer.parseInt(parts[i].trim());
        }
        return res;
    }
    
    private static char[] parseCharArray(String s) {
        // Input format: ["h","e","l","l","o"]
        if (s.equals("[]")) return new char[0];
        s = s.substring(1, s.length() - 1); // Remove outer []
        if (s.trim().isEmpty()) return new char[0];
        
        // Split by comma, but handle quotes
        List<Character> chars = new ArrayList<>();
        for (String part : s.split(",")) {
            String trimmed = part.trim();
            if (trimmed.startsWith("\\"") && trimmed.endsWith("\\"")) {
                chars.add(trimmed.charAt(1));
            }
        }
        char[] res = new char[chars.size()];
        for(int i=0; i<chars.size(); i++) res[i] = chars.get(i);
        return res;
    }

    private static char[][] parseChar2DArray(String s) {
        // Input: [["1","0"],["0","1"]]
        if (s.equals("[]")) return new char[0][0];
        s = s.substring(1, s.length() - 1);
        
        List<char[]> rows = new ArrayList<>();
        int balance = 0;
        StringBuilder current = new StringBuilder();
        
        for (char c : s.toCharArray()) {
            if (c == '[') balance++;
            if (c == ']') balance--;
            
            if (c == ',' && balance == 0) {
                rows.add(parseCharArray(current.toString().trim()));
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        if (current.length() > 0) rows.add(parseCharArray(current.toString().trim()));
        
        return rows.toArray(new char[0][]);
    }

    private static String[] parseStringArray(String s) {
        if (s.equals("[]")) return new String[0];
        s = s.substring(1, s.length() - 1);
        if (s.trim().isEmpty()) return new String[0];
        
        List<String> list = new ArrayList<>();
        boolean inQuote = false;
        StringBuilder current = new StringBuilder();
        for (char c : s.toCharArray()) {
             if (c == '"') {
                inQuote = !inQuote;
                // Don't append quotes to the string content if we want raw strings, 
                // but usually we want the content. 
                // Wait, parseString removes quotes.
                current.append(c);
            } else if (c == ',' && !inQuote) {
                list.add(parseString(current.toString().trim()));
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        list.add(parseString(current.toString().trim()));
        return list.toArray(new String[0]);
    }

    private static List<Integer> parseIntegerList(String s) {
        int[] arr = parseIntArray(s);
        List<Integer> list = new ArrayList<>();
        for (int i : arr) list.add(i);
        return list;
    }

    private static List<String> parseStringList(String s) {
        return Arrays.asList(parseStringArray(s));
    }

    private static ListNode parseListNode(String s) {
        if (s.equals("[]")) return null;
        int[] arr = parseIntArray(s);
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    private static TreeNode parseTreeNode(String s) {
        if (s.equals("[]")) return null;
        s = s.substring(1, s.length() - 1);
        if (s.trim().isEmpty()) return null;
        
        String[] parts = s.split(",");
        if (parts.length == 0) return null;
        
        TreeNode root = new TreeNode(Integer.parseInt(parts[0].trim()));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        int i = 1;
        while (!queue.isEmpty() && i < parts.length) {
            TreeNode curr = queue.poll();
            
            if (i < parts.length && !parts[i].trim().equals("null")) {
                curr.left = new TreeNode(Integer.parseInt(parts[i].trim()));
                queue.add(curr.left);
            }
            i++;
            
            if (i < parts.length && !parts[i].trim().equals("null")) {
                curr.right = new TreeNode(Integer.parseInt(parts[i].trim()));
                queue.add(curr.right);
            }
            i++;
        }
        return root;
    }

    private static void printResult(Object result) {
        if (result == null) {
            System.out.println("null");
        } else if (result instanceof int[]) {
            System.out.println(Arrays.toString((int[]) result));
        } else if (result instanceof char[]) {
             System.out.println(Arrays.toString((char[]) result));
        } else if (result instanceof Object[]) {
             System.out.println(Arrays.deepToString((Object[]) result));
        } else if (result instanceof ListNode) {
            List<Integer> list = new ArrayList<>();
            ListNode curr = (ListNode) result;
            while (curr != null) {
                list.add(curr.val);
                curr = curr.next;
            }
            System.out.println(list.toString().replaceAll(" ", ""));
        } else if (result instanceof List) {
             System.out.println(result.toString().replaceAll(" ", ""));
        } else {
            System.out.println(result);
        }
    }
  `;
}

export const seedData: ProblemSeed[] = rawProblems.map((p) => {
  // Uncomment definitions in starterCode if they exist in comments,
  // so that the Solution class compiles.
  // Actually, we define ListNode/TreeNode in Main.java (the driver code file).
  // But Solution class is in a separate file or same file?
  // In this system, usually Solution and Main are concatenated or in same package.
  // If we put definitions in Main, Solution might not see them if Solution is in a separate file.
  // BUT, the user's starterCode often has:
  // /** Definition for singly-linked list. public class ListNode ... */
  // We should UNCOMMENT this in the starterCode so Solution can use it.

  let starterCode = p.starterCode.java;
  starterCode = starterCode.replace(
    /\/\*\*\s*\n\s*\*\s*Definition for singly-linked list\.\s*\n([\s\S]*?)\*\//,
    "$1",
  );
  starterCode = starterCode.replace(
    /\/\*\*\s*\n\s*\*\s*Definition for a binary tree node\.\s*\n([\s\S]*?)\*\//,
    "$1",
  );

  // Also remove the " * " prefixes in the uncommented block if necessary,
  // but usually the regex above just extracts the block.
  // Actually the regex might be too simple.
  // Let's just append the definitions to the starterCode if they are missing and needed.
  // Or better, let's just rely on the fact that we will inject the definitions in the driver code
  // and if the system compiles them together, it works.

  // However, for the `starterCode` stored in DB, we want it to be clean for the user.
  // The user sees the commented out definition usually.

  return {
    ...p,
    driverCode: {
      java: generateDriverCode(p.starterCode.java),
    },
  };
});
