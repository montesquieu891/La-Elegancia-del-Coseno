@echo off
REM Start script for La Elegancia del Coseno (Windows)

echo 🎯 La Elegancia del Coseno - Starting...

REM Check if virtual environment exists
if not exist "venv\" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
pip install -q -r requirements.txt

REM Start the Flask application
echo 🚀 Starting Flask server...
echo 📖 Open your browser at: http://localhost:5000
echo Press Ctrl+C to stop the server
python app.py
