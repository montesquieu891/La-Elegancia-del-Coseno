#!/bin/bash
# Start script for La Elegancia del Coseno

echo "🎯 La Elegancia del Coseno - Starting..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Start the Flask application
echo "🚀 Starting Flask server..."
echo "📖 Open your browser at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
python app.py
