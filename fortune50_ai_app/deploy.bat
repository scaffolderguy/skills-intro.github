@echo off

REM Fortune 50 AI Application Deployment Script for Windows

echo 🚀 Fortune 50 AI Application Deployment
echo ========================================

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Build the application
echo 🏗️  Building Fortune 50 AI Application...
docker-compose build

REM Start the services
echo 🚀 Starting all services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to initialize...
timeout /t 30 /nobreak >nul

echo 🎉 Fortune 50 AI Application Deployed Successfully!
echo ==================================================
echo.
echo Access URLs:
echo • MLflow UI:      http://localhost:5000
echo • Vault UI:       http://localhost:8200 (token: demo-token)
echo • MinIO Console:  http://localhost:9001 (admin/minioadmin)
echo • Prometheus:     http://localhost:9090
echo • Grafana:        http://localhost:3000 (admin/admin)
echo.
echo Application Logs:
echo docker-compose logs -f fortune50-ai-app
echo.
echo To stop all services:
echo docker-compose down
echo.
echo To stop and remove all data:
echo docker-compose down -v

pause