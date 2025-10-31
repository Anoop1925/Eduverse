# Magic Learn - Quick Reference

## 🚀 How to Launch

### Option 1: Web UI (Automatic)
1. Start Next.js: `npm run dev`
2. Go to Magic Learn feature page
3. Click "Launch Magic Learn" button
4. Server starts automatically on http://localhost:8501

### Option 2: Manual Start
From PadhaKU folder:
```bash
.\start-magic-learn.bat
```

## 📁 Project Structure
```
PadhaKU/
├── venv/                    # Python 3.10 virtual environment
│   └── Scripts/
│       └── streamlit.exe    # Used by API route
│
├── start-magic-learn.bat    # Manual server start
│
└── Eduverse/                # Next.js project
    ├── .env                 # Your API key (keep secure!)
    ├── .env.example         # Template
    │
    ├── src/
    │   ├── app/
    │   │   ├── feature-1/
    │   │   │   ├── page.tsx          # Launch button UI
    │   │   │   └── app.py            # Streamlit app
    │   │   │
    │   │   └── api/
    │   │       └── magic-learn/
    │   │           └── start/
    │   │               └── route.ts  # Auto-start API
    │
    └── package.json
```

## ⚙️ Configuration

### Environment Variables (.env)
- `GEMINI_API_KEY` - Your Google Gemini API key
- Get from: https://makersuite.google.com/app/apikey

### Model Used
- **gemini-2.0-flash-exp** (updated from gemini-1.5-flash)

## 🔧 How It Works

1. **Click Launch Button** → `src/app/feature-1/page.tsx`
2. **Calls API** → `GET /api/magic-learn/start` (check if running)
3. **If not running** → `POST /api/magic-learn/start`
4. **API spawns** → `..\venv\Scripts\streamlit.exe run src\app\feature-1\app.py`
5. **Waits up to 30s** → Polls port 8501
6. **Opens browser** → http://localhost:8501

## ✅ What Was Fixed

1. ✅ **Python version** - Changed from 3.14 → 3.10.3
2. ✅ **Virtual environment** - Recreated in correct location
3. ✅ **Gemini model** - Updated to gemini-2.0-flash-exp
4. ✅ **API route** - Now uses venv streamlit directly
5. ✅ **Cleanup** - Removed unnecessary test/debug files

## 🎯 Status: Ready to Use!
