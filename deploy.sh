#!/bin/bash

# PassAlong App Deployment Script
# Run this on your Linux server after copying the project

echo "🚀 Deploying PassAlong App..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Ubuntu/Debian: sudo apt-get install docker.io docker-compose"
    echo "   CentOS/RHEL: sudo yum install docker docker-compose"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create items directory if it doesn't exist
mkdir -p items

# Build and start the application
echo "📦 Building Docker image..."
docker-compose build

echo "🚀 Starting application..."
docker-compose up -d

# Wait a moment for the container to start
sleep 5

# Check if the application is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ PassAlong App is running!"
    echo "🌐 Access it at: http://your-server-ip:5000"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop app: docker-compose down"
    echo "   Restart: docker-compose restart"
else
    echo "❌ Application failed to start. Check logs:"
    docker-compose logs
fi
