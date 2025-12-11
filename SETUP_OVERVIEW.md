# Setup Scripts & Documentation Overview

This document provides an overview of all setup-related files and how to use them.

## 📁 Setup Files Created

### Automated Setup Scripts

| File | Platform | Description |
|------|----------|-------------|
| `setup.ps1` | Windows (PowerShell) | Automated setup script for Windows users |
| `setup.sh` | Linux/macOS (Bash) | Automated setup script for Unix-based systems |

### Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `QUICKSTART.md` | Fast setup guide | New users who want to get started quickly |
| `SETUP.md` | Detailed manual setup | Users who prefer step-by-step manual setup |
| `CHECKLIST.md` | Verification checklist | All users to verify successful installation |
| `README.md` | Complete project documentation | All users for comprehensive information |
| `.env.example` | Environment variables template | All users for configuration reference |

## 🚀 Quick Usage Guide

### For First-Time Setup

**Windows Users:**
```powershell
# Navigate to project directory
cd buildit-turbo

# Run setup script
.\setup.ps1
```

**Linux/macOS Users:**
```bash
# Navigate to project directory
cd buildit-turbo

# Make script executable (first time only)
chmod +x setup.sh

# Run setup script
./setup.sh
```

### What Each Script Does

#### `setup.ps1` / `setup.sh`

These automated scripts will:

1. ✅ **Check Prerequisites**
   - Verify Node.js installation (v18+)
   - Verify pnpm installation (install if missing)
   - Check PostgreSQL availability

2. ✅ **Install Dependencies**
   - Run `pnpm install`
   - Install all required packages

3. ✅ **Configure Environment**
   - Prompt for database credentials
   - Generate secure authentication secret
   - Create `.env` file with configuration

4. ✅ **Setup Database**
   - Optionally create PostgreSQL database
   - Push schema to database
   - Create all required tables

5. ✅ **Seed Data (Optional)**
   - Populate with sample data
   - Create default user accounts
   - Add sample problems and exams

6. ✅ **Verify Build (Optional)**
   - Test production build
   - Ensure no compilation errors

## 📖 Documentation Guide

### When to Use Each Document

#### QUICKSTART.md
**Use when:** You want to get started immediately

**Contains:**
- Minimal setup steps
- Common troubleshooting
- Quick reference for commands
- Default credentials

**Best for:** Developers who want to run the app ASAP

#### SETUP.md
**Use when:** You need detailed setup instructions

**Contains:**
- Manual step-by-step setup
- Multiple setup methods (manual, Docker)
- Comprehensive troubleshooting
- Security notes
- Database management

**Best for:** 
- Users who prefer manual control
- DevOps/deployment scenarios
- Understanding the full setup process

#### CHECKLIST.md
**Use when:** Verifying installation is complete

**Contains:**
- Pre-setup verification
- Installation checkpoints
- Functionality testing steps
- Success criteria
- Troubleshooting commands

**Best for:**
- After running setup scripts
- Debugging setup issues
- Team onboarding verification

#### README.md
**Use when:** You need complete project information

**Contains:**
- Project overview
- Full feature list
- Architecture details
- Contributing guidelines
- All available commands

**Best for:**
- Understanding the project
- Reference documentation
- Contributing to the project

## 🔄 Setup Workflow

### Recommended Workflow

```
1. Read QUICKSTART.md (5 minutes)
   ↓
2. Run setup.ps1 or setup.sh (5-10 minutes)
   ↓
3. Follow prompts and provide configuration
   ↓
4. Use CHECKLIST.md to verify (5 minutes)
   ↓
5. Start developing! (pnpm dev)
   ↓
6. Refer to README.md as needed
```

### Alternative Manual Workflow

```
1. Read SETUP.md thoroughly
   ↓
2. Install prerequisites manually
   ↓
3. Follow manual setup steps
   ↓
4. Configure .env manually
   ↓
5. Setup database manually
   ↓
6. Use CHECKLIST.md to verify
   ↓
7. Start developing!
```

## 🛠️ Script Features

### Interactive Prompts

Both setup scripts provide interactive prompts for:

- Database host, port, username, password
- Database name
- Application URL
- Whether to create database
- Whether to seed with sample data
- Whether to verify build

### Automatic Features

