#!/bin/bash

# Fortune 50 AI Application Deployment Script
# Supports deployment on Windows 11 with Docker Desktop

set -e

echo "🚀 Fortune 50 AI Application Deployment"
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Desktop with docker-compose."
    exit 1
fi

echo "✅ Docker is running"

# Build the application
echo "🏗️  Building Fortune 50 AI Application..."
docker-compose build

# Start the services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

services=("kafka:9092" "mlflow:5000" "vault:8200" "minio:9000" "prometheus:9090" "grafana:3000")
for service in "${services[@]}"; do
    host=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if nc -z localhost $port 2>/dev/null; then
        echo "✅ $host is ready on port $port"
    else
        echo "⚠️  $host is not ready on port $port"
    fi
done

# Display access information
echo ""
echo "🎉 Fortune 50 AI Application Deployed Successfully!"
echo "=================================================="
echo ""
echo "Access URLs:"
echo "• MLflow UI:      http://localhost:5000"
echo "• Vault UI:       http://localhost:8200 (token: demo-token)"
echo "• MinIO Console:  http://localhost:9001 (admin/minioadmin)"
echo "• Prometheus:     http://localhost:9090"
echo "• Grafana:        http://localhost:3000 (admin/admin)"
echo ""
echo "Application Logs:"
echo "docker-compose logs -f fortune50-ai-app"
echo ""
echo "To stop all services:"
echo "docker-compose down"
echo ""
echo "To stop and remove all data:"
echo "docker-compose down -v"