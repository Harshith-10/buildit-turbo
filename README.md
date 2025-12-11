# BuildIt Turbo 🚀

A comprehensive online coding examination and practice platform built with Next.js 16, featuring role-based access for students, faculty, and administrators.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup Documentation](#setup-documentation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Default Users](#default-users)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)

## 📚 Setup Documentation

We provide comprehensive setup guides for different needs:

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in minutes with automated setup
- **[SETUP.md](./SETUP.md)** - Detailed manual setup guide with troubleshooting
- **[CHECKLIST.md](./CHECKLIST.md)** - Verification checklist to ensure everything works

Choose the guide that best fits your experience level!

## 🎯 Overview

BuildIt Turbo is a full-stack web application designed for educational institutions to conduct coding exams, manage problem sets, track student progress, and provide a comprehensive learning environment for programming practice.

## ✨ Features

### For Students
- 📝 Take coding exams with multiple programming language support (Java, Python, C++, JavaScript, Rust)
- 💻 Practice coding problems with an integrated code editor
- 📊 Track progress with visual dashboards and statistics
- 🔔 Receive notifications about exams and updates
- 📚 Access curated problem collections and resources
- 🏆 View rankings and solve streaks

### For Faculty
- 📋 Create and manage exams with custom problem sets
- ✏️ Design coding questions with test cases
- 📂 Organize problems into collections
- 🔍 Review student submissions and provide feedback
- 👥 Manage exam sessions and student access
- 🗑️ Recycle bin for deleted items

### For Administrators
- 👤 User management and role assignment
- 🔐 Security features with session management
- 📈 System-wide analytics and monitoring
- ⚙️ Platform configuration and maintenance

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, shadcn/ui
- **Rich Text Editor:** Plate.js
- **Code Editor:** CodeMirror with language support
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth with session management
- **API:** Next.js API Routes (App Router)

### Developer Tools
- **Language:** TypeScript
- **Package Manager:** pnpm (workspace)
- **Code Quality:** Biome (linting & formatting)
- **Database Migrations:** Drizzle Kit

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **PostgreSQL** (v14 or higher)
- **Git**

## 🚀 Installation

### Option 1: Automated Setup (Recommended)

We provide automated setup scripts that handle the entire installation process.

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux / macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

The automated script will guide you through:
- Checking prerequisites
- Installing dependencies
- Configuring environment variables
- Setting up the database
- Seeding sample data
- Verifying the build

### Option 2: Manual Setup

For manual installation, see the detailed [SETUP.md](./SETUP.md) guide.

**Quick manual setup:**

**Quick manual setup:**

1. **Clone the repository**
```bash
git clone https://github.com/Harshith-10/buildit-turbo.git
cd buildit-turbo
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Create environment file**
```bash
# Create a .env file in the root directory
touch .env
```

## 🗄️ Database Setup

1. **Create a PostgreSQL database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE buildit_turbo;

# Exit psql
\q
```

2. **Configure environment variables**

Create a `.env` file in the root directory with the following:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/buildit_turbo

# Better Auth (generate a random secret)
BETTER_AUTH_SECRET=your-super-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Optional: For production
# NODE_ENV=production
```

3. **Push database schema**
```bash
pnpm db:push
```

This will create all necessary tables in your database.

4. **Seed the database** (Optional but recommended)
```bash
pnpm db:seed
```

This will populate the database with:
- Sample users (admin, faculty, student)
- Programming problems
- Sample exams
- Collections
- Resources
- Notifications

## 🏃 Running the Application

### Development Mode
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
buildit-turbo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── faculty/           # Faculty portal
│   │   ├── student/           # Student portal
│   │   ├── auth/              # Authentication pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── editor/            # Code editor components
│   │   ├── auth/              # Auth-related components
│   │   ├── dashboard/         # Dashboard widgets
│   │   └── plate-ui/          # Rich text editor components
│   ├── actions/               # Server actions
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── faculty/
│   │   └── student/
│   ├── db/                    # Database configuration
│   │   ├── index.ts           # Database connection
│   │   └── schema/            # Drizzle schema definitions
│   ├── lib/                   # Utility functions
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
├── scripts/                   # Database scripts
│   ├── seed/                  # Seeding scripts
│   ├── reset.ts               # Reset database
│   └── prove-driver.ts        # Test driver
├── public/                    # Static assets
├── drizzle.config.ts          # Drizzle ORM configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── biome.json                 # Biome linter/formatter config
```

## 👥 Default Users

After running `pnpm db:seed`, the following users are available:

| Role    | Email               | Password      | Username  |
|---------|---------------------|---------------|-----------|
| Admin   | admin@buildit.com   | password1234  | admin     |
| Faculty | faculty@buildit.com | password1234  | faculty   |
| Student | student@buildit.com | password1234  | student   |

## 📜 Available Scripts

| Command          | Description                                    |
|------------------|------------------------------------------------|
| `pnpm dev`       | Start development server                       |
| `pnpm build`     | Build for production                           |
| `pnpm start`     | Start production server                        |
| `pnpm lint`      | Run Biome linter                               |
| `pnpm format`    | Format code with Biome                         |
| `pnpm db:push`   | Push schema changes to database                |
| `pnpm db:seed`   | Seed database with sample data                 |
| `pnpm db:reset`  | Reset database (drops all data)                |

## 🔐 Environment Variables

### Required Variables

| Variable              | Description                                  | Example                                    |
|-----------------------|----------------------------------------------|--------------------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string                 | `postgresql://user:pass@localhost:5432/db` |
| `BETTER_AUTH_SECRET`  | Secret key for authentication (min 32 chars) | Generated random string                    |
| `BETTER_AUTH_URL`     | Application URL                              | `http://localhost:3000`                    |

### Generating BETTER_AUTH_SECRET

You can generate a secure random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🌟 Key Features Breakdown

### Authentication & Security
- Email/password authentication with Better Auth
- Role-based access control (Admin, Faculty, Student)
- Session management with security questions
- Session conflict detection and resolution
- User ban system with expiration

### Code Editor
- Multi-language support (Java, Python, C++, JavaScript, Rust)
- Syntax highlighting with CodeMirror
- Theme support (GitHub, VS Code themes)
- Real-time code execution and validation

### Exam System
- Timed exams with auto-submission
- Multiple problem sets per exam
- Test case validation
- Submission history and grading
- Proctoring features

### Rich Content Creation
- WYSIWYG editor with Plate.js
- Markdown support
- Code blocks with syntax highlighting
- Mathematical equations (KaTeX)
- Media embedding (images, videos, YouTube)
- Tables, lists, and formatting options

### Dashboard & Analytics
- Student progress tracking
- Category-wise problem completion
- Difficulty-based statistics
- Streak tracking
- Ranking system
- Visual charts with Recharts

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check database user has proper permissions

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [Repository Owner](https://github.com/Harshith-10)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Better Auth for authentication solution
- Radix UI for accessible components
- All open-source contributors

---

Built with ❤️ using Next.js and TypeScript
