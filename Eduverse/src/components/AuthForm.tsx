'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <motion.div 
      className="p-8 bg-white/10 rounded-3xl max-w-md w-full text-white backdrop-blur-md border border-white/20 relative overflow-hidden group"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)"
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-ping" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20 w-full justify-center"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">Welcome to EduVerse</span>
        </motion.div>

        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          {isSignUp ? "Sign Up" : "Sign In"} to EduVerse
        </h1>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white py-3 mb-4 border border-white/20 rounded-xl shadow-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#EA4335" d="M24 9.5c3.15 0 5.75 1.1 7.66 2.89l5.7-5.7C33.39 3.21 28.98 1.5 24 1.5 14.84 1.5 7.19 7.84 4.68 16.26l6.95 5.4C13.29 14.75 18.19 9.5 24 9.5z"/>
              <path fill="#34A853" d="M43.63 20.26H24v7.5h11.4c-1.34 3.58-4.39 6.44-8.4 7.5l6.95 5.4C40.81 36.16 44 30.07 44 24c0-.97-.1-1.92-.27-2.84l-.1-.9z"/>
              <path fill="#FBBC05" d="M10.38 28.84C9.42 26.65 9 24.38 9 22c0-2.38.42-4.65 1.38-6.84L3.43 9.76C1.26 13.1 0 17.42 0 22s1.26 8.9 3.43 12.24l6.95-5.4z"/>
              <path fill="#4285F4" d="M24 44.5c6.56 0 12.08-2.16 16.1-5.86l-6.95-5.4c-2.13 1.43-4.86 2.26-8.15 2.26-5.81 0-10.71-5.25-12.37-12.16l-6.95 5.4C7.19 40.16 14.84 44.5 24 44.5z"/>
            </svg>
            <span className="text-white font-medium">
              {isSignUp ? "Sign up" : "Sign in"} with Google
            </span>
          </Button>
        </motion.div>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/20" />
          <span className="px-4 text-gray-300 text-sm">or</span>
          <div className="flex-grow h-px bg-white/20" />
        </div>

        {isSignUp && (
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input 
              placeholder="First name" 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20"
            />
            <Input 
              placeholder="Last name" 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20"
            />
          </motion.div>
        )}

        <Input 
          type="email" 
          placeholder="Email address" 
          className="mb-4 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20" 
        />
        <Input 
          type="password" 
          placeholder="Password" 
          className="mb-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20" 
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <span className="flex items-center gap-2">
              CONTINUE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </motion.div>

        <p className="text-center text-sm mt-6 text-gray-300">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-300 hover:to-blue-300 font-medium transition-all duration-300"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </motion.div>
  );
}
