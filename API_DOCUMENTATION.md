# Turbo - Code Execution API Documentation

Complete technical specifications for integrating your assessment platform with the Turbo distributed code execution system.

---

## **1. API Endpoint & Authentication**

### **Base URL**
```
http://localhost:3001
```
*Note: Currently runs on port 3001. No authentication is implemented in the current version.*

### **Endpoints**
- **Code Submission**: `POST /submit`
- **Health Check**: `GET /health`

### **Required Headers**
```http
Content-Type: application/json
```

---

## **2. Request Format**

### **HTTP Method & Endpoint**
```
POST /submit
```

### **Request Body Structure**
```json
{
  "user_id": "string",
  "language": "string",
  "code": "string",
  "testcases": [
    {
      "id": 0,
      "input": "string",
      "output": "string"
    }
  ]
}
```

### **Field Descriptions**
- `user_id` (string): Identifier for the user/student submitting code
- `language` (string): Programming language identifier (see supported languages)
- `code` (string): Complete source code to execute
- `testcases` (array): Array of test case objects
  - `id` (integer): Sequential test case identifier (0, 1, 2, ...)
  - `input` (string): Standard input for the test case
  - `output` (string): Expected output for comparison

### **Example cURL Command**
```bash
curl -X POST http://localhost:3001/submit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "student_123",
    "language": "python",
    "code": "x = input()\nprint(int(x) * 2)",
    "testcases": [
      {
        "id": 0,
        "input": "5\n",
        "output": "10"
      },
      {
        "id": 1,
        "input": "7\n",
        "output": "14"
      }
    ]
  }'
```

---

## **3. Response Format**

### **Successful Execution (HTTP 200)**
```json
{
  "passed": true,
  "results": [
    {
      "id": 0,
      "worker_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "passed": true,
      "actual_output": "10",
      "error": "",
      "time": "0ms",
      "memory": "0MB"
    },
    {
      "id": 1,
      "worker_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "passed": true,
      "actual_output": "14",
      "error": "",
      "time": "0ms",
      "memory": "0MB"
    }
  ],
  "error": null
}
```

### **Compilation Error (HTTP 200)**
```json
{
  "passed": false,
  "results": [],
  "error": "Compilation failed: Main.java:5: error: ';' expected\n        return maxArea\n                      ^\n1 error"
}
```

### **Runtime Error Example (HTTP 200)**
```json
{
  "passed": false,
  "results": [
    {
      "id": 0,
      "worker_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "passed": false,
      "actual_output": "",
      "error": "Traceback (most recent call last):\n  File \"script.py\", line 2, in <module>\n    print(1/0)\nZeroDivisionError: division by zero",
      "time": "0ms",
      "memory": "0MB"
    }
  ],
  "error": null
}
```

### **Wrong Answer Example (HTTP 200)**
```json
{
  "passed": false,
  "results": [
    {
      "id": 0,
      "worker_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "passed": false,
      "actual_output": "11",
      "error": "",
      "time": "0ms",
      "memory": "0MB"
    }
  ],
  "error": null
}
```

### **Worker/System Error (HTTP 502 or 500)**
```json
"Compilation worker failed: Failed to send job to worker"
```
or
```json
"Execution error: Create container failed: Error { message: \"No such image: python:3.9-slim\" }"
```

### **Response Fields**
- `passed` (boolean): True if ALL test cases passed
- `results` (array): Individual test case results
  - `id` (integer): Test case ID matching request
  - `worker_id` (string): UUID of worker that executed this test
  - `passed` (boolean): Whether this specific test case passed
  - `actual_output` (string): Program's stdout (trimmed)
  - `error` (string): stderr output if any
  - `time` (string): Placeholder - currently returns "0ms"
  - `memory` (string): Placeholder - currently returns "0MB"
- `error` (string|null): Overall error message (compilation/system errors)

---

## **4. Execution Model**

### **Architecture**
**Synchronous with Parallel Execution**

The system uses a **synchronous HTTP request-response model** with **internal parallelization**:

1. **Single API Call**: Client sends ONE request with ALL test cases
2. **Internal Processing**:
   - Compiled languages (Java, Rust): Compilation phase first
   - Test cases are automatically **chunked into batches of 5**
   - Each batch is dispatched **in parallel** to available workers
   - Workers execute test cases concurrently in Docker containers
3. **Response**: Client receives complete results for ALL test cases in one response

