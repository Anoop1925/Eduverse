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
      <div className="flex flex-col items-center justify-center w-full py-8 px-4 text-center">
        <div className="max-w-md w-full mx-auto rounded-xl p-8 shadow-sm border border-red-200 bg-red-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="bg-white p-4 rounded-lg text-sm text-gray-700 text-left w-full border border-gray-200">
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
              className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 text-center gap-8">
      {/* AI Mentor UI Card */}
      <div className="relative max-w-md w-full mx-auto rounded-xl p-8 shadow-sm border border-gray-200 bg-white">
        {/* Avatar and Status */}
        <div className="flex flex-col items-center">
          <div className={`relative w-32 h-32 mb-6 flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'border-4 border-purple-400 shadow-lg shadow-purple-200' : 'border-2 border-gray-200'} transition-all`}></div>
            <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'bg-purple-100 animate-pulse' : 'bg-gray-50'} transition-all`}></div>
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-14 h-14 text-white`}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            EduBuddy Voice Chat
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {isSpeaking ? (
              <span className="flex items-center gap-2 text-purple-600 font-medium">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                Listening and responding...
              </span>
            ) : (
              'Click start to begin your voice learning session'
            )}
          </p>
        </div>
        <div className="flex flex-col items-center">
          {!callStarted ? (
            <button
              onClick={handleStartCall}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:bg-gray-400 text-white rounded-lg font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2">
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                )}
                {isLoading ? 'Connecting...' : 'Start Voice Chat'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                End Call
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMentorUI;
