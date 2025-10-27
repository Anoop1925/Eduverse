'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

type AiMentorUIProps = {
  imageSrc: string;
};

const AiMentorUI = ({ imageSrc }: AiMentorUIProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.5);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    // Check if environment variables are available
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    // Debug logging
    console.log('🔍 Environment variables check:');
    console.log('Public Key exists:', !!publicKey);
    console.log('Assistant ID exists:', !!assistantId);
    console.log('Public Key length:', publicKey?.length);
    console.log('Assistant ID length:', assistantId?.length);

    if (!publicKey || !assistantId) {
      const missingVars = [];
      if (!publicKey) missingVars.push('NEXT_PUBLIC_VAPI_PUBLIC_KEY');
      if (!assistantId) missingVars.push('NEXT_PUBLIC_VAPI_ASSISTANT_ID');
      
      setError(`Vapi configuration is missing: ${missingVars.join(', ')}. Please set these environment variables.`);
      return;
    }

    try {
      console.log('🚀 Initializing Vapi with public key:', publicKey.substring(0, 8) + '...');
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        console.log('📞 Call started');
        setIsSpeaking(true);
        setCallStarted(true);
        setError(null);
      });

      vapi.on('call-end', () => {
        console.log('🛑 Call ended');
        setIsSpeaking(false);
        setCallStarted(false);
      });

      vapi.on('error', (e: any) => {
        console.error('❗ Vapi error:', e);
        setIsSpeaking(false);
        setCallStarted(false);
        setError(e?.message || 'An error occurred with the Vapi service');
      });

      console.log('✅ Vapi initialized successfully');
      return () => {
        if (vapiRef.current) {
          vapiRef.current.stop();
        }
      };
    } catch (err: any) {
      console.error('Failed to initialize Vapi:', err);
      setError(err?.message || 'Failed to initialize Vapi service');
    }
  }, []);

  const handleStartCall = async () => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!assistantId) {
      setError('Assistant ID is not configured');
      return;
    }

    if (!vapiRef.current) {
      setError('Vapi is not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🎯 Starting call with assistant ID:', assistantId);
      await vapiRef.current.start(assistantId);
    } catch (err: any) {
      console.error('Failed to start call:', err);
      setError(err?.message || 'Failed to start call');
      setIsLoading(false);
    }
  };

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setIsLoading(false);
  };

  const handleAudioLevelChange = (level: number) => {
    setAudioLevel(level);
  };

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc]">
        <div className="max-w-md w-full mx-auto rounded-3xl p-8 shadow-2xl border border-white/30 bg-white/80">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Configuration Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 text-left w-full">
              <p className="font-semibold mb-2">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root</li>
                <li>Add your Vapi credentials:</li>
                <li className="ml-4">
                  <code className="bg-gray-200 px-1 rounded block mt-1">
                    NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_public_key_here
                  </code>
                </li>
                <li className="ml-4">
                  <code className="bg-gray-200 px-1 rounded block mt-1">
                    NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
                  </code>
                </li>
                <li>Restart your development server</li>
              </ol>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-4 text-center bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc] gap-8">
      {/* Only render the static avatar image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt="AI Mentor Avatar"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* AI Mentor UI Card */}
      <div className="relative max-w-md w-full mx-auto rounded-3xl p-8 shadow-2xl border border-white/30 bg-transparent" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
        {/* Animated glowing border and floating avatar */}
        <div className="flex flex-col items-center">
          <div className={`relative w-32 h-32 mb-4 flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'animate-glow border-4 border-indigo-400/80' : 'border-2 border-gray-200'} transition-all`}></div>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-200/60 to-indigo-400/30 blur-2xl ${isSpeaking ? 'animate-pulse' : ''}`}></div>
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-14 h-14 ${isSpeaking ? 'text-white drop-shadow-lg' : 'text-indigo-100'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a2 2 0 00-2 2v6a2 2 0 004 0V4a2 2 0 00-2-2z" />
                <path
                  fillRule="evenodd"
                  d="M4 10a6 6 0 0012 0h-1.5a4.5 4.5 0 01-9 0H4z"
                  clipRule="evenodd"
                />
                <path d="M9 18h2v-2H9v2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xl font-semibold text-indigo-700 drop-shadow-sm">
            AI Voice Mentor
          </p>
          <p className="mt-1 text-base font-medium text-gray-600">
            {isSpeaking ? (
              <span className="flex items-center gap-2 animate-pulse text-indigo-600">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                Assistant is listening...
              </span>
            ) : (
              'Click Start to begin your immersive session'
            )}
          </p>
        </div>
        <div className="flex flex-col items-center mt-8">
          {!callStarted ? (
            <button
              onClick={handleStartCall}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2">
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                )}
                {isLoading ? 'Starting...' : 'Start Call'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                End Call
              </span>
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-glow {
          box-shadow: 0 0 32px 8px rgba(99, 102, 241, 0.4), 0 0 64px 16px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
};

export default AiMentorUI;
