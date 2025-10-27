'use client';

import AuthForm from '../../components/AuthForm';
import { motion } from "framer-motion";

// Predefined particle positions and animations to avoid hydration mismatch
const particles = [
  { left: "10%", top: "20%", delay: "0.5s", duration: "4.2s" },
  { left: "85%", top: "15%", delay: "1.2s", duration: "5.8s" },
  { left: "25%", top: "80%", delay: "2.1s", duration: "3.9s" },
  { left: "70%", top: "90%", delay: "0.8s", duration: "6.1s" },
  { left: "45%", top: "35%", delay: "1.8s", duration: "4.7s" },
  { left: "15%", top: "65%", delay: "2.5s", duration: "5.3s" },
  { left: "80%", top: "45%", delay: "0.3s", duration: "4.8s" },
  { left: "35%", top: "10%", delay: "1.6s", duration: "6.2s" },
  { left: "60%", top: "75%", delay: "2.3s", duration: "3.7s" },
  { left: "5%", top: "50%", delay: "1.0s", duration: "5.5s" },
  { left: "90%", top: "25%", delay: "1.9s", duration: "4.4s" },
  { left: "20%", top: "85%", delay: "0.7s", duration: "5.9s" },
  { left: "75%", top: "60%", delay: "2.0s", duration: "4.1s" },
  { left: "30%", top: "40%", delay: "1.4s", duration: "6.0s" },
  { left: "55%", top: "95%", delay: "0.9s", duration: "3.8s" }
];

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Background Beams - Same as main page */}
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
          <div className="absolute top-3/4 left-0 w-full h-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse animation-delay-1500"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/15 to-transparent animate-pulse animation-delay-2500"></div>
          
          {/* Diagonal Beams */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-purple-500/10 to-transparent animate-pulse animation-delay-3000"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-blue-500/10 to-transparent animate-pulse animation-delay-3500"></div>
          </div>
          
          {/* Floating Particles - Using predefined positions */}
          <div className="absolute inset-0">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AuthForm />
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
    </div>
  );
}
