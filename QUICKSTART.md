# Quick Start Guide - BuildIt Turbo

Get up and running with BuildIt Turbo in just a few minutes!

## ⚡ Fastest Way to Get Started

### For Windows Users

1. **Open PowerShell** in the project directory
2. **Run the setup script:**
   ```powershell
   .\setup.ps1
   ```
3. **Follow the prompts** - the script will handle everything
4. **Start coding!**
   ```powershell
   pnpm dev
   ```

### For Linux/macOS Users

1. **Open Terminal** in the project directory
2. **Make script executable and run:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. **Follow the prompts** - the script will handle everything
4. **Start coding!**
   ```bash
   pnpm dev
   ```

## 📝 What You'll Need

Before running the setup script, make sure you have:

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14+) - [Download](https://www.postgresql.org/download/)

The script will automatically install **pnpm** if you don't have it.

## 🎯 What the Setup Script Does

The automated setup will:

1. ✅ Verify Node.js, pnpm, and PostgreSQL are installed
2. ✅ Install all project dependencies
3. ✅ Help you configure environment variables
4. ✅ Create the database
5. ✅ Set up database tables
6. ✅ Optionally seed with sample data
7. ✅ Optionally verify the build

## 🎮 After Setup

Once setup is complete, you'll have:

### Default User Accounts (if you chose to seed)

| Role    | Email               | Password      |
|---------|---------------------|---------------|
| Admin   | admin@buildit.com   | password1234  |
| Faculty | faculty@buildit.com | password1234  |
| Student | student@buildit.com | password1234  |

### Available Commands

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run linter
pnpm format     # Format code
```

### Access the Application

Open your browser and go to: **http://localhost:3000**

## 🔧 Common Issues & Solutions

### "PostgreSQL is not installed"

**Solution:** Download and install PostgreSQL from https://www.postgresql.org/download/

Make sure to remember your PostgreSQL password during installation.

### "Permission denied" (Linux/macOS)

**Solution:** Make the script executable:
```bash
chmod +x setup.sh
```

### "Port 3000 is already in use"

**Solution:** Kill the process using port 3000:
```bash
npx kill-port 3000
```

### Database Connection Error

**Solution:** Check your DATABASE_URL in `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/buildit_turbo
```

Make sure:
- PostgreSQL is running
- Username and password are correct
- Database exists

### Module Not Found

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules
pnpm install
```

## 📚 Next Steps

1. **Explore the Codebase:**
   - `src/app/` - Pages and routes
   - `src/components/` - Reusable components
   - `src/db/schema/` - Database schema

2. **Try Different User Roles:**
   - Login as admin to access admin panel
   - Login as faculty to create exams
   - Login as student to take exams

3. **Customize:**
   - Modify theme in `src/app/globals.css`
   - Add new features in `src/components/`
   - Create custom API routes in `src/app/api/`

## 🆘 Need More Help?

- **Detailed Setup:** See [SETUP.md](./SETUP.md)
- **Full Documentation:** See [README.md](./README.md)
- **Issues:** Check existing issues or create a new one on GitHub

## 🚀 Ready to Code?

```bash
# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
# Login with default credentials
# Start building!
```

---

Happy Coding! 🎉
