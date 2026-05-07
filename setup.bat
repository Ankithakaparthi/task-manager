@echo off
REM Team Task Manager - Setup Script for Windows
REM This script sets up the entire project

echo.
echo 🚀 Team Task Manager - Setup Script
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js is installed: 
node --version
echo.

REM Setup Backend
echo 📁 Setting up Backend...
cd backend

if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
    echo ✓ Backend dependencies installed
) else (
    echo ✓ Backend dependencies already installed
)

if not exist .env (
    echo.
    echo ⚠️  .env file not found
    echo Creating .env with default values...
    echo Please update with your actual values:
    echo.
    type .env
    echo.
) else (
    echo ✓ .env file exists
)

cd ..

echo.
echo 📁 Setting up Frontend...
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
    echo ✓ Frontend dependencies installed
) else (
    echo ✓ Frontend dependencies already installed
)

cd ..

echo.
echo ====================================
echo ✅ Setup Complete!
echo ====================================
echo.
echo Next steps:
echo.
echo 1. Configure Backend
echo    - Edit backend\.env with your values
echo    - Make sure MongoDB is running
echo.
echo 2. Start Backend
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (in new terminal)
echo    cd frontend
echo    npm start
echo.
echo 4. Open Browser
echo    http://localhost:3000
echo.
echo 5. Login with Demo Credentials
echo    Admin: admin@example.com / password
echo    Member: member@example.com / password
echo.
echo For more information, see QUICK_START.md
echo.
pause
