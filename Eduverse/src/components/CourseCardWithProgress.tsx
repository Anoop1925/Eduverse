import React, { useState } from 'react';
import { Play, CheckCircle, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { markChapterCompleted } from '@/lib/progress';
import PointsNotification from './PointsNotification';

interface CourseCardWithProgressProps {
  course: {
    id: number;
    name: string;
    description: string;
    noOfChapters: number;
    level: string;
    category: string;
    bannerImageUrl: string;
  };
  userEmail: string;
  onCourseClick: (courseId: number) => void;
}

export default function CourseCardWithProgress({ 
  course, 
  userEmail, 
  onCourseClick 
}: CourseCardWithProgressProps) {
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { 
    progressPercentage, 
    completedChapters, 
    isLoading, 
    refreshProgress 
  } = useCourseProgress({
    userEmail,
    courseId: course.id,
    totalChapters: course.noOfChapters
  });

  const handleChapterComplete = async (chapterIndex: number, chapterName: string) => {
    try {
      const result = await markChapterCompleted({
        userEmail,
        courseId: course.id,
        chapterIndex,
        chapterName
      });

      if (result.success && result.pointsEarned) {
        setPointsEarned(result.pointsEarned);
        setNotificationMessage(result.message);
        setShowPointsNotification(true);
        refreshProgress();
      }
    } catch (error) {
      console.error('Error marking chapter as completed:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Course Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          {course.bannerImageUrl ? (
            <img 
              src={course.bannerImageUrl} 
              alt={course.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-50" />
            </div>
          )}
          
          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>

          {/* Progress Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {completedChapters} / {course.noOfChapters} chapters
                </span>
                <span className="text-sm">
                  {progressPercentage}% complete
                </span>
              </div>
              <ProgressBar 
                progress={progressPercentage} 
                size="sm" 
                className="mb-2"
              />
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {course.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.noOfChapters} chapters
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {course.category}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => onCourseClick(course.id)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </button>

            {/* Quick Chapter Complete Button (for demo) */}
            {completedChapters < course.noOfChapters && (
              <button
                onClick={() => handleChapterComplete(completedChapters, `Chapter ${completedChapters + 1}`)}
                className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                disabled={isLoading}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Next Chapter Complete
              </button>
            )}

            {progressPercentage === 100 && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Course Completed!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Points Notification */}
      <PointsNotification
        points={pointsEarned}
        message={notificationMessage}
        isVisible={showPointsNotification}
        onClose={() => setShowPointsNotification(false)}
      />
    </>
  );
} 