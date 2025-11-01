"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Star, TrendingUp, Users, Award, Search, Filter, Globe, Calendar, BarChart3, X } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userEmail: string;
  displayName: string;
  points: number;
  totalCoursesCompleted: number;
  totalChaptersCompleted: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feature-5/leaderboard?filter=${timeFilter}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();
      setLeaderboard(data.leaderboard);
      setFilteredLeaderboard(data.leaderboard);

      // Find current user in leaderboard
      if (session?.user?.name) {
        console.log('Session user name:', session.user.name);
        const userName = session.user.name.toLowerCase();
        const userFirstName = session.user.name.split(' ')[0].toLowerCase();
        
        console.log('Looking for user with first name:', userFirstName);
        console.log('Leaderboard entries:', data.leaderboard.map((e: LeaderboardEntry) => e.displayName));
        
        const foundUser = data.leaderboard.find((entry: LeaderboardEntry) => {
          const entryName = entry.displayName.toLowerCase();
          const match = entryName.includes(userFirstName) || userName.includes(entryName.split(' ')[0]);
          console.log(`Checking ${entry.displayName} vs ${session?.user?.name}: ${match}`);
          return match;
        });
        
        console.log('Found user:', foundUser);
        setCurrentUserEntry(foundUser || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [timeFilter, session?.user?.name]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Filter leaderboard based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter((entry) =>
        entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeaderboard(filtered);
    }
  }, [searchQuery, leaderboard]);

  const getRankIcon = (rank: number) => {
    return <span className="text-sm font-bold text-white">{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-500";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-400";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-amber-600";
    return "bg-gray-200 text-gray-700";
  };

  const isCurrentUser = (entry: LeaderboardEntry) => {
    if (!session?.user?.name) {
      console.log('No session user name');
      return false;
    }
    const userName = session.user.name.toLowerCase();
    const userFirstName = session.user.name.split(' ')[0].toLowerCase();
    const entryName = entry.displayName.toLowerCase();
    const entryFirstName = entry.displayName.split(' ')[0].toLowerCase();
    
    const match = entryName.includes(userFirstName) || 
                  userName.includes(entryFirstName) ||
                  userFirstName === entryFirstName;
    
    if (match) {
      console.log(`MATCH FOUND: ${entry.displayName} matches ${session.user.name}`);
    }
    
    return match;
  };

  // Generate consistent color for each user based on their name
  const getUserAvatarColor = (displayName: string) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600",
      "bg-gradient-to-r from-red-500 to-red-600",
      "bg-gradient-to-r from-orange-500 to-orange-600",
      "bg-gradient-to-r from-teal-500 to-teal-600",
      "bg-gradient-to-r from-cyan-500 to-cyan-600",
      "bg-gradient-to-r from-rose-500 to-rose-600",
    ];
    
    // Use name's char codes to generate consistent color index
    const hash = displayName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-[#444fd6] mx-auto mb-4"></div>
            <Trophy className="w-5 h-5 text-[#444fd6] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-700 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#444fd6] to-[#5d87ee] rounded-2xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Compete with learners worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#d0dffc] rounded-xl">
              <Users className="w-5 h-5 text-[#444fd6]" />
              <span className="text-sm font-semibold text-gray-700">{leaderboard.length} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-2xl border-2 border-[#d0dffc] p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{leaderboard.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#d0dffc] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#444fd6]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-yellow-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {currentUserEntry ? "Your Score" : session?.user?.name ? "Your Score" : "Top Score"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentUserEntry ? `${currentUserEntry.points} pts` : (leaderboard[0]?.points ? `${leaderboard[0].points} pts` : "0 pts")}
                </p>
                {currentUserEntry && (
                  <p className="text-xs text-gray-500 mt-1">Rank #{currentUserEntry.rank}</p>
                )}
                {!currentUserEntry && session?.user?.name && leaderboard.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Not yet ranked</p>
                )}
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-green-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaderboard.length > 0 
                    ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.points, 0) / leaderboard.length)
                    : 0} pts
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search learners by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#444fd6] focus:border-[#444fd6] transition-all text-sm text-gray-700 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center transition-all"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Time Filter Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#d0dffc] rounded-xl">
                <Filter className="text-[#444fd6] w-4 h-4" />
                <span className="text-xs font-semibold text-[#444fd6]">Time:</span>
              </div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as "all" | "month" | "week")}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#444fd6] focus:border-[#444fd6] bg-white text-sm text-gray-700 font-medium cursor-pointer hover:border-gray-300 transition-all appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1rem 1rem',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <option value="all">All Time</option>
                <option value="month">Monthly</option>
                <option value="week">Weekly</option>
              </select>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Found <span className="font-semibold text-[#444fd6]">{filteredLeaderboard.length}</span> result{filteredLeaderboard.length !== 1 ? 's' : ''} for <span className="font-medium text-gray-900">"{searchQuery}"</span>
              </p>
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
          {error ? (
            <div className="p-8 text-center">
              <Award className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <Award className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">
                {searchQuery ? `No results found for "${searchQuery}"` : "No leaderboard data available yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Courses Completed
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Chapters Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLeaderboard.map((entry, index) => {
                    const isCurrent = isCurrentUser(entry);
                    return (
                      <tr
                        key={entry.userEmail}
                        className={`transition-all ${
                          isCurrent 
                            ? "bg-[#e8f0fe] border-l-4 border-[#444fd6] shadow-sm" 
                            : index < 3 ? "bg-blue-50/30 hover:bg-gray-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)} ${entry.rank <= 3 ? '' : 'text-gray-700'} ${isCurrent ? 'ring-2 ring-[#444fd6] ring-offset-2' : ''}`}>
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getUserAvatarColor(entry.displayName)} flex items-center justify-center ${isCurrent ? 'ring-2 ring-[#444fd6] ring-offset-2' : ''}`}>
                              <span className="text-white font-semibold text-sm">
                                {entry.displayName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isCurrent ? 'font-bold text-[#444fd6]' : 'font-medium text-gray-900'}`}>
                                {entry.displayName}
                              </span>
                              {isCurrent && (
                                <span className="px-2.5 py-0.5 bg-[#444fd6] text-white text-xs font-bold rounded-full shadow-sm">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className={`text-sm ${isCurrent ? 'font-bold text-[#444fd6]' : 'font-semibold text-gray-900'}`}>
                              {entry.points.toLocaleString()} pts
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${isCurrent ? 'font-bold text-[#444fd6]' : 'font-medium text-gray-700'}`}>
                            {entry.totalCoursesCompleted}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${isCurrent ? 'font-bold text-[#444fd6]' : 'font-medium text-gray-700'}`}>
                            {entry.totalChaptersCompleted}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 