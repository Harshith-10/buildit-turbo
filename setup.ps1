# BuildIt Turbo - Automated Setup Script
# This script automates the complete setup process for the BuildIt Turbo project

# Color output functions
function Write-SuccessMsg {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-InfoMsg {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-WarningMsg {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-StepMsg {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Magenta
}

# Banner
Write-Host @"
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘                                                   â•‘
â•‘          BuildIt Turbo - Setup Script            â•‘
â•‘                                                   â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
"@ -ForegroundColor Cyan

Write-Host ""

# Check if running in correct directory
if (-not (Test-Path "package.json")) {
    Write-ErrorMsg "package.json not found. Please run this script from the project root directory."
    exit 1
}

# Step 1: Check Prerequisites
Write-StepMsg "Step 1: Checking Prerequisites"

# Check Node.js
Write-InfoMsg "Checking Node.js installation..."
try {
    $nodeVersion = node --version
    Write-SuccessMsg "Node.js is installed: $nodeVersion"
    
    # Extract version number and check if >= 18
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-WarningMsg "Node.js version 18 or higher is recommended. You have: $nodeVersion"
    }
} catch {
    Write-ErrorMsg "Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
}

# Check pnpm
Write-InfoMsg "Checking pnpm installation..."
try {
    $pnpmVersion = pnpm --version
    Write-SuccessMsg "pnpm is installed: v$pnpmVersion"
} catch {
    Write-WarningMsg "pnpm is not installed. Installing pnpm globally..."
    npm install -g pnpm
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "pnpm installed successfully"
    } else {
        Write-ErrorMsg "Failed to install pnpm. Please install it manually: npm install -g pnpm"
        exit 1
    }
}

# Check PostgreSQL
Write-InfoMsg "Checking PostgreSQL installation..."
try {
    $pgVersion = psql --version
    Write-SuccessMsg "PostgreSQL is installed: $pgVersion"
} catch {
    Write-WarningMsg "PostgreSQL CLI (psql) not found in PATH."
    Write-WarningMsg "Please ensure PostgreSQL is installed and running."
    Write-WarningMsg "Download from: https://www.postgresql.org/download/"
    
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Step 2: Install Dependencies
Write-StepMsg "Step 2: Installing Dependencies"
Write-InfoMsg "Running: pnpm install"
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-ErrorMsg "Failed to install dependencies"
    exit 1
}
Write-SuccessMsg "Dependencies installed successfully"

# Step 3: Environment Configuration
Write-StepMsg "Step 3: Setting Up Environment Variables"

$envExists = Test-Path ".env"

if ($envExists) {
    Write-WarningMsg ".env file already exists"
    $overwrite = Read-Host "Do you want to reconfigure it? (y/n)"
    if ($overwrite -ne 'y') {
        Write-InfoMsg "Keeping existing .env file"
    } else {
        $reconfigure = $true
    }
} else {
    $reconfigure = $true
}

if ($reconfigure) {
    Write-InfoMsg "Configuring environment variables..."
    
    # Get database configuration
    Write-Host "`nDatabase Configuration:" -ForegroundColor Yellow
    $dbHost = Read-Host "Enter PostgreSQL host (default: localhost)"
    if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }
    
    $dbPort = Read-Host "Enter PostgreSQL port (default: 5432)"
    if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }
    
    $dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
    if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }
    
    $dbPassword = Read-Host "Enter PostgreSQL password" -AsSecureString
    $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
    
    $dbName = Read-Host "Enter database name (default: buildit_turbo)"
    if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "buildit_turbo" }
    
    # Generate a secure random secret
    Write-InfoMsg "Generating secure authentication secret..."
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $authSecret = [System.BitConverter]::ToString($bytes) -replace '-', ''
    $authSecret = $authSecret.ToLower()
    
    $appUrl = Read-Host "Enter application URL (default: http://localhost:3000)"
    if ([string]::IsNullOrWhiteSpace($appUrl)) { $appUrl = "http://localhost:3000" }
    
    # Create DATABASE_URL
    $databaseUrl = "postgresql://${dbUser}:${dbPasswordPlain}@${dbHost}:${dbPort}/${dbName}"
    
    # Create .env file
    $envContent = @"
# Database Configuration
# PostgreSQL connection string
DATABASE_URL=$databaseUrl

# Better Auth Configuration
# Secure random secret (auto-generated)
BETTER_AUTH_SECRET=$authSecret

# Application URL
BETTER_AUTH_URL=$appUrl

# Node Environment
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-SuccessMsg "Environment file (.env) created successfully"
}

# Step 4: Database Setup
Write-StepMsg "Step 4: Setting Up Database"

