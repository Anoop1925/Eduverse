"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Megaphone, BookOpen, ClipboardList, Hand } from "lucide-react"; // Icon imports
import { addDays, format, isSameDay } from 'date-fns';

interface Course {
  id: string;
  name: string;
  section?: string;
}

interface Announcement {
  id: string;
  text: string;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({});
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (session === null) {
      router.push("/auth");
    }
  }, [session, router]);

  useEffect(() => {
    if (!session?.accessToken) return;

    fetch("https://classroom.googleapis.com/v1/courses", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        if (data.courses?.[0]) setSelectedCourseId(data.courses[0].id);
      });
  }, [session]);

  useEffect(() => {
    if (!session?.accessToken || !selectedCourseId) return;

    fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourseId}/announcements`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements((prev) => ({
          ...prev,
          [selectedCourseId]: data.announcements || [],
        }));
      });

    fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourseId}/courseWork`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAssignments((prev) => ({
          ...prev,
          [selectedCourseId]: data.courseWork || [],
        }));
      });
  }, [selectedCourseId, session]);

  // --- Dashboard Layout ---
  // Helper for next 5 days including today
  const today = new Date();
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(today, i));
  const dayColors = ["bg-red-400", "bg-green-400", "bg-blue-400", "bg-purple-400", "bg-pink-400"];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#1e3a8a]">
          <Hand className="text-yellow-400 w-7 h-7" />
          Welcome{session?.user?.name ? `, ${session.user.name}` : ''}
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 px-8 py-8">
        {/* Main Left Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Announcements Card */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#1e3a8a] mb-4">
              <Megaphone className="text-pink-400 w-5 h-5" />
              Announcements
            </h2>
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">
              {announcements[selectedCourseId || ""]?.length > 0 ? (
                announcements[selectedCourseId || ""].map((a) => (
                  <div key={a.id} className="p-3 border rounded-md bg-gradient-to-r from-gray-50 to-blue-50">
                    <p className="text-sm">{a.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm italic text-gray-500">No announcements yet.</p>
              )}
            </div>
          </div>
          {/* Classes Table */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#1e3a8a] mb-4">
              <BookOpen className="text-green-400 w-5 h-5" />
              Your Classes
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-2 px-3 font-semibold">Name</th>
                    <th className="py-2 px-3 font-semibold">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    (showAllCourses ? courses : courses.slice(0, 6)).map((course) => (
                      <tr
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`cursor-pointer transition select-none ${
                          selectedCourseId === course.id
                            ? 'bg-blue-100 border-l-4 border-blue-600'
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        <td className="py-2 px-3 font-medium text-[#1e3a8a]">{course.name}</td>
                        <td className="py-2 px-3 text-gray-500">{course.section}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-400">No classes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {courses.length > 6 && (
              <button
                onClick={() => setShowAllCourses(!showAllCourses)}
                className="text-sm text-blue-600 mt-2 hover:underline"
              >
                {showAllCourses ? "Show Less" : "Show All Classes"}
              </button>
            )}
          </div>
        </div>
        {/* Right Side: Profile + Assignments */}
        <div className="w-full lg:w-[340px] flex flex-col gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col items-center">
            <div className="w-full text-left font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="text-blue-400 w-5 h-5" />
              Profile
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 shadow mb-3 mx-auto overflow-hidden bg-gray-100 flex items-center justify-center">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-xl">
                          ${session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-xl">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-[#1e3a8a]">{session?.user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{session?.user?.email || 'No email'}</div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-gray-700">{format(new Date(), 'EEEE, dd MMMM')}</div>
            </div>
            {/* Date Selector */}
            <div className="flex justify-center gap-3 mt-6">
              {weekDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl font-semibold text-sm mb-1 transition-all cursor-pointer hover:bg-blue-100
                      ${isSameDay(d, today) ? 'bg-[#1e3a8a] text-white shadow-lg' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setDate(d)}
                  >
                    <div>{format(d, 'dd')}</div>
                    <div className="text-[11px] font-normal">{format(d, 'EEE')}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${dayColors[i % dayColors.length]}`}></div>
                </div>
              ))}
            </div>
          </div>
          {/* Assignments Cards */}
          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#1e3a8a] mb-2">
              <ClipboardList className="text-purple-400 w-5 h-5" />
              Assignments
            </h2>
            {assignments[selectedCourseId || ""]?.length > 0 ? (
              assignments[selectedCourseId || ""].map((assignment) => (
                <div key={assignment.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-400 rounded-xl p-4 shadow flex flex-col gap-1">
                  <div className="font-semibold text-indigo-900">{assignment.title}</div>
                  {assignment.description && (
                    <div className="text-xs text-gray-600">{assignment.description}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm italic text-gray-400">No assignments yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
