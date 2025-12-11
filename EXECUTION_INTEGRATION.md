# Turbo Code Execution Integration - Setup Guide

This guide explains how to set up and use the Turbo code execution system integrated with your assessment platform.

## 🚀 Quick Start

### 1. Setup Environment Variables

Add to your `.env` file:

```bash
TURBO_API_URL=http://localhost:3001
```

### 2. Run Database Migrations

Apply the new schema changes for storing execution results:

```bash
pnpm drizzle-kit push
```

### 3. Start the Turbo Execution System

In a separate terminal, start the Turbo system with leader and workers:

```bash
# Navigate to your Turbo project directory
cd path/to/turbo

# Start using PowerShell script (recommended)
.\scripts\start_cluster.ps1

# OR manually start leader and workers in separate terminals:
.\target\debug\turbo-leader.exe
.\target\debug\turbo-worker.exe  # Start 3-4 workers
```

Wait ~10 seconds for workers to register with the leader.

### 4. Start Your Assessment Platform

```bash
pnpm dev
```

## 📋 Features Implemented

### ✅ Code Execution
- Students submit code during exams
- **Automatic execution** against all test cases using Turbo API
- Supports Java, Python, and Rust
- Parallel test case execution (batches of 5)

### ✅ Real-time Feedback
- Compilation errors displayed immediately
- Test case results (passed/failed)
- Actual output vs expected output
- Runtime per test case
- Overall pass/fail status

### ✅ Database Storage
New fields in `submissions` table:
- `testCaseResults`: Detailed results for each test case
- `totalTests`: Total number of test cases
- `passedTests`: Number of passed test cases
- `compilationError`: Compilation error messages
- `executionError`: System/runtime errors
- `status`: Updated to `accepted`, `wrong_answer`, `compilation_error`, etc.

### ✅ UI Components
- Toast notifications for submission status
- Detailed submission result viewer (ready to integrate)
- Test case collapsible results
- Error highlighting

## 🔧 Integration Points

### Server Action: `submitExamProblem`
Located in `src/actions/student/exam.ts`

**Flow:**
1. Student submits code
2. Fetches problem test cases from database
3. Calls Turbo API via `executeCode()` function
4. Stores execution results in database
5. Returns results to client

### Code Executor Service
Located in `src/lib/code-executor.ts`

**Key Functions:**
- `executeCode()`: Main function to execute code
- `checkTurboHealth()`: Verify Turbo system is running
- `mapLanguageToTurbo()`: Map language names

### TypeScript Types
Located in `src/types/execution.ts`

Defines interfaces for:
- Turbo API request/response
- Execution results
- Test case structure

## 🎨 UI Integration (Optional Enhancement)

The `SubmissionResult` component is ready at:
```
src/components/student/exams/submission-result.tsx
```

**To display full results panel in exam interface:**

1. Fetch submission data after student submits:
```typescript
const submission = await db.query.submissions.findFirst({
  where: and(
    eq(submissions.userId, userId),
    eq(submissions.problemId, problemId),
    eq(submissions.examId, examId)
  )
});
```

2. Pass to component:
```tsx
<SubmissionResult
  passed={submission.status === "accepted"}
  totalTests={submission.totalTests || 0}
  passedTests={submission.passedTests || 0}
  compilationError={submission.compilationError}
  executionError={submission.executionError}
  results={submission.testCaseResults || []}
/>
```

## 🧪 Testing the Integration

### Test Case 1: Simple Python Code
```python
x = int(input())
print(x * 2)
```

**Expected:** Should pass if test cases have matching input/output.

### Test Case 2: Compilation Error (Java)
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello"  // Missing semicolon
    }
}
```

**Expected:** Should show compilation error in results.

### Test Case 3: Runtime Error (Python)
```python
print(1/0)
```

**Expected:** Should show runtime error with stack trace.

## 🔍 Monitoring & Debugging

### Check Turbo System Health
```bash
curl http://localhost:3001/health
# Should return: OK
```

### View Execution Logs
- Turbo leader logs show incoming requests
- Worker logs show execution details
- Check browser console for client-side errors

### Common Issues

**Issue:** "System Error: Failed to fetch"
- **Solution:** Ensure Turbo system is running on port 3001

**Issue:** "No workers available"
- **Solution:** Start at least 1 worker and wait 10 seconds for registration

**Issue:** Slow response times
- **Solution:** Start more workers (4+ recommended for parallel execution)

**Issue:** Docker image errors
- **Solution:** Pre-pull images:
  ```bash
  docker pull python:3.9-slim
  docker pull eclipse-temurin:17-jdk-jammy
  docker pull rust:latest
  ```

## 📊 Database Schema Changes

### New Columns in `submissions` Table

| Column | Type | Description |
|--------|------|-------------|
| `test_case_results` | jsonb | Array of test case results with pass/fail, output, errors |
| `total_tests` | integer | Total number of test cases executed |
| `passed_tests` | integer | Number of test cases that passed |
| `compilation_error` | text | Compilation error message if any |
| `execution_error` | text | System/runtime error message if any |

## 🚦 Language Support

| Language | Identifier | Status |
|----------|-----------|---------|
| Python | `python` | ✅ Supported |
| Java | `java` | ✅ Supported |
| Rust | `rust` | ✅ Supported |

**Note:** Currently, the exam interface uses hardcoded `"javascript"`. Update the language parameter in `exam-interface.tsx` based on your problem's language field.

## 🔐 Security Considerations

### Current Setup (Development)
- No authentication on Turbo API
- Runs on localhost
- No rate limiting

### Production Recommendations
1. Add API authentication (JWT tokens)
2. Implement rate limiting per user
3. Add request validation
4. Use HTTPS for Turbo API
5. Configure Docker security profiles
6. Set resource limits per container

## 📈 Performance Optimization

### Current Configuration
- Batch size: 5 test cases per batch
- Timeout: 60 seconds per job
- Workers: Configurable (start 3-4 for best performance)

### Scaling Tips
- Add more workers for higher concurrency
- Use Redis for caching compilation results
- Implement job queue for overflow
- Monitor Docker resource usage

## 🛠️ Future Enhancements

- [ ] Real execution time measurement (currently returns "0ms")
- [ ] Actual memory usage tracking
- [ ] Custom test case timeouts
- [ ] Streaming results for long-running tests
- [ ] Code quality analysis integration
- [ ] Support for C++, Go, JavaScript
- [ ] Plagiarism detection
- [ ] Performance metrics dashboard

## 📚 API Reference

See `API_DOCUMENTATION.md` for complete Turbo API specifications.

**Key Endpoints:**
- `POST /submit` - Execute code with test cases
- `GET /health` - Check system health

## 💡 Tips

1. **Always start Turbo before testing submissions**
2. **Use 3-4 workers** for optimal parallel execution
3. **Pre-pull Docker images** to avoid first-run delays
4. **Monitor execution times** - 100 test cases ≈ 10-30 seconds
5. **Check logs** if submissions hang or fail unexpectedly

## 🤝 Support

For issues related to:
- **Turbo system**: Check Turbo project logs and documentation
- **Integration**: Review this guide and code comments
- **Database**: Verify migrations applied correctly

---

**Last Updated:** December 10, 2025  
**Integration Version:** 1.0
