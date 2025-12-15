# Quick Start Script - Run this to set up the project locally

Write-Host "🚀 Task Manager - Quick Setup Script" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green

# Check if PostgreSQL is running (optional)
$pgRunning = Get-Process -Name postgres -ErrorAction SilentlyContinue
if ($pgRunning) {
    Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL not detected. You'll need a database connection." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Cyan
Set-Location backend
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠ Creating .env from .env.example - Please update DATABASE_URL!" -ForegroundColor Yellow
    Copy-Item .env.example .env
}
npm install

Write-Host ""
Write-Host "🔧 Setting up Prisma..." -ForegroundColor Cyan
Write-Host "⚠ Make sure DATABASE_URL in .env points to a valid PostgreSQL database" -ForegroundColor Yellow
$continue = Read-Host "Press Enter to continue with Prisma setup, or Ctrl+C to exit and configure .env first"

npx prisma generate
npx prisma migrate dev --name init

Write-Host ""
Write-Host "🧪 Running Backend Tests..." -ForegroundColor Cyan
npm test

Write-Host ""
Set-Location ..\frontend
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env from .env.example" -ForegroundColor Yellow
    Copy-Item .env.example .env
}
npm install

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your PostgreSQL DATABASE_URL"
Write-Host "2. Start backend:  cd backend && npm run dev"
Write-Host "3. Start frontend: cd frontend && npm run dev"
Write-Host ""
Write-Host "📚 See README.md for full documentation"
Write-Host "🚀 See DEPLOYMENT.md for deployment instructions"
Write-Host ""
Set-Location ..
