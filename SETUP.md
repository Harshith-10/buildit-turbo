# BuildIt Turbo - Setup Guide

This guide provides multiple ways to set up the BuildIt Turbo project.

## 🚀 Quick Setup (Automated)

We provide automated setup scripts for both Windows and Unix-based systems.

### Windows (PowerShell)

```powershell
# Run the setup script
.\setup.ps1
```

### Linux / macOS (Bash)

```bash
# Make the script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

The automated script will:
- ✅ Check all prerequisites (Node.js, pnpm, PostgreSQL)
- ✅ Install dependencies
- ✅ Configure environment variables
- ✅ Create and setup the database
- ✅ Push database schema
- ✅ Optionally seed with sample data
- ✅ Optionally verify the build

## 📋 Manual Setup

If you prefer to set up the project manually, follow these steps:

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** v18 or higher
- **pnpm** v8 or higher
- **PostgreSQL** v14 or higher

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# On Unix/Linux/macOS
cp .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/buildit_turbo

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secure-secret-here-min-32-chars

# Application URL
BETTER_AUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

**Generate a secure secret:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL (Unix/Linux/macOS)
openssl rand -hex 32
```

### 4. Database Setup

#### Create Database

**Using psql:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE buildit_turbo;

# Exit
\q
```

**Using PowerShell:**

```powershell
# Set password environment variable
$env:PGPASSWORD = "your_password"

# Create database
psql -U postgres -c "CREATE DATABASE buildit_turbo;"
```

#### Push Database Schema

```bash
pnpm db:push
```

This creates all necessary tables in your database.

### 5. Seed Database (Optional)

```bash
pnpm db:seed
```

This populates the database with:
- Default users (admin, faculty, student)
- Sample problems and test cases
- Example exams
- Collections and resources
- Notifications

**Default Users Created:**
- **Admin:** admin@buildit.com / password1234
- **Faculty:** faculty@buildit.com / password1234
- **Student:** student@buildit.com / password1234

### 6. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Setup (Alternative)

If you prefer using Docker, you can use Docker Compose:

### 1. Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: buildit_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: buildit_turbo
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Update .env

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/buildit_turbo
```

### 4. Continue with Normal Setup

Follow steps 2-6 from the manual setup.

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### PostgreSQL Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   # Check status (varies by OS)
   sudo systemctl status postgresql  # Linux
   brew services list                # macOS
   Get-Service postgresql*           # Windows
   ```

2. **Verify connection:**
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

3. **Check DATABASE_URL format:**
   ```
   postgresql://username:password@host:port/database
   ```

### Permission Denied (Unix/Linux/macOS)

```bash
# Make scripts executable
chmod +x setup.sh
```

### pnpm Not Found

```bash
# Install pnpm globally
npm install -g pnpm
```

### Database Schema Issues

```bash
# Reset database and start over
pnpm db:reset
pnpm db:push
pnpm db:seed
```

### Module Not Found Errors

```bash
# Clear and reinstall
rm -rf node_modules
pnpm install
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

## 📝 Available Scripts

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

## 🔐 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Generate unique secrets** for production environments
3. **Use strong passwords** for database users
4. **Change default user passwords** after first login in production
5. **Enable SSL** for PostgreSQL in production

## 🌟 Next Steps

After setup is complete:

1. **Explore the Application:**
   - Visit http://localhost:3000
   - Login with default credentials
   - Try different user roles

2. **Customize Configuration:**
   - Update theme in `src/app/globals.css`
   - Modify components in `src/components/`
   - Add custom features

3. **Development Workflow:**
   - Make changes to source files
   - Hot reload updates automatically
   - Run linter before committing: `pnpm lint`
   - Format code: `pnpm format`

4. **Database Management:**
   - Add new schemas in `src/db/schema/`
   - Push changes: `pnpm db:push`
   - Create custom seed scripts in `scripts/seed/`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check the main [README.md](./README.md)
4. Create an issue on GitHub

---

Happy coding! 🚀
