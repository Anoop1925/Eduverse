"use client";

import { useState } from "react";
import { Hand, Image as ImageIcon, BookOpen, Sparkles, Pencil, Camera, Info } from "lucide-react";

type Tab = "drawInAir" | "imageReader" | "plotCrafter";

export default function Feature1Page() {
  const [activeTab, setActiveTab] = useState<Tab>("drawInAir");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const STREAMLIT_URL = "http://localhost:8501";

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, check if server is already running
      const checkResponse = await fetch('/api/magic-learn/start', {
        method: 'GET',
      });
      
      const checkData = await checkResponse.json();
      
      if (!checkData.running) {
        // Server not running, start it
        const startResponse = await fetch('/api/magic-learn/start', {
          method: 'POST',
        });
        
        const startData = await startResponse.json();
        
        if (!startData.success) {
          throw new Error(startData.message || 'Failed to start Magic Learn server');
        }
        
        // Wait a bit more for the server to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Open in new tab
      window.open(STREAMLIT_URL, "_blank");
      
      setLoading(false);
      
    } catch (err: any) {
      console.error('Error launching Magic Learn:', err);
      setError(err.message || 'Failed to launch Magic Learn. Please make sure Python and Streamlit are installed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Magic Learn</h1>
              <p className="text-base text-gray-500">AI-powered learning tools with gesture recognition and generative AI capabilities</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleLaunch}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Starting Server...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Magic Learn</span>
                  </>
                )}
              </button>
              {error && (
                <p className="text-red-600 text-xs max-w-xs text-right">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-0">
            <button
              onClick={() => setActiveTab("drawInAir")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "drawInAir"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Hand className="w-4 h-4" />
              DrawInAir
            </button>
            <button
              onClick={() => setActiveTab("imageReader")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "imageReader"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Image Reader
            </button>
            <button
              onClick={() => setActiveTab("plotCrafter")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "plotCrafter"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Plot Crafter
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* DrawInAir Tab */}
        {activeTab === "drawInAir" && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Hand className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">DrawInAir: Gesture-Based Learning</h2>
            </div>
            <p className="text-gray-500 mb-10">Draw mathematical equations and diagrams in the air using hand gestures</p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* How It Works */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-600 pt-1">Your webcam captures hand movements in real-time</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-600 pt-1">Draw equations or diagrams using simple hand gestures</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-600 pt-1">AI analyzes your drawing and provides instant feedback</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-600 pt-1">For equations, get step-by-step solutions and explanations</p>
                  </div>
                </div>
              </div>

              {/* Gesture Controls */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gesture Controls</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-purple-700 bg-purple-100/60 px-4 py-2 rounded-lg whitespace-nowrap">Thumb + Index</span>
                    <span className="text-gray-500">Start drawing</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-purple-700 bg-purple-100/60 px-4 py-2 rounded-lg whitespace-nowrap">Thumb + Middle</span>
                    <span className="text-gray-500">Erase drawing</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-purple-700 bg-purple-100/60 px-4 py-2 rounded-lg whitespace-nowrap">Thumb + Index + Middle</span>
                    <span className="text-gray-500">Move without drawing</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-purple-700 bg-purple-100/60 px-4 py-2 rounded-lg whitespace-nowrap">Thumb + Pinky</span>
                    <span className="text-gray-500">Clear canvas</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-purple-700 bg-purple-100/60 px-4 py-2 rounded-lg whitespace-nowrap">Index + Middle</span>
                    <span className="text-gray-500">Analyze/Calculate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI-Powered Analysis & Teaching Applications Sections */}
            <div className="space-y-12">
              {/* AI-Powered Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-500 mb-6">The DrawInAir feature uses Google's Gemini 1.5 Flash AI model to analyze your drawings and provide intelligent feedback:</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Mathematical Equations */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Pencil className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Mathematical Equations</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-blue-900 mb-1">Equation Recognition</div>
                        <div className="text-sm text-gray-600">Recognizes handwritten equations</div>
                      </div>
                      <div className="bg-blue-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-blue-900 mb-1">Step-by-Step Solutions</div>
                        <div className="text-sm text-gray-600">Provides detailed solutions</div>
                      </div>
                      <div className="bg-blue-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-blue-900 mb-1">Concept Explanation</div>
                        <div className="text-sm text-gray-600">Explains mathematical concepts</div>
                      </div>
                      <div className="bg-blue-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-blue-900 mb-1">Advanced Math Support</div>
                        <div className="text-sm text-gray-600">Works with basic and advanced math</div>
                      </div>
                    </div>
                  </div>

                  {/* Drawings & Diagrams */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Drawings & Diagrams</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-purple-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-purple-900 mb-1">Smart Recognition</div>
                        <div className="text-sm text-gray-600">Identifies what you've drawn</div>
                      </div>
                      <div className="bg-purple-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-purple-900 mb-1">Detailed Analysis</div>
                        <div className="text-sm text-gray-600">Provides descriptions and explanations</div>
                      </div>
                      <div className="bg-purple-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-purple-900 mb-1">Pattern Recognition</div>
                        <div className="text-sm text-gray-600">Recognizes shapes and patterns</div>
                      </div>
                      <div className="bg-purple-50 px-4 py-3 rounded-lg">
                        <div className="font-medium text-purple-900 mb-1">Skill Enhancement</div>
                        <div className="text-sm text-gray-600">Helps improve drawing skills</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom CTA */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500">
                Click the "Launch Magic Learn" button at the top to open the application
              </p>
            </div>
          </div>
        )}

        {/* Image Reader Tab */}
        {activeTab === "imageReader" && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Image Reader: Visual Analysis</h2>
            </div>
            <p className="text-gray-500 mb-10">Upload images and get AI-powered analysis and explanations</p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Key Features */}
              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-600 pt-1">Upload any image from your device</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-600 pt-1">Add specific text prompts to guide the AI analysis</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-600 pt-1">Get detailed AI explanations about the image content</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-600 pt-1">Perfect for analyzing diagrams, charts, and educational content</p>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-green-50/70 rounded-lg p-6 border border-green-100/70">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Analyze textbook diagrams and illustrations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Pencil className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Get explanations for complex charts and graphs</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Camera className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Understand scientific images and specimens</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Decode mathematical equations in images</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500">
                Click the "Launch Magic Learn" button at the top to open the application
              </p>
            </div>
          </div>
        )}

        {/* Plot Crafter Tab */}
        {activeTab === "plotCrafter" && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Plot Crafter: Creative Writing Assistant</h2>
            </div>
            <p className="text-gray-500 mb-10">Generate creative plots and stories for your projects</p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* How It Works */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-600 pt-1">Enter a theme or concept for your story or game</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-600 pt-1">AI generates a detailed plot based on your input</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-600 pt-1">Get character ideas, story arcs, and narrative elements</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-600 pt-1">Use the generated content for creative writing projects</p>
                  </div>
                </div>
              </div>

              {/* Educational Applications */}
              <div className="bg-purple-50/70 rounded-lg p-6 border border-purple-100/70">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Applications</h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Pencil className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Generate story prompts for writing assignments</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Create educational game scenarios</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Develop interactive learning narratives</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Craft historical or scientific scenarios</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500">
                Click the "Launch Magic Learn" button at the top to open the application
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
