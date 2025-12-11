# Two-Tier Testing System - Documentation

## Overview

The platform now supports a **two-tier testing system** for code execution during exams:

1. **"Run Tests"** - Executes code against **visible sample test cases** (for debugging)
2. **"Submit"** - Executes code against **ALL test cases** (including hidden ones for grading)

This prevents students from reverse-engineering solutions by seeing all test cases while still providing useful feedback during development.

---

## 🎯 How It Works

### Student Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. Student writes code in editor                       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  2. Click "Run Tests" (optional, multiple times)        │
│     → Executes against SAMPLE test cases only           │
│     → Shows detailed results (input/output/errors)      │
│     → NOT saved to database                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  3. Click "Submit" (final submission)                   │
│     → Executes against ALL test cases (sample + hidden) │
│     → Shows only: passed/failed count, compilation err  │
│     → SAVED to database with full results               │
└─────────────────────────────────────────────────────────┘
```

### Test Case Types

#### Sample Test Cases (`hidden: false` or undefined)
- **Visible** to students in problem description
- Used by "Run Tests" button
- Show full details: input, expected output, actual output, errors
- Help students debug their code

#### Hidden Test Cases (`hidden: true`)
- **Not visible** to students
- Only used during "Submit"
- Students only see: "X/Y tests passed"
- Full results stored in database for faculty review

---

## 📋 Database Schema

### `problems.testCases` Structure

```typescript
testCases: [
  {
    id: 0,
    input: "5\n",
    expected: "10",
    hidden: false  // Sample test case (visible)
  },
  {
    id: 1,
    input: "7\n",
    expected: "14",
    hidden: false  // Sample test case (visible)
  },
  {
    id: 2,
    input: "999999\n",
    expected: "1999998",
    hidden: true   // Hidden test case (edge case)
  },
  {
    id: 3,
    input: "-5\n",
    expected: "-10",
    hidden: true   // Hidden test case (negative numbers)
  }
]
```

---

## 🚀 API Actions

### 1. `runExamSampleTests` (Run Tests Button)

**File:** `src/actions/student/run-exam-tests.ts`

**Purpose:** Execute code against sample test cases only for quick feedback

**Parameters:**
- `sessionId`: Current exam session ID
- `problemId`: Problem being solved
- `code`: Student's code
- `language`: Programming language

**Returns:** `ExecutionResult` with detailed test case results

**Behavior:**
- Filters test cases where `hidden !== true`
- Executes against Turbo API
- Returns full results (for display in UI)
- **NOT saved to database**

```typescript
const result = await runExamSampleTests(
  sessionId,
  problemId,
  code,
  "javascript"
);
// result.results contains detailed info for each sample test
```

### 2. `submitExamProblem` (Submit Button)

**File:** `src/actions/student/exam.ts`

**Purpose:** Final submission with full evaluation against all tests

**Parameters:**
- `sessionId`: Current exam session ID
- `problemId`: Problem being solved
- `code`: Student's code
- `language`: Programming language

**Returns:** Limited execution result (hides test details)

**Behavior:**
- Executes against **ALL test cases** (sample + hidden)
- Saves full results to `submissions` table
- Returns only summary: passed/failed count, errors
- **Does NOT return individual test case details** (security)

```typescript
const result = await submitExamProblem(
  sessionId,
  problemId,
  code,
  "javascript"
);
// result.executionResult: { passed, totalTests, passedTests, compilationError, systemError }
// NO individual test case details exposed
```

---

## 🎨 UI Components

### Exam Interface Updates

**File:** `src/app/student/exams/[examId]/take/exam-interface.tsx`

#### New Features:

1. **"Run Tests" Button**
   - Calls `runExamSampleTests()`
   - Shows loading state: "Running..."
   - Displays results in bottom panel

2. **"Submit" Button**
   - Calls `submitExamProblem()`
   - Shows loading state: "Submitting..."
   - Displays toast with summary
   - Clears test results panel

3. **Test Results Panel**
   - Replaces static test cases display
   - Shows `SubmissionResult` component after "Run Tests"
   - Empty state with instructions when no results

### SubmissionResult Component

**File:** `src/components/student/exams/submission-result.tsx`

**Features:**
- Overall pass/fail status badge
- Collapsible test case results
- Compilation error display
- System error handling
- Individual test case details:
  - ✅/❌ Pass/Fail indicator
  - Actual output
  - Error messages (if any)
  - Execution time

---

## 🔒 Security Considerations

### Preventing Test Case Exposure

1. **Sample Tests Only in "Run Tests"**
   - Students can only run non-hidden tests
   - Hidden tests never exposed via this endpoint

2. **Submit Returns Limited Data**
   - Only returns: `passed`, `totalTests`, `passedTests`
   - No individual test case results
   - No hidden test inputs/outputs

3. **Database Stores Everything**
   - Full results saved in `submissions.testCaseResults`
   - Faculty can review all test case results
   - Students cannot access this data

### Example Submission Response (Security)

```typescript
// ✅ What students see after "Submit":
{
  success: true,
  executionResult: {
    passed: false,
    totalTests: 10,
    passedTests: 7,
    compilationError: null,
    systemError: null
    // NO test case details!
  }
}

// ❌ What students DON'T see:
// - Which specific tests failed
// - Input values for hidden tests
// - Expected outputs for hidden tests
```

---

## 📊 Faculty Features

### Viewing Submission Results

Faculty can query the `submissions` table to see full details:

```typescript
const submission = await db.query.submissions.findFirst({
  where: and(
    eq(submissions.userId, studentId),
    eq(submissions.problemId, problemId),
    eq(submissions.examId, examId)
  )
});

