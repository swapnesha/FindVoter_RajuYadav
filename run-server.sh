#!/bin/bash

# Simple script to run a local HTTP server for the voter search app

echo "🚀 Starting Local HTTP Server..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✓ Using Python 3"
    echo ""
    echo "📱 Open your browser and go to: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ Using Python 2"
    echo ""
    echo "📱 Open your browser and go to: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "✓ Using Node.js"
    echo ""
    # Check if http-server is installed globally
    if command -v http-server &> /dev/null; then
        echo "📱 Open your browser and go to: http://localhost:8080"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        http-server -p 8080
    else
        echo "Installing http-server..."
        npm install -g http-server
        echo ""
        echo "📱 Open your browser and go to: http://localhost:8080"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        http-server -p 8080
    fi
else
    echo "❌ Error: No suitable server found"
    echo ""
    echo "Please install Python 3, Python 2, or Node.js"
    exit 1
fi
