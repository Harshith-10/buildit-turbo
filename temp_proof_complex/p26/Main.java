import java.util.*;
import java.util.stream.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        String[] parts = splitArgs(input);
        
        if (parts.length != 1) {
            // Handle edge case or error, but for now assume valid input
        }
          TreeNode arg0 = parseTreeNode(parts[0].trim());

                List<List<Integer>> result = sol.levelOrder(arg0);
        printResult(result);
    }

    
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
        if (s.length() >= 2 && s.startsWith("\"") && s.endsWith("\"")) {
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
            if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
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
  
}


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