- ✅ **Dependency Installation**: Auto-installs pnpm if missing
- ✅ **Secret Generation**: Creates cryptographically secure auth secret
- ✅ **Error Handling**: Checks for errors at each step
- ✅ **Color Output**: Uses colors for better readability
- ✅ **Progress Tracking**: Shows step-by-step progress
- ✅ **Validation**: Validates prerequisites before starting

### Safety Features

- ⚠️ **Confirmation Prompts**: Asks before overwriting .env
- ⚠️ **Error Checking**: Stops on critical errors
- ⚠️ **Backup Suggestions**: Warns about data loss operations
- ⚠️ **Version Checks**: Warns about outdated software versions

## 📝 Environment Variables Reference

The `.env.example` file shows all required variables:

```env
DATABASE_URL=postgresql://user:pass@host:port/database
BETTER_AUTH_SECRET=<32+ character random string>
BETTER_AUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Generating Secure Secrets

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL (Unix/Linux/macOS):**
```bash
openssl rand -hex 32
```

**Using PowerShell:**
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.BitConverter]::ToString($bytes) -replace '-', ''
```

## 🎯 Success Indicators

Your setup is successful when:

| Check | Expected Result |
|-------|----------------|
| Scripts complete | ✅ No errors, "Setup Complete!" message |
| Dependencies installed | ✅ `node_modules/` folder exists |
| Environment configured | ✅ `.env` file exists with all variables |
| Database ready | ✅ Can connect with `psql` |
| Schema created | ✅ Tables exist in database |
| App starts | ✅ `pnpm dev` runs without errors |
| Can access app | ✅ http://localhost:3000 loads |
| Can login | ✅ Default credentials work |

## 🔧 Common Commands

### Setup Commands
```bash
# Windows
.\setup.ps1

# Linux/macOS
./setup.sh
```

### Development Commands
```bash
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run linter
pnpm format     # Format code
```

### Database Commands
```bash
pnpm db:push    # Push schema changes
pnpm db:seed    # Seed database
pnpm db:reset   # Reset database
```

## 📊 File Sizes & Contents

| File | Lines | Description |
|------|-------|-------------|
| `setup.ps1` | ~380 | PowerShell setup script with full automation |
| `setup.sh` | ~350 | Bash setup script with full automation |
| `QUICKSTART.md` | ~200 | Quick reference guide |
| `SETUP.md` | ~500 | Comprehensive setup documentation |
| `CHECKLIST.md` | ~300 | Verification and testing checklist |
| `.env.example` | ~20 | Environment template |

## 🆘 Getting Help

If you encounter issues:

1. **Check the documentation:**
   - QUICKSTART.md for quick fixes
   - SETUP.md for detailed troubleshooting
   - CHECKLIST.md for verification steps

2. **Review error messages:**
   - Scripts provide colored output
   - Error messages indicate the problem
   - Follow suggested solutions

3. **Common solutions:**
   - Reinstall dependencies: `rm -rf node_modules && pnpm install`
   - Reset database: `pnpm db:reset && pnpm db:push`
   - Check PostgreSQL: `psql --version` and verify it's running
   - Verify .env file: Check all variables are set

4. **Still stuck?**
   - Review main README.md
   - Check existing GitHub issues
   - Create a new issue with error details

## 🎓 Learning Path

### For Beginners
1. Start with QUICKSTART.md
2. Run automated setup script
3. Use CHECKLIST.md to verify
4. Explore the running application
5. Read README.md for features

### For Experienced Developers
1. Skim QUICKSTART.md
2. Run setup script or manual setup
3. Review project structure in README.md
4. Start customizing and developing

### For DevOps/Deployment
1. Read SETUP.md thoroughly
2. Understand manual setup process
3. Adapt for your environment
4. Review security considerations
5. Set up CI/CD based on scripts

## 🔐 Security Notes

- ✅ Setup scripts generate secure random secrets
- ✅ Passwords are masked during input
- ✅ .env file is git-ignored by default
- ⚠️ Change default user passwords in production
- ⚠️ Use strong database passwords
- ⚠️ Enable SSL for production databases

## 📞 Support Resources

- **Documentation:** All .md files in project root
- **Scripts:** setup.ps1 (Windows) or setup.sh (Unix)
- **GitHub:** Create issues for bugs/questions
- **README:** Comprehensive project information

---

**Ready to start?** Run the setup script for your platform! 🚀

**Windows:** `.\setup.ps1`  
**Linux/macOS:** `./setup.sh`
