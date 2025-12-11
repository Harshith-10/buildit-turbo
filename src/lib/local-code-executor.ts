import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

interface TestCase {
  id: number;
  input: string;
  expected: string;
}

interface TestResult {
  id: number;
  worker_id: string;
  passed: boolean;
  actual_output: string;
  error: string;
  time: string;
  memory: string;
}

interface LocalExecutionResult {
  success: boolean;
  passed: boolean;
  totalTests: number;
  passedTests: number;
  results: TestResult[];
  compilationError?: string;
  systemError?: string;
  executionTime?: string;
}

/**
 * Execute Python code locally
 */
async function executePython(
  code: string,
  testCases: TestCase[],
): Promise<LocalExecutionResult> {
  const tempDir = path.join(os.tmpdir(), `py_exec_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const scriptPath = path.join(tempDir, "script.py");
  fs.writeFileSync(scriptPath, code);

  const results: TestResult[] = [];
  let passedTests = 0;

  try {
    for (const testCase of testCases) {
      const startTime = Date.now();
      const inputPath = path.join(tempDir, `input_${testCase.id}.txt`);
      fs.writeFileSync(inputPath, testCase.input);

      try {
        const { stdout, stderr } = await execAsync(
          `python "${scriptPath}" < "${inputPath}"`,
          {
            timeout: 5000,
            maxBuffer: 1024 * 1024,
          },
        );

        const executionTime = Date.now() - startTime;
        const actualOutput = stdout.trim();
        const passed = actualOutput === testCase.expected.trim();

        if (passed) passedTests++;

        results.push({
          id: testCase.id,
          worker_id: "local-python",
          passed,
          actual_output: actualOutput,
          error: stderr || "",
          time: `${executionTime}ms`,
          memory: "0MB",
        });
      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        results.push({
          id: testCase.id,
          worker_id: "local-python",
          passed: false,
          actual_output: "",
          error: error.stderr || error.message || "Execution error",
          time: `${executionTime}ms`,
          memory: "0MB",
        });
      }
    }

    return {
      success: true,
      passed: passedTests === testCases.length,
      totalTests: testCases.length,
      passedTests,
      results,
      executionTime: `${Math.max(...results.map((r) => parseInt(r.time)))}ms`,
    };
  } catch (error: any) {
    return {
      success: false,
      passed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results,
      systemError: error.message,
    };
  } finally {
    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Execute Java code locally
 */
async function executeJava(
  code: string,
  testCases: TestCase[],
): Promise<LocalExecutionResult> {
  const tempDir = path.join(os.tmpdir(), `java_exec_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const javaPath = path.join(tempDir, "Main.java");
  fs.writeFileSync(javaPath, code);

  try {
    // Compilation phase
    const compileStart = Date.now();
    try {
      await execAsync(`javac "${javaPath}"`, {
        cwd: tempDir,
        timeout: 30000,
      });
    } catch (error: any) {
      const compileTime = Date.now() - compileStart;
      return {
        success: true,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        compilationError: error.stderr || error.message || "Compilation failed",
        executionTime: `${compileTime}ms`,
      };
    }

    // Execution phase
    const results: TestResult[] = [];
    let passedTests = 0;

    for (const testCase of testCases) {
      const startTime = Date.now();
      const inputPath = path.join(tempDir, `input_${testCase.id}.txt`);
      fs.writeFileSync(inputPath, testCase.input);

      try {
        const { stdout, stderr } = await execAsync(
          `java -cp "${tempDir}" Main < "${inputPath}"`,
          {
            timeout: 5000,
            maxBuffer: 1024 * 1024,
          },
        );

        const executionTime = Date.now() - startTime;
        const actualOutput = stdout.trim();
        const passed = actualOutput === testCase.expected.trim();

        if (passed) passedTests++;

        results.push({
          id: testCase.id,
          worker_id: "local-java",
          passed,
          actual_output: actualOutput,
          error: stderr || "",
          time: `${executionTime}ms`,
          memory: "0MB",
        });
      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        results.push({
          id: testCase.id,
          worker_id: "local-java",
          passed: false,
          actual_output: "",
          error: error.stderr || error.message || "Runtime error",
          time: `${executionTime}ms`,
          memory: "0MB",
        });
      }
    }

    return {
      success: true,
      passed: passedTests === testCases.length,
      totalTests: testCases.length,
      passedTests,
      results,
      executionTime: `${Math.max(...results.map((r) => parseInt(r.time)))}ms`,
    };
  } catch (error: any) {
    return {
      success: false,
      passed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results: [],
      systemError: error.message,
    };
  } finally {
    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Execute JavaScript/Node.js code locally
 */
async function executeJavaScript(
  code: string,
  testCases: TestCase[],
): Promise<LocalExecutionResult> {
  const tempDir = path.join(os.tmpdir(), `js_exec_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const scriptPath = path.join(tempDir, "script.js");
  fs.writeFileSync(scriptPath, code);

  const results: TestResult[] = [];
  let passedTests = 0;

  try {
    for (const testCase of testCases) {
      const startTime = Date.now();
      const inputPath = path.join(tempDir, `input_${testCase.id}.txt`);
      fs.writeFileSync(inputPath, testCase.input);

      try {
        const { stdout, stderr } = await execAsync(
          `node "${scriptPath}" < "${inputPath}"`,
          {
            timeout: 5000,
            maxBuffer: 1024 * 1024,
          },
        );

        const executionTime = Date.now() - startTime;
        const actualOutput = stdout.trim();
        const passed = actualOutput === testCase.expected.trim();

        if (passed) passedTests++;

        results.push({
          id: testCase.id,
          worker_id: "local-node",
          passed,
          actual_output: actualOutput,
          error: stderr || "",
          time: `${executionTime}ms`,
          memory: "0MB",
        });
      } catch (error: any) {
        const executionTime = Date.now() - startTime;
        results.push({
          id: testCase.id,
          worker_id: "local-node",
          passed: false,
          actual_output: "",
          error: error.stderr || error.message || "Execution error",
          time: `${executionTime}ms`,
          memory: "0MB",
        });
      }
    }

    return {
      success: true,
      passed: passedTests === testCases.length,
      totalTests: testCases.length,
      passedTests,
      results,
      executionTime: `${Math.max(...results.map((r) => parseInt(r.time)))}ms`,
    };
  } catch (error: any) {
    return {
      success: false,
      passed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results,
      systemError: error.message,
    };
  } finally {
    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Main local code execution function
 */
export async function executeCodeLocally(
  userId: string,
  language: string,
  code: string,
  testCases: { id: number; input: string; expected: string }[],
): Promise<LocalExecutionResult> {
  const normalizedLanguage = language.toLowerCase();

  try {
    switch (normalizedLanguage) {
      case "python":
      case "python3":
        return await executePython(code, testCases);

      case "java":
        return await executeJava(code, testCases);

      case "javascript":
      case "js":
      case "node":
        return await executeJavaScript(code, testCases);

      default:
        return {
          success: false,
          passed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          systemError: `Unsupported language: ${language}`,
        };
    }
  } catch (error: any) {
    return {
      success: false,
      passed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results: [],
      systemError: `Execution error: ${error.message}`,
    };
  }
}
