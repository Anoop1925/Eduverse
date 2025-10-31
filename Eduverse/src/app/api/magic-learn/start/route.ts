import { NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

let streamlitProcess: any = null;

async function isPortInUse(port: number): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

async function checkStreamlitInstalled(): Promise<boolean> {
  try {
    // Check if streamlit exists in venv (parent directory of project root)
    const projectRoot = process.cwd();
    const parentDir = path.dirname(projectRoot);
    const venvStreamlitPath = path.join(parentDir, 'venv', 'Scripts', 'streamlit.exe');
    
    if (fs.existsSync(venvStreamlitPath)) {
      console.log('Found Streamlit in venv:', venvStreamlitPath);
      return true;
    }
    // Fallback to global streamlit
    await execAsync('streamlit --version');
    return true;
  } catch {
    return false;
  }
}

export async function POST() {
  try {
    // Check if Streamlit is installed
    const streamlitInstalled = await checkStreamlitInstalled();
    if (!streamlitInstalled) {
      return NextResponse.json({ 
        success: false, 
        message: 'Streamlit is not installed. Please install it with: pip install streamlit'
      }, { status: 500 });
    }

    // Check if Streamlit is already running on port 8501
    const portInUse = await isPortInUse(8501);
    
    if (portInUse) {
      return NextResponse.json({ 
        success: true, 
        message: 'Streamlit server is already running',
        url: 'http://localhost:8501'
      });
    }

    // Check if app.py exists
    const streamlitPath = path.join(process.cwd(), 'src', 'app', 'feature-1', 'app.py');
    if (!fs.existsSync(streamlitPath)) {
      return NextResponse.json({ 
        success: false, 
        message: `Streamlit app not found at: ${streamlitPath}`
      }, { status: 500 });
    }

    // Start Streamlit server in background
    console.log('Starting Streamlit server at:', streamlitPath);
    
    // Use VBScript to launch batch file silently (no window flash)
    const projectRoot = process.cwd();
    const vbsScriptPath = path.join(projectRoot, 'start-streamlit-silent.vbs');
    
    if (!fs.existsSync(vbsScriptPath)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Startup script not found at: ' + vbsScriptPath
      }, { status: 500 });
    }
    
    console.log('Launching Streamlit silently via VBScript:', vbsScriptPath);
    
    // Spawn VBScript which will run the batch file completely hidden
    streamlitProcess = spawn('wscript.exe', [vbsScriptPath], {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'],
      cwd: projectRoot,
      windowsHide: true
    });

    // Unref so the parent process can exit independently
    streamlitProcess.unref();

    // Wait for the server to start and verify it's running
    let attempts = 0;
    const maxAttempts = 30; // Increased to 30 seconds for more reliable startup
    
    console.log('Waiting for Streamlit server to start on port 8501...');
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isRunning = await isPortInUse(8501);
      
      if (isRunning) {
        console.log(`Streamlit server is running on port 8501 (took ${attempts + 1} seconds)`);
        return NextResponse.json({ 
          success: true, 
          message: 'Streamlit server started successfully',
          url: 'http://localhost:8501',
          startupTime: attempts + 1
        });
      }
      
      console.log(`Attempt ${attempts + 1}/${maxAttempts} - Server not responding yet...`);
      attempts++;
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Server startup timeout. Please run debug-magic-learn.bat to diagnose the issue.',
      details: 'The server did not respond on port 8501 within 30 seconds.'
    }, { status: 500 });

  } catch (error: any) {
    console.error('Error starting Streamlit:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to start Streamlit server'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const portInUse = await isPortInUse(8501);
    
    return NextResponse.json({ 
      running: portInUse,
      url: portInUse ? 'http://localhost:8501' : null
    });
  } catch (error: any) {
    return NextResponse.json({ 
      running: false,
      error: error.message
    }, { status: 500 });
  }
}
