/**
 * Test script for Turbo code execution system integration
 * Run with: npx tsx test-turbo-integration.ts
 */

const TURBO_API_URL = process.env.TURBO_API_URL || "http://localhost:3001";

interface TurboTestCase {
  id: number;
  input: string;
  output: string;
}

interface TurboSubmitRequest {
  user_id: string;
  language: string;
  code: string;
  testcases: TurboTestCase[];
}

interface TurboTestResult {
  id: number;
  worker_id: string;
  passed: boolean;
  actual_output: string;
  error: string;
  time: string;
  memory: string;
}

interface TurboSubmitResponse {
  passed: boolean;
  results: TurboTestResult[];
  error: string | null;
}

async function checkHealth(): Promise<boolean> {
  console.log("🔍 Checking Turbo system health...");
  try {
    const response = await fetch(`${TURBO_API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    const text = await response.text();
    const isHealthy = response.ok && text.trim() === "OK";
    
    if (isHealthy) {
      console.log("✅ Turbo system is healthy!\n");
    } else {
      console.log(`❌ Turbo system unhealthy. Response: ${text}\n`);
    }
    
    return isHealthy;
  } catch (error) {
    console.log(`❌ Failed to connect to Turbo system at ${TURBO_API_URL}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
    return false;
  }
}

async function testPythonExecution() {
  console.log("🐍 Testing Python code execution...");
  
  const payload: TurboSubmitRequest = {
    user_id: "test_user_123",
    language: "python",
    code: `x = int(input())
print(x * 2)`,
    testcases: [
      { id: 0, input: "5\n", output: "10" },
      { id: 1, input: "7\n", output: "14" },
      { id: 2, input: "0\n", output: "0" },
    ],
  };

  try {
    console.log("   Sending request to Turbo API...");
    const response = await fetch(`${TURBO_API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ HTTP ${response.status}: ${errorText}\n`);
      return false;
    }

    const data: TurboSubmitResponse = await response.json();
    
    console.log(`   Overall: ${data.passed ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Results:`);
    
    for (const result of data.results) {
      const status = result.passed ? "✅" : "❌";
      console.log(`     ${status} Test ${result.id + 1}: ${result.actual_output} (${result.time})`);
      if (result.error) {
        console.log(`        Error: ${result.error}`);
      }
    }
    
    console.log();
    return data.passed;
  } catch (error) {
    console.log(`   ❌ Request failed: ${error instanceof Error ? error.message : String(error)}\n`);
    return false;
  }
}

async function testJavaExecution() {
  console.log("☕ Testing Java code execution...");
  
  const payload: TurboSubmitRequest = {
    user_id: "test_user_123",
    language: "java",
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(x * 2);
        sc.close();
    }
}`,
    testcases: [
      { id: 0, input: "5\n", output: "10" },
      { id: 1, input: "7\n", output: "14" },
    ],
  };

  try {
    console.log("   Sending request to Turbo API...");
    console.log("   (Java may take longer due to compilation)");
    const response = await fetch(`${TURBO_API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ HTTP ${response.status}: ${errorText}\n`);
      return false;
    }

    const data: TurboSubmitResponse = await response.json();
    
    console.log(`   Overall: ${data.passed ? "✅ PASSED" : "❌ FAILED"}`);
    
    if (data.error) {
      console.log(`   Compilation Error: ${data.error.slice(0, 200)}...\n`);
      return false;
    }
    
    console.log(`   Results:`);
    for (const result of data.results) {
      const status = result.passed ? "✅" : "❌";
      console.log(`     ${status} Test ${result.id + 1}: ${result.actual_output} (${result.time})`);
    }
    
    console.log();
    return data.passed;
  } catch (error) {
    console.log(`   ❌ Request failed: ${error instanceof Error ? error.message : String(error)}\n`);
    return false;
  }
}

async function testCompilationError() {
  console.log("🔥 Testing compilation error handling...");
  
  const payload: TurboSubmitRequest = {
    user_id: "test_user_123",
    language: "python",
    code: `print("Missing closing quote)`,
    testcases: [
      { id: 0, input: "", output: "test" },
    ],
  };

  try {
    console.log("   Sending invalid Python code...");
    const response = await fetch(`${TURBO_API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ HTTP ${response.status}: ${errorText}\n`);
      return false;
    }

    const data: TurboSubmitResponse = await response.json();
    
    if (data.error) {
      console.log(`   ✅ Compilation error detected correctly`);
      console.log(`   Error preview: ${data.error.slice(0, 100)}...\n`);
      return true;
    } else {
      console.log(`   ❌ Should have failed but didn't\n`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Request failed: ${error instanceof Error ? error.message : String(error)}\n`);
    return false;
  }
}

async function testRuntimeError() {
  console.log("💥 Testing runtime error handling...");
  
  const payload: TurboSubmitRequest = {
    user_id: "test_user_123",
    language: "python",
    code: `print(1/0)`,
    testcases: [
      { id: 0, input: "", output: "error" },
    ],
  };

  try {
    console.log("   Sending code with division by zero...");
    const response = await fetch(`${TURBO_API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ HTTP ${response.status}: ${errorText}\n`);
      return false;
    }

    const data: TurboSubmitResponse = await response.json();
    
    if (data.results.length > 0 && data.results[0].error) {
      console.log(`   ✅ Runtime error detected correctly`);
      console.log(`   Error: ${data.results[0].error.slice(0, 100)}...\n`);
      return true;
    } else {
      console.log(`   ❌ Should have caught runtime error\n`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Request failed: ${error instanceof Error ? error.message : String(error)}\n`);
    return false;
  }
}

// Main execution
async function main() {
  console.log("🚀 Turbo Code Execution System - Integration Test\n");
  console.log(`API URL: ${TURBO_API_URL}\n`);
  console.log("=" .repeat(60) + "\n");

  const results = {
    health: false,
    python: false,
    java: false,
    compilationError: false,
    runtimeError: false,
  };

  // Check health first
  results.health = await checkHealth();
  
  if (!results.health) {
    console.log("⚠️  Turbo system is not running or not accessible.");
    console.log("\n📝 To start Turbo system:");
    console.log("   1. Navigate to your Turbo project directory");
    console.log("   2. Run: .\\scripts\\start_cluster.ps1");
    console.log("   3. Wait ~10 seconds for workers to register");
    console.log("   4. Run this test again\n");
    process.exit(1);
  }

  // Run tests
  results.python = await testPythonExecution();
  results.java = await testJavaExecution();
  results.compilationError = await testCompilationError();
  results.runtimeError = await testRuntimeError();

  // Summary
  console.log("=" .repeat(60));
  console.log("📊 Test Summary\n");
  console.log(`   Health Check:        ${results.health ? "✅" : "❌"}`);
  console.log(`   Python Execution:    ${results.python ? "✅" : "❌"}`);
  console.log(`   Java Execution:      ${results.java ? "✅" : "❌"}`);
  console.log(`   Compilation Errors:  ${results.compilationError ? "✅" : "❌"}`);
  console.log(`   Runtime Errors:      ${results.runtimeError ? "✅" : "❌"}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n   Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log("\n🎉 All tests passed! Integration is working correctly.\n");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some tests failed. Check the output above for details.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n💥 Unexpected error:", error);
  process.exit(1);
});