### **Average Response Time**
- **Simple test cases**: 2-5 seconds
- **100 test cases** (LeetCode problem): ~10-30 seconds depending on worker count
- Time includes: compilation + parallel execution + result aggregation

### **Example Timeline**
```
0s:    Client sends request with 100 test cases
0s:    Leader compiles code (if Java/Rust)
2s:    Compilation complete
2s:    Leader chunks into 20 batches (5 tests each)
2s:    All 20 batches dispatched to 4 workers in parallel
12s:   All workers complete execution
12s:   Client receives response with 100 results
```

---

## **5. Multi-Test Case Support**

### **✅ Yes - Single Request with Multiple Test Cases**

**You MUST send all test cases in ONE request.**

The system automatically handles parallelization:

```json
{
  "user_id": "student_123",
  "language": "java",
  "code": "...",
  "testcases": [
    { "id": 0, "input": "...", "output": "..." },
    { "id": 1, "input": "...", "output": "..." },
    { "id": 2, "input": "...", "output": "..." },
    // ... up to hundreds of test cases
    { "id": 99, "input": "...", "output": "..." }
  ]
}
```

### **Batching Strategy**
- Test cases are automatically **chunked into batches of 5**
- Each batch is sent to a worker using **round-robin load balancing**
- Multiple batches execute **in parallel** across available workers

### **Benefits**
- Single API call = single compilation (for compiled languages)
- Automatic load distribution across workers
- Parallel execution for faster results

---

## **6. Supported Languages**

| Language | Identifier | Version/Image | Compilation Required |
|----------|-----------|---------------|---------------------|
| **Java** | `"java"` | Eclipse Temurin 17 JDK (`eclipse-temurin:17-jdk-jammy`) | Yes - produces `.jar` |
| **Rust** | `"rust"` | Rust Latest (`rust:latest`) | Yes - produces binary |
| **Python** | `"python"` | Python 3.9 (`python:3.9-slim`) | No - interpreted |

### **Language-Specific Requirements**

#### **Java**
- Main class MUST be named `Main`
- File is automatically named `Main.java`
- Compiled to `Main.jar`
- Executed with: `java -cp Main.jar Main`

**Example:**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        System.out.println(x * 2);
    }
}
```

#### **Rust**
- File is automatically named `main.rs`
- Compiled to `main` binary
- Standard input/output via `std::io`

**Example:**
```rust
use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let x: i32 = input.trim().parse().unwrap();
    println!("{}", x * 2);
}
```

#### **Python**
- File is automatically named `script.py`
- No compilation required
- Standard `input()` and `print()`

**Example:**
```python
x = int(input())
print(x * 2)
```

---

## **7. Limits & Constraints**

### **Current Implementation**
⚠️ **Note**: The current version has basic limits. These should be enhanced for production:

| Limit Type | Current Value | Notes |
|-----------|---------------|-------|
| **Execution Timeout** | 60 seconds per job | Hardcoded in job creation |
| **Maximum Code Size** | No explicit limit | Limited by HTTP payload size (~10MB typical) |
| **Rate Limits** | None implemented | No throttling currently |
| **Concurrent Requests** | Unlimited | Bound by worker availability |
| **Memory Limit** | Docker default (~unlimited on host) | Not explicitly constrained |
| **Test Cases per Request** | No limit | All sent in single request |
| **Batch Size** | 5 tests per batch | Hardcoded chunking |

### **Practical Limits**
- **Workers**: Response time scales with number of workers
- **Test Cases**: 100 test cases = ~20 batches → best with 4+ workers
- **Docker Images**: Must be pulled on first use (one-time delay)

### **Recommended Production Enhancements**
```rust
// Add to request validation:
- Max code size: 100KB
- Max test cases: 1000 per request
- Rate limiting: 10 requests/minute per user
- Execution timeout: 5-30 seconds per test
- Memory limit: 512MB per container
```

---

## **8. Error Handling**

### **HTTP Status Codes**

| Status Code | Meaning | Example Scenario |
|-------------|---------|------------------|
| **200 OK** | Request processed | Includes compilation errors, wrong answers |
| **500 Internal Server Error** | Worker processing error | Unexpected worker response format |
| **502 Bad Gateway** | Worker communication failure | Worker unreachable, network error |

### **Error Response Formats**

#### **Type 1: Compilation Error (HTTP 200)**
```json
{
  "passed": false,
  "results": [],
  "error": "Compilation failed: <compiler output>"
}
```

#### **Type 2: Worker Error (HTTP 502)**
```
"Compilation worker failed: <error message>"
```
or
```
"Execution worker failed: <error message>"
```

#### **Type 3: Internal Error (HTTP 500)**
```
"Compilation worker error: <internal error>"
```
or
```
"Unexpected worker response"
```

### **Common Error Scenarios**

| Error | Response | How to Detect |
|-------|----------|---------------|
| **No Workers Available** | HTTP 502: `"No workers available"` | Check before submission |
| **Compilation Syntax Error** | HTTP 200: `error: "Compilation failed: ..."` | Check `passed: false` and `error` field |
| **Runtime Error** | HTTP 200: Result with `error` field populated | Check individual `results[i].error` |
| **Wrong Answer** | HTTP 200: `results[i].passed: false` | Compare `actual_output` vs expected |
| **Docker Image Missing** | HTTP 502/500: `"No such image"` | Ensure Docker images are pulled |
| **Timeout** | Worker may not respond | Request timeout (60s+) |

### **Error Detection Logic**
```python
response = requests.post(url, json=payload, timeout=120)

