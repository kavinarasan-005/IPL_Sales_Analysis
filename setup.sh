#!/bin/bash

echo "==================================="
echo "IPL Dashboard Setup Script"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✓ Python version: $(python3 --version)"
echo ""

# Prepare data
echo "Preparing data files..."
python3 prepare_data.py
echo ""

# Install dependencies
echo "Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "==================================="
    echo "✅ Setup Complete!"
    echo "==================================="
    echo ""
    echo "To start the dashboard, run:"
    echo "  npm start"
    echo ""
    echo "The dashboard will open at: http://localhost:3000"
    echo ""
else
    echo ""
    echo "❌ Setup failed. Please check the errors above."
    exit 1
fi


