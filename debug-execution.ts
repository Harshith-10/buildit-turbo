/**
 * Debug test to verify the execution system is working
 * Run with: npx tsx debug-execution.ts
 */

import { executeCode, mapLanguageToTurbo } from "./src/lib/code-executor";

async function testExecution() {
  console.log("🔍 Testing code execution system...\n");
  
  console.log("Environment Variables:");
  console.log(`  USE_LOCAL_EXECUTION: ${process.env.USE_LOCAL_EXECUTION}`);
  console.log(`  TURBO_API_URL: ${process.env.TURBO_API_URL || "http://localhost:3001"}`);
  console.log();

  const testCases = [
    { id: 0, input: "5\n", expected: "10" },
    { id: 1, input: "7\n", expected: "14" },
  ];

  console.log("Testing Python code execution...");
  const result = await executeCode(
    "test_user",
    "python",
    `x = int(input())
print(x * 2)`,
    testCases
  );

  console.log("\n📊 Results:");
  console.log(`  Success: ${result.success}`);
  console.log(`  Passed: ${result.passed}`);
  console.log(`  Total Tests: ${result.totalTests}`);
  console.log(`  Passed Tests: ${result.passedTests}`);
  
  if (result.compilationError) {
    console.log(`  ❌ Compilation Error: ${result.compilationError}`);
  }
  
  if (result.systemError) {
    console.log(`  ❌ System Error: ${result.systemError}`);
  }

  console.log("\n📝 Test Results:");
  for (const test of result.results) {
    const status = test.passed ? "✅" : "❌";
    console.log(`  ${status} Test ${test.id + 1}: ${test.actual_output}`);
    if (test.error) {
      console.log(`     Error: ${test.error}`);
    }
  }

  if (result.success && result.passed) {
    console.log("\n✅ Execution system is working correctly!");
  } else {
    console.log("\n❌ Execution system has issues. Check the errors above.");
  }
}

testExecution().catch(console.error);