if response.status_code == 200:
    data = response.json()
    
    if data['error']:
        print(f"Compilation Error: {data['error']}")
    elif not data['passed']:
        # Check individual test failures
        for result in data['results']:
            if not result['passed']:
                if result['error']:
                    print(f"Runtime Error on TC {result['id']}: {result['error']}")
                else:
                    print(f"Wrong Answer on TC {result['id']}")
    else:
        print("All tests passed!")
        
elif response.status_code >= 500:
    print(f"System Error: {response.text}")
```

---

## **9. Integration Example (Python)**

```python
import requests
import json

def execute_code(user_id, language, code, testcases):
    """
    Execute code on Turbo system.
    
    Args:
        user_id: Student/user identifier
        language: "java", "rust", or "python"
        code: Source code as string
        testcases: List of dicts with 'id', 'input', 'output'
    
    Returns:
        dict: Execution results
    """
    payload = {
        "user_id": user_id,
        "language": language,
        "code": code,
        "testcases": testcases
    }
    
    try:
        response = requests.post(
            "http://localhost:3001/submit",
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            return {
                "success": True,
                "data": response.json()
            }
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: {response.text}"
            }
    except requests.Timeout:
        return {
            "success": False,
            "error": "Request timeout (>120s)"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Example usage
testcases = [
    {"id": 0, "input": "5\n", "output": "10"},
    {"id": 1, "input": "7\n", "output": "14"},
    {"id": 2, "input": "0\n", "output": "0"}
]

code = """
x = int(input())
print(x * 2)
"""

result = execute_code("student_123", "python", code, testcases)

if result["success"]:
    data = result["data"]
    print(f"Overall: {'✅ PASSED' if data['passed'] else '❌ FAILED'}")
    
    if data['error']:
        print(f"Compilation Error: {data['error']}")
    else:
        for tc in data['results']:
            status = "✅" if tc['passed'] else "❌"
            print(f"{status} Test {tc['id']}: {tc['actual_output']}")
            if tc['error']:
                print(f"   Error: {tc['error']}")
else:
    print(f"Request Failed: {result['error']}")
```

---

## **10. Setup & Deployment**

### **Starting the System**

#### **Option 1: PowerShell Script (Recommended)**
```powershell
.\scripts\start_cluster.ps1
```

#### **Option 2: Manual Start**
```powershell
# Build the project
cargo build

# Terminal 1 - Start Leader
.\target\debug\turbo-leader.exe

# Terminals 2-5 - Start Workers (one per terminal)
.\target\debug\turbo-worker.exe
.\target\debug\turbo-worker.exe
.\target\debug\turbo-worker.exe
.\target\debug\turbo-worker.exe
```

### **Prerequisites**
- **Docker Desktop**: Running with daemon accessible
- **Rust**: 1.70+ installed with Cargo
- **Docker Images**: Will auto-pull on first use:
  - `eclipse-temurin:17-jdk-jammy`
  - `rust:latest`
  - `python:3.9-slim`

### **Pre-pulling Docker Images (Optional)**
```powershell
docker pull eclipse-temurin:17-jdk-jammy
docker pull rust:latest
docker pull python:3.9-slim
```

### **Verifying System Health**
```powershell
# Check if leader is running
curl http://localhost:3001/health

# Should return: OK
```

---

## **11. Quick Start Example**

### **Step 1: Start the System**
```powershell
.\scripts\start_cluster.ps1
```

Wait ~10 seconds for workers to register.

### **Step 2: Submit a Test Request**
```powershell
# Create test.json
@"
{
  "user_id": "test_user",
  "language": "python",
  "code": "x = int(input())\nprint(x * 2)",
  "testcases": [
    {"id": 0, "input": "5\n", "output": "10"},
    {"id": 1, "input": "7\n", "output": "14"}
  ]
}
"@ | Out-File -Encoding utf8 test.json

# Submit request
curl -X POST http://localhost:3001/submit `
  -H "Content-Type: application/json" `
  -d "@test.json"
```

### **Step 3: Expected Response**
```json
{
  "passed": true,
  "results": [
    {
      "id": 0,
      "worker_id": "...",
      "passed": true,
      "actual_output": "10",
      "error": "",
      "time": "0ms",
      "memory": "0MB"
    },
    {
      "id": 1,
      "worker_id": "...",
      "passed": true,
      "actual_output": "14",
      "error": "",
      "time": "0ms",
      "memory": "0MB"
    }
  ],
  "error": null
}
```

---

## **12. Architecture Overview**

```
┌─────────────────┐
│  Assessment     │
│  Platform       │
└────────┬────────┘
         │ POST /submit
         ▼
┌─────────────────┐
│  Leader         │
│  (Port 3001)    │
│  - API Server   │
│  - Job Scheduler│
└────────┬────────┘
         │ Round-Robin
         ▼
┌──────────────────────────────────┐
│  Worker Pool                     │
│  ┌────────┐ ┌────────┐ ┌────────┤
│  │Worker 1│ │Worker 2│ │Worker 3│
│  └───┬────┘ └───┬────┘ └───┬────┤
│      │          │          │     │
│      ▼          ▼          ▼     │
│  ┌──────────────────────────┐   │
│  │   Docker Containers      │   │
│  │   - Isolated Execution   │   │
│  │   - Language Runtimes    │   │
│  └──────────────────────────┘   │
└──────────────────────────────────┘
```

### **Workflow**
1. Assessment platform sends code + test cases
2. Leader receives request, compiles if needed
3. Test cases chunked into batches of 5
4. Batches distributed to workers (round-robin)
5. Workers execute in parallel Docker containers
6. Results aggregated and returned

---

## **13. Production Considerations**

### **Security**
- [ ] Add API authentication (JWT tokens, API keys)
- [ ] Implement rate limiting per user
- [ ] Add input validation and sanitization
- [ ] Configure Docker security profiles
- [ ] Network isolation for containers
- [ ] Resource quotas per user/request

### **Performance**
- [ ] Add response caching for identical submissions
- [ ] Implement job queue for overflow
- [ ] Worker auto-scaling based on load
- [ ] Connection pooling
- [ ] Metrics and monitoring

### **Reliability**
- [ ] Worker health checks and automatic removal
- [ ] Job retry logic for failed workers
- [ ] Request timeout handling
- [ ] Graceful degradation
- [ ] Logging and error tracking

### **Features**
- [ ] Actual execution time measurement
- [ ] Memory usage tracking
- [ ] Support for more languages (C++, Go, JavaScript)
- [ ] Custom test case timeouts
- [ ] Streaming results for long-running tests
- [ ] Code quality analysis integration

---

## **14. Troubleshooting**

### **Issue: "No workers available"**
**Solution**: Wait 5-10 seconds after starting workers for heartbeat registration.

### **Issue: "No such image" error**
**Solution**: Pull Docker images manually:
```powershell
docker pull python:3.9-slim
```

### **Issue: Slow response times**
**Solution**: 
- Start more workers (4+ recommended)
- Ensure Docker has sufficient resources
- Pre-pull Docker images

### **Issue: Workers not registering**
**Solution**:
- Check firewall allows UDP port 8081
- Verify leader is running before workers
- Check leader logs for heartbeat messages

---

## **15. Contact & Support**

For questions or issues with the Turbo code execution system:
- Repository: https://github.com/Harshith-10/turbo
- Documentation: See README.md for architecture details
- Test Scripts: See `scripts/` directory for examples

---

**Last Updated**: December 10, 2025  
**API Version**: 1.0  
**Compatibility**: Rust 1.70+, Docker 20.10+
