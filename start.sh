#!/bin/bash

# SMS Marketing Platform Startup Script

echo "🚀 Starting SMS Marketing Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

echo "📦 Building and starting services..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL to be ready
echo "🔍 Checking PostgreSQL..."
until docker-compose exec postgres pg_isready -U sms_user -d sms_platform; do
    echo "⏳ Waiting for PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL is ready!"

# Wait for Redis to be ready
echo "🔍 Checking Redis..."
until docker-compose exec redis redis-cli ping; do
    echo "⏳ Waiting for Redis..."
    sleep 2
done
echo "✅ Redis is ready!"

# Wait for backend to be ready
echo "🔍 Checking Backend API..."
until curl -f http://localhost:8000/health > /dev/null 2>&1; do
    echo "⏳ Waiting for Backend API..."
    sleep 2
done
echo "✅ Backend API is ready!"

# Wait for frontend to be ready
echo "🔍 Checking Frontend..."
until curl -f http://localhost:3000 > /dev/null 2>&1; do
    echo "⏳ Waiting for Frontend..."
    sleep 2
done
echo "✅ Frontend is ready!"

echo ""
echo "🎉 SMS Marketing Platform is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "📊 Admin Panel: http://localhost:3000/admin/dashboard"
echo ""
echo "🔑 Default Login Credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "📝 To stop the platform, run: docker-compose down"
echo "📝 To view logs, run: docker-compose logs -f"
echo ""
echo "Happy SMS Marketing! 📱✨"
