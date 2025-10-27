"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Home, FileText, BarChart2, MessageSquare, Mic, Trophy } from "lucide-react";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAllCourses] = useState(false); // Placeholder, can be extended if needed

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/auth" });
  };

  const navLinks = [
    { label: "Magic Learn", route: "/feature-1", icon: <Home size={18} className="text-blue-500" /> },
    { label: "AI-Course", route: "/feature-2", icon: <FileText size={18} className="text-green-500" /> },
    { label: "Quiz Generator", route: "/feature-3", icon: <BarChart2 size={18} className="text-purple-500" /> },
    { label: "Leaderboard", route: "/feature-5", icon: <Trophy size={18} className="text-yellow-500" /> },
    { label: "AI-MENTOR", route: "/ai-mentor", icon: <Mic size={18} className="text-pink-500" /> },
    { label: "Hands-On Coding", route: "/feature-4", icon: <MessageSquare size={18} className="text-orange-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] to-[#e0e7ff] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white/60 backdrop-blur-lg shadow-2xl px-6 py-8 hidden lg:flex flex-col justify-between border-r border-white/30 rounded-tr-3xl rounded-br-3xl">
        <div className="flex flex-col gap-8 flex-1">
          {session?.user && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center gap-3 focus:outline-none group"
              style={{ background: 'none', border: 'none', padding: 0 }}
              aria-label="Go to Dashboard"
            >
              {session.user.image && (
                <Image src={session.user.image} alt="Profile" width={72} height={72} className="rounded-full border-4 border-blue-200 shadow-lg transition-transform duration-300 group-hover:scale-105" />
              )}
              <div className="text-center text-sm">
                <p className="font-semibold text-[#1e3a8a] text-lg group-hover:underline">{session.user.name}</p>
              </div>
            </button>
          )}

          <h2
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-400 text-center tracking-tight drop-shadow-lg cursor-pointer hover:underline"
            onClick={() => router.push('/')}
            role="button"
            tabIndex={0}
            aria-label="Go to landing page"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/'); }}
          >
            EduVerse
          </h2>

          <nav className="flex flex-col gap-4 flex-1 overflow-y-auto min-h-0">
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.route)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-white shadow hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 text-[#1e3a8a] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {item.icon}
                <span className="text-base font-semibold">{item.label}</span>
              </button>
            ))}
            {/* Logout button directly after nav links */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:from-red-500 hover:to-red-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 mt-4"
              aria-label="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-6 py-10 space-y-10">{children}</main>
    </div>
  );
} 