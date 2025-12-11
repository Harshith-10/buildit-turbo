/**
 * Test local code execution without Turbo system
 * Run with: npx tsx test-local-execution.ts
 */

import { executeCodeLocally } from "./src/lib/local-code-executor";

async function testPython() {
  console.log("🐍 Testing Python execution...");
  
  const result = await executeCodeLocally(
    "test_user",
    "python",
    `x = int(input())
print(x * 2)`,
    [
      { id: 0, input: "5\n", expected: "10" },
      { id: 1, input: "7\n", expected: "14" },
      { id: 2, input: "0\n", expected: "0" },
    ]
  );

  console.log(`   Overall: ${result.passed ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`   Tests: ${result.passedTests}/${result.totalTests}`);
  
  for (const test of result.results) {
    const status = test.passed ? "✅" : "❌";
    console.log(`     ${status} Test ${test.id + 1}: ${test.actual_output} (${test.time})`);
    if (test.error) console.log(`        Error: ${test.error}`);
  }
  console.log();
  return result.passed;
}

async function testJava() {
  console.log("☕ Testing Java execution...");
  
  const result = await executeCodeLocally(
    "test_user",
    "java",
    `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(x * 2);
        sc.close();
    }
}`,
    [
      { id: 0, input: "5\n", expected: "10" },
      { id: 1, input: "7\n", expected: "14" },
    ]
  );

  console.log(`   Overall: ${result.passed ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`   Tests: ${result.passedTests}/${result.totalTests}`);
  
  if (result.compilationError) {
    console.log(`   ❌ Compilation Error: ${result.compilationError.slice(0, 100)}...`);
  }
  
  for (const test of result.results) {
    const status = test.passed ? "✅" : "❌";
    console.log(`     ${status} Test ${test.id + 1}: ${test.actual_output} (${test.time})`);
    if (test.error) console.log(`        Error: ${test.error}`);
  }
  console.log();
  return result.passed;
}

async function testJavaScript() {
  console.log("📜 Testing JavaScript/Node.js execution...");
  
  const result = await executeCodeLocally(
    "test_user",
    "javascript",
    `const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const x = parseInt(line);
  console.log(x * 2);
  rl.close();
});`,
    [
      { id: 0, input: "5\n", expected: "10" },
      { id: 1, input: "7\n", expected: "14" },
    ]
  );

  console.log(`   Overall: ${result.passed ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`   Tests: ${result.passedTests}/${result.totalTests}`);
  
  for (const test of result.results) {
    const status = test.passed ? "✅" : "❌";
    console.log(`     ${status} Test ${test.id + 1}: ${test.actual_output} (${test.time})`);
    if (test.error) console.log(`        Error: ${test.error}`);
  }
  console.log();
  return result.passed;
}

async function testCompilationError() {
  console.log("🔥 Testing compilation error handling (Java)...");
  
  const result = await executeCodeLocally(
    "test_user",
    "java",
    `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello"  // Missing semicolon and closing brace
    }
}`,
    [{ id: 0, input: "", expected: "Hello" }]
  );

  if (result.compilationError) {
    console.log(`   ✅ Compilation error detected correctly`);
    console.log(`   Error: ${result.compilationError.slice(0, 100)}...`);
  } else {
    console.log(`   ❌ Should have failed compilation`);
  }
  console.log();
  return !!result.compilationError;
}

async function testRuntimeError() {
  console.log("💥 Testing runtime error handling (Python)...");
  
  const result = await executeCodeLocally(
    "test_user",
    "python",
    `print(1/0)`,
    [{ id: 0, input: "", expected: "error" }]
  );

  if (result.results[0]?.error) {
    console.log(`   ✅ Runtime error detected correctly`);
    console.log(`   Error: ${result.results[0].error.slice(0, 100)}...`);
  } else {
    console.log(`   ❌ Should have caught runtime error`);
  }
  console.log();
  return !!result.results[0]?.error;
}

async function main() {
  console.log("🚀 Local Code Execution - Test Suite\n");
  console.log("=" .repeat(60) + "\n");

  const results = {
    python: false,
    java: false,
    javascript: false,
    compilationError: false,
    runtimeError: false,
  };

  results.python = await testPython();
  results.java = await testJava();
  results.javascript = await testJavaScript();
  results.compilationError = await testCompilationError();
  results.runtimeError = await testRuntimeError();

  console.log("=" .repeat(60));
  console.log("📊 Test Summary\n");
  console.log(`   Python Execution:     ${results.python ? "✅" : "❌"}`);
  console.log(`   Java Execution:       ${results.java ? "✅" : "❌"}`);
  console.log(`   JavaScript Execution: ${results.javascript ? "✅" : "❌"}`);
  console.log(`   Compilation Errors:   ${results.compilationError ? "✅" : "❌"}`);
  console.log(`   Runtime Errors:       ${results.runtimeError ? "✅" : "❌"}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n   Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log("\n🎉 All tests passed! Local execution is working.\n");
    console.log("✨ To use local execution in your app:");
    console.log("   Add to .env: USE_LOCAL_EXECUTION=true\n");
  } else {
    console.log("\n⚠️  Some tests failed.");
    console.log("\n📝 Requirements:");
    console.log("   - Python 3.x installed and in PATH");
    console.log("   - Java JDK installed and in PATH");
    console.log("   - Node.js installed (already available)\n");
  }
}

main();
