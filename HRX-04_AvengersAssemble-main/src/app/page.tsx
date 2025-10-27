"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Brain, 
  Hand, 
  BookOpen, 
  Users, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Play,
  Trophy,
  Target,
  Lightbulb
} from "lucide-react";

const features = [
  {
    icon: <Code2 className="w-12 h-12" />,
    title: "Hands-on Coding",
    description: "Practice coding with real-time feedback and AI-powered code analysis",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    icon: <Brain className="w-12 h-12" />,
    title: "AI Mentor",
    description: "Personal AI companion that guides you through your learning journey",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
  {
    icon: <Hand className="w-12 h-12" />,
    title: "Gesture-Based Quiz",
    description: "Take interactive quizzes using hand gestures for an immersive experience",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    icon: <BookOpen className="w-12 h-12" />,
    title: "Smart Learning",
    description: "AI-generated courses tailored to your learning style and pace",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20"
  },
  {
    icon: <Users className="w-12 h-12" />,
    title: "Collaborative Learning",
    description: "Learn together with peers in an interactive and engaging environment",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: "Real-time Progress",
    description: "Track your learning progress with detailed analytics and insights",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20"
  }
];

const stats = [
  { number: "10K+", label: "Active Learners", icon: <Users className="w-6 h-6" /> },
  { number: "500+", label: "AI-Generated Courses", icon: <BookOpen className="w-6 h-6" /> },
  { number: "95%", label: "Success Rate", icon: <Trophy className="w-6 h-6" /> },
  { number: "24/7", label: "AI Support", icon: <Brain className="w-6 h-6" /> }
];

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Background Beams */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Background Beams */}
        <div className="absolute inset-0">
          {/* Vertical Beams */}
          <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse"></div>
          <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-pulse animation-delay-1000"></div>
          <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent animate-pulse animation-delay-2000"></div>
          
          {/* Horizontal Beams */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse animation-delay-500"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse animation-delay-1500"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/15 to-transparent animate-pulse animation-delay-2500"></div>
          
          {/* Diagonal Beams */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-purple-500/10 to-transparent animate-pulse animation-delay-3000"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-blue-500/10 to-transparent animate-pulse animation-delay-3500"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 sm:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Welcome to EduVerse
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one edutech platform to learn, grow, and master new skills using 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold"> smart AI-assisted features</span>
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => window.location.href = "/auth"}
              className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg px-12 py-6 font-bold shadow-2xl rounded-2xl border-2 border-purple-400/40 backdrop-blur-md transition-all duration-300 transform hover:shadow-[0_20px_40px_rgba(147,51,234,0.3)] hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-400/40 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Learning Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Carousel */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Our Amazing Features
            </h2>
            <p className="text-gray-400 text-lg">
              Experience the future of learning with cutting-edge AI technology
            </p>
          </motion.div>

          <motion.div 
            className="relative h-80 overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
              isHovered 
                ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-100' 
                : 'opacity-0'
            }`} />
            
            {/* Animated Border */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
              isHovered 
                ? 'border-2 border-purple-400/50' 
                : 'border border-white/10'
            }`} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <motion.div 
                  className={`w-full max-w-4xl mx-auto text-center ${features[currentFeature].bgColor} rounded-2xl p-8 border ${features[currentFeature].borderColor} relative overflow-hidden`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Feature Card Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${features[currentFeature].color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${features[currentFeature].color} mb-6 shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {features[currentFeature].icon}
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 group-hover:text-white transition-colors duration-300">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto relative z-10 group-hover:text-gray-200 transition-colors duration-300">
                    {features[currentFeature].description}
                  </p>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-ping" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Enhanced Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeature 
                      ? 'bg-white scale-125 shadow-lg shadow-white/50' 
                      : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <motion.button
              onClick={() => setCurrentFeature((prev) => (prev - 1 + features.length) % features.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentFeature((prev) => (prev + 1) % features.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Stats Card Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent relative z-10">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium relative z-10 group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-md border border-purple-500/20 relative overflow-hidden group">
            {/* CTA Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Lightbulb className="w-16 h-16 mx-auto mb-6 text-yellow-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-gray-300 mb-8 text-lg relative z-10">
              Join thousands of learners who are already experiencing the future of education
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
            >
              <Button
                onClick={() => window.location.href = "/auth"}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-2500 {
          animation-delay: 2.5s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-3500 {
          animation-delay: 3.5s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
