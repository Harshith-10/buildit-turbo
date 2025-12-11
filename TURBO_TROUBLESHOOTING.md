# Turbo Integration - Troubleshooting Docker Issue

## Current Status

✅ **Turbo API is running** (health check passed)  
✅ **Leader + 4 workers are active** (processes confirmed)  
❌ **Workers can't execute code** (Docker connection error)

## The Problem

The error message indicates:
```
Create container failed: error trying to connect: 
The system cannot find the file specified. (os error 2)
```

This means the **Turbo workers are trying to use Docker** but can't connect to the Docker daemon.

## Solutions

### Option 1: Start Docker Desktop (Recommended)

According to the API documentation, Turbo uses Docker containers for code execution:
- `python:3.9-slim`
- `eclipse-temurin:17-jdk-jammy`  
- `rust:latest`

**Steps:**
1. Install Docker Desktop for Windows (if not installed)
2. Start Docker Desktop
3. Verify Docker is running:
   ```powershell
   docker ps
   ```
4. Wait for Docker to fully start (~30 seconds)
5. Re-run the integration test:
   ```powershell
   npx tsx test-turbo-integration.ts
   ```

### Option 2: Check if Turbo Has Native Execution Mode

If your Turbo system has a configuration to run code directly as processes (without Docker), you need to:

1. Check Turbo configuration files (likely in your Turbo project directory)
2. Look for settings like:
   - `use_docker: false`
   - `execution_mode: native`
   - Similar configuration options

3. Update the configuration and restart Turbo

**To restart Turbo:**
```powershell
# Kill existing processes
Get-Process | Where-Object { $_.ProcessName -like "*turbo*" } | Stop-Process -Force

# Restart (from Turbo project directory)
.\scripts\start_cluster.ps1
```

### Option 3: Verify Docker Named Pipe

If Docker IS installed and running, the issue might be with the named pipe connection.

**Check Docker status:**
```powershell
docker info
```

If Docker is running but Turbo can't connect, check:
- Docker Desktop settings → "Expose daemon on tcp://localhost:2375 without TLS"
- Or ensure named pipe `//./pipe/docker_engine` is accessible

## What We Know Works

✅ **API Communication**: The integration successfully connects to `http://localhost:3001`  
✅ **Health Endpoint**: `/health` returns "OK"  
✅ **Request Format**: JSON payload is correctly formatted  
✅ **Processes Running**: Leader and workers are active

❌ **Code Execution**: Workers fail when trying to create containers

## Next Steps

1. **Verify your Turbo system requirements**:
   - Does it require Docker?
   - Or does it have a native execution mode?

2. **If Docker is required**:
   - Install and start Docker Desktop
   - Pre-pull required images:
     ```powershell
     docker pull python:3.9-slim
     docker pull eclipse-temurin:17-jdk-jammy
     docker pull rust:latest
     ```

3. **If native execution**:
   - Find and share Turbo configuration
   - We can adjust the integration accordingly

4. **Test again** after addressing Docker

---

**Questions for You:**

1. Was Docker supposed to be running when you mentioned "process in the system"?
2. Do you have Docker Desktop installed?
3. Is there a configuration file in your Turbo project that controls execution mode?

Let me know the answer and I can provide more specific guidance! 🚀
