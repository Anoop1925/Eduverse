@echo off
REM Magic Learn Auto-Starter - Called by API
cd /d "%~dp0"
call ..\venv\Scripts\activate.bat
streamlit run "src\app\feature-1\app.py" --server.port=8501 --server.headless=true --browser.serverAddress=localhost
