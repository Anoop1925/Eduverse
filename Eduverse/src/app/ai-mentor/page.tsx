"use client";

import { useState } from "react";
import AiMentorUI from "@/components/ai-mentor/AiMentorUI";
import { Sparkles, Info, Bot, MessageCircle, Zap, Mic, Brain, BookOpen, Lightbulb, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

// About Content Component
const AboutContent = () => {
  return (
    <div className="space-y-12">
      {/* How It Works Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">1. Start Voice Call</h3>
              <p className="text-sm text-gray-600">
                Click the start button to begin your voice conversation with AskSensei
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">2. Ask Questions</h3>
              <p className="text-sm text-gray-600">
                Speak naturally about any topic - homework help, concept clarification, or study tips
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">3. Get AI Responses</h3>
              <p className="text-sm text-gray-600">
                AskSensei listens and responds with clear, helpful explanations in real-time
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">4. Learn Interactively</h3>
              <p className="text-sm text-gray-600">
                Have natural conversations to deepen understanding and master any subject
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Mic className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-gray-900">Voice-First Learning</h3>
            </div>
            <p className="text-sm text-gray-600">
              Natural voice conversations powered by advanced AI technology
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">24/7 Availability</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get instant help anytime, anywhere - your personal tutor is always ready
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">All Subjects Covered</h3>
            </div>
            <p className="text-sm text-gray-600">
              From Math to History, Science to Literature - comprehensive subject support
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Adaptive Learning</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI adapts to your learning pace and style for personalized education
            </p>
          </div>
        </div>
      </div>

      {/* Perfect For Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Homework Help</h4>
            <p className="text-sm text-gray-600">Get instant explanations for tough problems</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Concept Clarity</h4>
            <p className="text-sm text-gray-600">Understand difficult topics through conversation</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Exam Prep</h4>
            <p className="text-sm text-gray-600">Practice and prepare with voice-based tutoring</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Quick Answers</h4>
            <p className="text-sm text-gray-600">Fast responses to urgent study questions</p>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Speak clearly and naturally - AskSensei understands conversational language</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ask follow-up questions to dive deeper into any topic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use it for both homework help and general learning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Make sure your microphone permissions are enabled</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AiMentorPage() {
  const [activeTab, setActiveTab] = useState<"about" | "chat">("about");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AskSensei</h1>
              <p className="text-base text-gray-500">
                Your AI-powered voice learning companion - available 24/7
              </p>
            </div>
            <button
              onClick={() => setActiveTab("chat")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-0">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "about"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Info className="w-4 h-4" />
              About
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "chat"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Bot className="w-4 h-4" />
              Voice Chat
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* About Tab */}
        {activeTab === "about" && <AboutContent />}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <AiMentorUI imageSrc="/ai-mentor-avatar.png" />
          </div>
        )}
      </div>
    </div>
  );
}
