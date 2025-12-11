# 🎯 BuildIt Turbo - Setup at a Glance

## 🚀 Choose Your Setup Method

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  OPTION 1: AUTOMATED (Recommended) ⚡                       │
│  ═════════════════════════════════                          │
│                                                             │
│  Windows:        │  Linux/macOS:                            │
│  .\setup.ps1     │  chmod +x setup.sh && ./setup.sh        │
│                  │                                          │
│  ✅ Takes 5-10 minutes                                      │
│  ✅ Guides you through everything                           │
│  ✅ Handles errors automatically                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  OPTION 2: MANUAL 🔧                                        │
│  ════════════════                                           │
│                                                             │
│  1. pnpm install                                            │
│  2. Copy .env.example to .env                               │
│  3. Configure .env with your settings                       │
│  4. pnpm db:push                                            │
│  5. pnpm db:seed (optional)                                 │
│  6. pnpm dev                                                │
│                                                             │
│  📖 See SETUP.md for detailed steps                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation Quick Reference

```
┌──────────────────────┬─────────────────────────────────────┐
│ Document             │ Use When...                         │
├──────────────────────┼─────────────────────────────────────┤
│ QUICKSTART.md        │ You want to start in 5 minutes     │
│ SETUP.md             │ You need detailed instructions      │
│ CHECKLIST.md         │ Verifying installation worked       │
│ SETUP_OVERVIEW.md    │ Understanding all setup files       │
│ README.md            │ Learning about the project          │
└──────────────────────┴─────────────────────────────────────┘
```

## ⚙️ What You Need

```
✅ Node.js v18+        Download: https://nodejs.org
✅ PostgreSQL v14+     Download: https://postgresql.org/download
✅ pnpm                (Script will install if missing)
```

## 🎮 After Setup

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Default Login Credentials (if you seeded):                │
│                                                             │
│  👤 Admin:   admin@buildit.com   / password1234            │
│  👤 Faculty: faculty@buildit.com / password1234            │
│  👤 Student: student@buildit.com / password1234            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Start Development Server:
$ pnpm dev

Open Browser:
🌐 http://localhost:3000
```

## 🗺️ Setup Process Flow

```
          START
            │
            ▼
    ┌───────────────┐
    │ Prerequisites │  ← Node.js, pnpm, PostgreSQL
    └───────┬───────┘
            ▼
    ┌───────────────┐
    │ Run Setup     │  ← setup.ps1 or setup.sh
    │ Script        │
    └───────┬───────┘
            ▼
    ┌───────────────┐
    │ Interactive   │  ← Answer prompts
    │ Configuration │
    └───────┬───────┘
            ▼
    ┌───────────────┐
    │ Auto Install  │  ← Dependencies, DB setup
    └───────┬───────┘
            ▼
    ┌───────────────┐
    │ Verify Setup  │  ← Use CHECKLIST.md
    └───────┬───────┘
            ▼
    ┌───────────────┐
    │ Start Coding! │  ← pnpm dev
    └───────────────┘
```

## 🎯 Quick Commands

```bash
# Setup
.\setup.ps1                # Windows setup
./setup.sh                 # Unix/Linux/macOS setup

# Development
pnpm dev                   # Start dev server
pnpm build                 # Build for production
pnpm start                 # Start production server

# Code Quality
pnpm lint                  # Run linter
pnpm format                # Format code

# Database
pnpm db:push               # Update schema
pnpm db:seed               # Add sample data
pnpm db:reset              # Reset database
```

## ❓ Troubleshooting Quick Fixes

```
Problem: "Port 3000 already in use"
Fix:     npx kill-port 3000

Problem: "Cannot connect to database"
Fix:     Check PostgreSQL is running
         Verify DATABASE_URL in .env

Problem: "Module not found"
Fix:     rm -rf node_modules && pnpm install

Problem: "Permission denied" (Unix)
Fix:     chmod +x setup.sh

Problem: Build errors
Fix:     rm -rf .next && pnpm build
```

## 📊 Success Checklist

```
After setup, you should have:

✅ No errors during setup
✅ .env file exists with all variables
✅ node_modules folder exists
✅ Database tables created
✅ pnpm dev starts without errors
✅ http://localhost:3000 loads
✅ Can login with default credentials
```

## 🆘 Need Help?

```
1. Check QUICKSTART.md for common issues
2. Review SETUP.md for detailed troubleshooting  
3. Use CHECKLIST.md to verify each step
4. Check GitHub issues
5. Create new issue with error details
```

## 🎓 Next Steps After Setup

```
1. 🔍 Explore the codebase
   src/app/          - Pages and routes
   src/components/   - UI components
   src/db/schema/    - Database schema

2. 🧪 Try the application
   - Login as different user roles
   - Create/edit problems
   - Take sample exams
   - Explore dashboards

3. 🛠️ Start customizing
   - Modify theme
   - Add features
   - Create custom components
   - Build your own features
```

## 📈 Skill Level Guide

```
┌─────────────┬───────────────────────────────────────┐
│ Beginner    │ Use: Automated setup + QUICKSTART.md │
│             │ Time: ~10 minutes                     │
├─────────────┼───────────────────────────────────────┤
│ Intermediate│ Use: Automated or Manual + SETUP.md  │
│             │ Time: ~15 minutes                     │
├─────────────┼───────────────────────────────────────┤
│ Advanced    │ Use: Manual setup + customization    │
│             │ Time: ~20 minutes                     │
└─────────────┴───────────────────────────────────────┘
```

---

**Ready? Pick your method and get started! 🚀**

**Automated:** `.\setup.ps1` (Windows) or `./setup.sh` (Unix)  
**Manual:** See `SETUP.md`  
**Questions:** Check `QUICKSTART.md`
