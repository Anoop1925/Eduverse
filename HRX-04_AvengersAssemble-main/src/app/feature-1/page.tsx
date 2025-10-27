"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Feature1Page() {
  const [loading, setLoading] = useState(false);
  // Set your Streamlit app URL here
  const STREAMLIT_URL = "http://localhost:8501"; // <-- Change if needed

  const handleLaunch = () => {
    setLoading(true);
    setTimeout(() => {
      window.open(STREAMLIT_URL, "_blank");
      setLoading(false);
    }, 1200); // Simulate loading
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc] px-4">
      <div className="relative max-w-2xl w-full mx-auto rounded-3xl p-16 shadow-2xl border border-white/30 bg-white/80 flex flex-col items-center" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Magic Learn AI Launcher
        </h1>
        {loading ? (
          <div className="flex flex-col items-center gap-4 my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-2"></div>
            <div className="text-blue-600 font-semibold text-lg">
              Launching Streamlit App...
            </div>
          </div>
        ) : (
          <Button
            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onClick={handleLaunch}
          >
            Enter into Magic Learning
          </Button>
        )}
      </div>
    </div>
  );
}