# Ask if database exists
Write-Host "`nDatabase Setup:" -ForegroundColor Yellow
$createDb = Read-Host "Do you need to create the database? (y/n)"

if ($createDb -eq 'y') {
    # Load .env to get database credentials
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    
    # Extract database name from DATABASE_URL
    if ($env:DATABASE_URL -match '/([^/]+)$') {
        $dbNameFromUrl = $matches[1]
    } else {
        $dbNameFromUrl = "buildit_turbo"
    }
    
    Write-InfoMsg "Creating database: $dbNameFromUrl"
    
    # Extract connection info
    if ($env:DATABASE_URL -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)') {
        $dbUser = $matches[1]
        $dbPass = $matches[2]
        $dbHost = $matches[3]
        $dbPort = $matches[4]
        
        $env:PGPASSWORD = $dbPass
        
        # Create database
        $createDbSql = "CREATE DATABASE $dbNameFromUrl;"
        echo $createDbSql | psql -h $dbHost -p $dbPort -U $dbUser -d postgres 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-SuccessMsg "Database created successfully"
        } else {
            Write-WarningMsg "Database might already exist or creation failed"
            Write-InfoMsg "Continuing with setup..."
        }
        
        Remove-Item env:PGPASSWORD
    }
}

# Push database schema
Write-InfoMsg "Pushing database schema..."
Write-InfoMsg "Running: pnpm db:push"
pnpm db:push

if ($LASTEXITCODE -ne 0) {
    Write-ErrorMsg "Failed to push database schema"
    Write-WarningMsg "Please check your database connection and try again"
    exit 1
}
Write-SuccessMsg "Database schema created successfully"

# Step 5: Seed Database
Write-StepMsg "Step 5: Seeding Database (Optional)"

$seedDb = Read-Host "Do you want to seed the database with sample data? (y/n)"

if ($seedDb -eq 'y') {
    Write-InfoMsg "Seeding database..."
    Write-InfoMsg "Running: pnpm db:seed"
    pnpm db:seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Database seeded successfully"
        Write-Host "`nDefault Users Created:" -ForegroundColor Yellow
        Write-Host "  Admin   - Email: admin@buildit.com   | Password: password1234" -ForegroundColor Cyan
        Write-Host "  Faculty - Email: faculty@buildit.com | Password: password1234" -ForegroundColor Cyan
        Write-Host "  Student - Email: student@buildit.com | Password: password1234" -ForegroundColor Cyan
    } else {
        Write-WarningMsg "Database seeding encountered issues"
    }
} else {
    Write-InfoMsg "Skipping database seeding"
}

# Step 6: Build Check (Optional)
Write-StepMsg "Step 6: Build Verification (Optional)"

$buildCheck = Read-Host "Do you want to verify the build? (y/n)"

if ($buildCheck -eq 'y') {
    Write-InfoMsg "Building project..."
    pnpm build
    
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Build completed successfully"
    } else {
        Write-WarningMsg "Build encountered issues"
    }
}

# Final Summary
Write-Host "`n" + "â•" * 60 -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "â•" * 60 -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Start the development server:" -ForegroundColor Cyan
Write-Host "     pnpm dev" -ForegroundColor White
Write-Host "`n  2. Open your browser:" -ForegroundColor Cyan
Write-Host "     http://localhost:3000" -ForegroundColor White

if ($seedDb -eq 'y') {
    Write-Host "`n  3. Login with default credentials:" -ForegroundColor Cyan
    Write-Host "     Admin:   admin@buildit.com / password1234" -ForegroundColor White
    Write-Host "     Faculty: faculty@buildit.com / password1234" -ForegroundColor White
    Write-Host "     Student: student@buildit.com / password1234" -ForegroundColor White
}

Write-Host "`nUseful Commands:" -ForegroundColor Yellow
Write-Host "  pnpm dev        - Start development server" -ForegroundColor White
Write-Host "  pnpm build      - Build for production" -ForegroundColor White
Write-Host "  pnpm start      - Start production server" -ForegroundColor White
Write-Host "  pnpm lint       - Run linter" -ForegroundColor White
Write-Host "  pnpm format     - Format code" -ForegroundColor White
Write-Host "  pnpm db:push    - Push schema changes" -ForegroundColor White
Write-Host "  pnpm db:seed    - Seed database" -ForegroundColor White
Write-Host "  pnpm db:reset   - Reset database" -ForegroundColor White

Write-Host "`n" + "â•" * 60 -ForegroundColor Green
Write-Host "Happy Coding! ðŸš€" -ForegroundColor Cyan
Write-Host "â•" * 60 -ForegroundColor Green
Write-Host ""

