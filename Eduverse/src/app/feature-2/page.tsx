"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PlusCircle, Book, Info, Sparkles, GraduationCap, Video, FileText, Zap } from "lucide-react";
import { Course } from "@/types/feature-2";
import CourseFormModal from "./CourseFormModal";
import Link from "next/link";

type Tab = "about" | "myCourses";

export default function Feature2Page() {
  const [activeTab, setActiveTab] = useState<Tab>("about");
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
    await storeRes.json();
    setShowModal(false);
    const coursesRes = await fetch("/api/feature-2/courses");
    if (coursesRes.ok) {
      const data = await coursesRes.json();
      setCourses(data.courses);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Course Generator</h1>
              <p className="text-base text-gray-500">Transform any topic into a comprehensive, structured course with AI-powered content generation</p>
            </div>
            <button
              onClick={() => {
                setActiveTab("myCourses");
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Course</span>
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
              onClick={() => setActiveTab("myCourses")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "myCourses"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              My Courses
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* About Tab */}
        {activeTab === "about" && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">AI-Powered Course Generation</h2>
            </div>
            <p className="text-gray-500 mb-10">Create comprehensive learning materials with intelligent chapter organization and rich content</p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* How It Works */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-600 pt-1">Enter your course topic, category, and difficulty level</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-600 pt-1">AI analyzes and structures content into logical chapters</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-600 pt-1">Each chapter is enriched with detailed explanations and examples</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-600 pt-1">Optional video recommendations are included for visual learning</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Structured Chapters</p>
                      <p className="text-sm text-gray-600">Organized learning path from basics to advanced topics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Rich Content</p>
                      <p className="text-sm text-gray-600">Detailed explanations with real-world examples</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Video Integration</p>
                      <p className="text-sm text-gray-600">Curated video recommendations for each chapter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Instant Generation</p>
                      <p className="text-sm text-gray-600">Create complete courses in seconds with AI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfect For</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Students</h4>
                  <p className="text-sm text-gray-600">Create study guides for exams</p>
                </div>
                <div className="p-5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-3">
                    <Book className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Self-Learners</h4>
                  <p className="text-sm text-gray-600">Master new skills systematically</p>
                </div>
                <div className="p-5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Educators</h4>
                  <p className="text-sm text-gray-600">Design curriculum content</p>
                </div>
                <div className="p-5 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Professionals</h4>
                  <p className="text-sm text-gray-600">Upskill for career growth</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pro Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Be specific with your course topic for more targeted content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Choose the appropriate difficulty level to match your current knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Enable video recommendations for a more comprehensive learning experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Adjust the number of chapters based on topic complexity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Courses Tab */}
        {activeTab === "myCourses" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">My Courses</h2>
                <p className="text-sm text-gray-500">
                  {courses.length === 0 ? "No courses yet. Create your first course to get started!" : `${courses.length} course${courses.length !== 1 ? 's' : ''} in your library`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-6">Start your learning journey by creating your first AI-generated course</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Your First Course
                    </button>
                  </div>
                </div>
              ) : (
                courses.map((course) => {
                  const total = course.noOfChapters || (course.chapters?.length ?? 0);
                  const completed = Math.floor(Math.random() * (total + 1));
                  const courseId = course.cid || course.id || course.name;
                  return (
                    <Link key={courseId} href={`/feature-2/${courseId}`}>
                      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300">
                        {/* Course Banner Image */}
                        <div className="w-full h-48 relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                          {course.bannerImageUrl ? (
                            <Image
                              src={course.bannerImageUrl}
                              alt={`${course.name} course banner`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <Book size={48} className="text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-blue-600 font-medium text-sm px-4">{course.name}</p>
                              </div>
                            </div>
                          )}
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                              {course.category}
                            </span>
                          </div>
                          {/* Level Badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-green-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                              {course.level}
                            </span>
                          </div>
                        </div>
                        {/* Course Details */}
                        <div className="p-5">
                          <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{course.name}</h2>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            {/* Left: Icon and Chapters */}
                            <div className="flex items-center gap-2 text-gray-700">
                              <Book size={16} className="text-gray-400" />
                              <span className="text-sm font-medium">{total} chapter{total !== 1 ? 's' : ''}</span>
                            </div>
                            {/* Right: Level Status */}
                            <span className="text-xs font-medium text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">{course.level}</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                              <span className="font-medium">Progress</span>
                              <span className="font-semibold">{Math.round((completed / total) * 100 || 0)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
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
          </div>
        )}
      </div>
      
      <CourseFormModal open={showModal} onClose={() => setShowModal(false)} onCourseCreated={handleCourseCreated} />
    </div>
  );
}