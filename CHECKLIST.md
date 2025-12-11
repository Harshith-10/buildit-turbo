# Setup Verification Checklist

Use this checklist to verify your BuildIt Turbo installation is complete and working correctly.

## ✅ Pre-Setup Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] PostgreSQL v14+ installed (`psql --version`)
- [ ] PostgreSQL service is running
- [ ] Git installed (if cloning from repository)

## ✅ Installation Checklist

- [ ] Repository cloned or downloaded
- [ ] Ran setup script (`setup.ps1` or `setup.sh`)
  - [ ] Dependencies installed successfully
  - [ ] `.env` file created and configured
  - [ ] Database created
  - [ ] Database schema pushed
  - [ ] Database seeded (optional)
- [ ] No errors during setup process

## ✅ Configuration Checklist

### Environment Variables (.env)

- [ ] `DATABASE_URL` is set correctly
- [ ] `BETTER_AUTH_SECRET` is a secure random string (min 32 chars)
- [ ] `BETTER_AUTH_URL` points to correct application URL
- [ ] All required environment variables present

### Database

- [ ] PostgreSQL is running
- [ ] Database `buildit_turbo` exists
- [ ] Can connect to database with credentials in `.env`
- [ ] All tables created (run `pnpm db:push` if unsure)
- [ ] Sample data seeded (if you chose to seed)

### Dependencies

- [ ] `node_modules` folder exists
- [ ] `package.json` is present
- [ ] No dependency errors when running `pnpm install`

## ✅ Application Startup Checklist

### Development Server

- [ ] Run `pnpm dev` without errors
- [ ] Server starts on port 3000 (or configured port)
- [ ] No compilation errors in terminal
- [ ] Application accessible at http://localhost:3000

### Application Access

- [ ] Home page loads successfully
- [ ] No console errors in browser
- [ ] Can navigate to `/auth` page
- [ ] Authentication pages render correctly

## ✅ Functionality Checklist

### Authentication (if seeded)

- [ ] Can login as admin (admin@buildit.com / password1234)
- [ ] Can login as faculty (faculty@buildit.com / password1234)
- [ ] Can login as student (student@buildit.com / password1234)
- [ ] Login redirects to appropriate dashboard
- [ ] Logout works correctly

### Admin Dashboard (login as admin)

- [ ] Admin dashboard accessible
- [ ] Can view users
- [ ] Can access admin-only features

### Faculty Portal (login as faculty)

- [ ] Faculty dashboard accessible
- [ ] Can view problems
- [ ] Can view exams
- [ ] Can view collections

### Student Portal (login as student)

- [ ] Student dashboard accessible
- [ ] Can view available exams
- [ ] Can view problems
- [ ] Dashboard shows statistics

## ✅ Database Verification

Run these commands to verify database setup:

```bash
# Check if database exists
psql -U postgres -c "\l" | grep buildit_turbo

# Check if tables exist (update connection details)
psql -U postgres -d buildit_turbo -c "\dt"

# Count users (should be 3 if seeded)
psql -U postgres -d buildit_turbo -c "SELECT COUNT(*) FROM \"user\";"
```

## ✅ Build Verification (Optional)

- [ ] Run `pnpm build` successfully
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] Build output generated in `.next` folder
- [ ] Run `pnpm start` successfully
- [ ] Production build accessible

## ✅ Code Quality Checklist

- [ ] Run `pnpm lint` - no critical errors
- [ ] Run `pnpm format` - code formatted correctly
- [ ] All TypeScript files compile without errors

## 🔧 Troubleshooting

If any checklist item fails:

### Database Issues
```bash
# Reset database
pnpm db:reset
pnpm db:push
pnpm db:seed
```

### Dependency Issues
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Build Issues
```bash
# Clear cache
rm -rf .next
pnpm build
```

### Port Issues
```bash
# Kill process on port 3000
npx kill-port 3000
```

## ✅ Post-Setup Recommendations

- [ ] Change default user passwords in production
- [ ] Review security settings in `.env`
- [ ] Enable HTTPS for production deployment
- [ ] Set up backup strategy for database
- [ ] Configure error monitoring (optional)
- [ ] Set up CI/CD pipeline (optional)
- [ ] Review and customize application settings

## 📊 Expected Results Summary

After successful setup, you should have:

| Component | Status | Details |
|-----------|--------|---------|
| Dependencies | ✅ Installed | All packages in node_modules |
| Environment | ✅ Configured | .env file with all variables |
| Database | ✅ Running | PostgreSQL with buildit_turbo DB |
| Schema | ✅ Created | All tables in database |
| Seed Data | ✅ Loaded | 3 users, problems, exams, etc. |
| Dev Server | ✅ Running | http://localhost:3000 |
| Authentication | ✅ Working | Can login with default users |

## 🎯 Success Criteria

Your setup is successful if:

1. ✅ Development server starts without errors
2. ✅ Application loads in browser
3. ✅ Can login with at least one user account
4. ✅ Dashboard displays correctly
5. ✅ No critical errors in browser console
6. ✅ Database queries work (can view data)

## 📝 Notes

- Keep this checklist for future reference
- Mark items as you complete them
- If stuck, refer to [SETUP.md](./SETUP.md) or [README.md](./README.md)
- For issues, check [QUICKSTART.md](./QUICKSTART.md) troubleshooting section

## 🆘 Getting Help

If verification fails:

1. Review error messages carefully
2. Check [SETUP.md](./SETUP.md) troubleshooting section
3. Verify all prerequisites are met
4. Try running setup script again
5. Create an issue on GitHub with error details

---

**Setup verified?** Great! You're ready to start developing! 🚀

Run `pnpm dev` and visit http://localhost:3000 to begin!
