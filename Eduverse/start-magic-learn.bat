@echo off
echo ========================================
echo   Magic Learn - Streamlit Server
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found!
    echo Please create a virtual environment first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)

echo [2/3] Checking if Streamlit is installed...
python -c "import streamlit" 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Streamlit not found in virtual environment!
    echo Installing Streamlit...
    pip install streamlit
)

echo [3/3] Starting Streamlit server...
echo.
echo Server will start on: http://localhost:8501
echo Press Ctrl+C to stop the server
echo.

streamlit run "src\app\feature-1\app.py" --server.port=8501 --server.headless=true --server.enableCORS=false --browser.serverAddress=localhost

REM If streamlit fails, show error
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Streamlit failed to start!
    echo Check the error messages above.
    pause
    exit /b 1
)
