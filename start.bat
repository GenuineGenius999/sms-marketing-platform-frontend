@echo off
echo 🚀 Starting SMS Marketing Platform...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker-compose is not installed. Please install docker-compose and try again.
    pause
    exit /b 1
)

echo 📦 Building and starting services...

REM Build and start all services
docker-compose up --build -d

echo ⏳ Waiting for services to be ready...

REM Wait for PostgreSQL to be ready
echo 🔍 Checking PostgreSQL...
:wait_postgres
docker-compose exec postgres pg_isready -U sms_user -d sms_platform >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)
echo ✅ PostgreSQL is ready!

REM Wait for Redis to be ready
echo 🔍 Checking Redis...
:wait_redis
docker-compose exec redis redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Waiting for Redis...
    timeout /t 2 /nobreak >nul
    goto wait_redis
)
echo ✅ Redis is ready!

REM Wait for backend to be ready
echo 🔍 Checking Backend API...
:wait_backend
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Waiting for Backend API...
    timeout /t 2 /nobreak >nul
    goto wait_backend
)
echo ✅ Backend API is ready!

REM Wait for frontend to be ready
echo 🔍 Checking Frontend...
:wait_frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Waiting for Frontend...
    timeout /t 2 /nobreak >nul
    goto wait_frontend
)
echo ✅ Frontend is ready!

echo.
echo 🎉 SMS Marketing Platform is now running!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 📊 Admin Panel: http://localhost:3000/admin/dashboard
echo.
echo 🔑 Default Login Credentials:
echo    Email: admin@example.com
echo    Password: admin123
echo.
echo 📝 To stop the platform, run: docker-compose down
echo 📝 To view logs, run: docker-compose logs -f
echo.
echo Happy SMS Marketing! 📱✨
pause