// submission.testCaseResults contains ALL test results
// submission.status: "accepted", "wrong_answer", "compilation_error", etc.
// submission.totalTests: 10
// submission.passedTests: 7
```

### Grading Logic

Automatic grading based on `status` field:

| Status | Description | Points |
|--------|-------------|--------|
| `accepted` | All tests passed | Full points |
| `wrong_answer` | Some tests failed | Partial/zero (configurable) |
| `compilation_error` | Code didn't compile | Zero points |
| `runtime_error` | System/execution error | Zero points |

---

## 🧪 Testing Guide

### Creating Test Cases with Hidden Tests

When seeding problems or creating via faculty interface:

```typescript
const problem = {
  title: "Two Sum",
  testCases: [
    // Sample tests (visible to students)
    {
      id: 0,
      input: "[2,7,11,15]\n9",
      expected: "[0,1]",
      hidden: false
    },
    {
      id: 1,
      input: "[3,2,4]\n6",
      expected: "[1,2]",
      hidden: false
    },
    // Hidden tests (only for grading)
    {
      id: 2,
      input: "[1000000000,999999999,2]\n1999999999",
      expected: "[0,1]",
      hidden: true  // Edge case: large numbers
    },
    {
      id: 3,
      input: "[0,0]\n0",
      expected: "[0,1]",
      hidden: true  // Edge case: zeros
    },
    {
      id: 4,
      input: "[-1,-2,-3,-4,-5]\n-8",
      expected: "[2,4]",
      hidden: true  // Edge case: negative numbers
    }
  ]
};
```

### Recommended Test Distribution

For a typical problem:
- **2-3 sample tests**: Cover basic cases, shown in examples
- **5-10 hidden tests**: Edge cases, stress tests, corner cases

**Total: 7-13 test cases per problem**

---

## 🎯 User Experience Flow

### Example Student Session

1. **Read problem**: "Write a function that doubles a number"

2. **See sample tests**:
   - Input: `5`, Output: `10`
   - Input: `7`, Output: `14`

3. **Write initial code**:
   ```javascript
   function solution(x) {
     return x + x; // Correct
   }
   ```

4. **Click "Run Tests"**:
   - ✅ Test 1: Passed (5 → 10)
   - ✅ Test 2: Passed (7 → 14)
   - Toast: "All sample tests passed! (2/2)"

5. **Click "Submit"**:
   - Runs against 10 total tests (2 sample + 8 hidden)
   - Result: 9/10 tests passed
   - Toast: "❌ Wrong Answer (9/10 tests passed)"
   - Student knows something failed but not which hidden test

6. **Debug and resubmit**:
   - Student thinks about edge cases
   - Tests with "Run Tests" again
   - Submits when confident

---

## 🔧 Configuration

### Environment Variables

```bash
# .env
TURBO_API_URL=http://localhost:3001
```

### Language Support

Currently supported languages (update in exam interface as needed):
- JavaScript
- Python
- Java
- Rust

**To add language selection:**
Update `exam-interface.tsx` to use dynamic language from problem schema instead of hardcoded `"javascript"`.

---

## 📈 Performance Considerations

### Run Tests (Sample Only)
- **Faster**: Only 2-3 test cases typically
- **Response time**: 2-5 seconds
- **Can run multiple times**: No database writes
- **Good for rapid iteration**

### Submit (All Tests)
- **Slower**: 10-20 test cases typically
- **Response time**: 10-30 seconds (with 4 workers)
- **Database write**: Saves full results
- **Should be final action**

### Optimization Tips

1. **Keep sample tests simple**: Quick execution for fast feedback
2. **Use hidden tests for complexity**: Large inputs, edge cases
3. **Start more Turbo workers**: 4+ workers for exams with many students
4. **Monitor execution times**: Alert if consistently slow

---

## 🐛 Troubleshooting

### Issue: Students see "No sample test cases available"

**Cause:** Problem has no test cases with `hidden: false`

**Solution:** Ensure at least 2 sample tests are marked as non-hidden

### Issue: "Run Tests" shows all test cases

**Cause:** Test cases don't have `hidden` field set

**Solution:** Update problem test cases to include `hidden: true` for hidden tests

### Issue: Slow "Run Tests" response

**Cause:** Too many sample tests or Turbo system slow

**Solution:** 
- Limit sample tests to 2-3
- Start more Turbo workers
- Check Turbo system health

---

## 🚀 Future Enhancements

- [ ] Language selector in exam interface (instead of hardcoded)
- [ ] Configurable partial credit based on passed test percentage
- [ ] Test case difficulty weighting (harder tests = more points)
- [ ] Custom timeout per test case
- [ ] Memory limit enforcement and display
- [ ] Code similarity detection (plagiarism check)
- [ ] Real-time execution progress updates
- [ ] Test case templates for faculty
- [ ] Bulk test case import/export

---

## 📚 Related Files

### Core Implementation
- `src/actions/student/run-exam-tests.ts` - Run sample tests action
- `src/actions/student/exam.ts` - Submit with all tests
- `src/lib/code-executor.ts` - Turbo API integration
- `src/types/execution.ts` - TypeScript types

### UI Components
- `src/app/student/exams/[examId]/take/exam-interface.tsx` - Main exam UI
- `src/components/student/exams/submission-result.tsx` - Results display

### Database
- `src/db/schema/problems.ts` - Problem schema with hidden field
- `src/db/schema/submissions.ts` - Submission results storage

---

**Last Updated:** December 10, 2025  
**Version:** 2.0 (Two-Tier Testing System)
