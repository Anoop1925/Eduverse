"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PlusCircle, Book } from "lucide-react";
import { Course } from "@/types/feature-2";
import CourseFormModal from "./CourseFormModal";
import Link from "next/link";

export default function Feature2Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/feature-2/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
    }
    fetchCourses();
  }, []);

  const handleCourseCreated = async (formData: {
    name: string;
    description: string;
    category: string;
    level: string;
    includeVideo: boolean;
    noOfChapters: number;
  }) => {
    const res = await fetch("/api/feature-2/generate-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to generate course");
    }
    const { course } = await res.json();
    const storeRes = await fetch("/api/feature-2/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course }),
    });
    if (!storeRes.ok) {
      throw new Error("Failed to save course");
    }
    await storeRes.json(); // If you need to link this course to user_progress or points_history, use the returned courseId
    setShowModal(false);
    const coursesRes = await fetch("/api/feature-2/courses");
    if (coursesRes.ok) {
      const data = await coursesRes.json();
      setCourses(data.courses);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Course Generator</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={20} /> Create New Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            No courses yet. Click &quot;Create New Course&quot; to get started!
          </div>
        ) : (
          courses.map((course) => {
            const total = course.noOfChapters || (course.chapters?.length ?? 0);
            const completed = Math.floor(Math.random() * (total + 1));
            return (
              <Link key={course.cid} href={`/feature-2/${course.cid}`}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                  {/* Course Banner Image */}
                  <div className="w-full h-48 relative bg-gradient-to-br from-blue-50 to-indigo-100">
                    {course.bannerImageUrl ? (
                      <Image
                        src={course.bannerImageUrl}
                        alt={`${course.name} course banner`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Book size={48} className="text-blue-400 mx-auto mb-2" />
                          <p className="text-blue-600 font-medium text-sm">{course.name}</p>
                        </div>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {course.category}
                      </span>
                    </div>
                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {course.level}
                      </span>
                    </div>
                  </div>
                  {/* Course Details */}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h2>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      {/* Left: Icon and Chapters */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Book size={18} />
                        <span className="text-sm font-medium">Chapters: {total}</span>
                      </div>
                      {/* Right: Level Status */}
                      <span className="text-sm font-medium text-blue-700 capitalize">{course.level}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{completed}/{total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${(completed / total) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <CourseFormModal open={showModal} onClose={() => setShowModal(false)} onCourseCreated={handleCourseCreated} />
    </div>
  );
}