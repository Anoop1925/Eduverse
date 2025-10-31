@echo off
echo Starting Magic Learn...
cd Eduverse
call ..\venv\Scripts\activate.bat
streamlit run "src\app\feature-1\app.py" --server.port=8501 --server.headless=true
