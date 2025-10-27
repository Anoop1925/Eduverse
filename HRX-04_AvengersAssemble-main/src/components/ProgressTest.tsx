"use client";
import { useState } from 'react';
import { markChapterCompleted, getUserProgress, UserProgress } from '@/lib/progress';
import PointsNotification from './PointsNotification';

interface ProgressTestProps {
  userEmail: string;
  courseId: number;
  courseName: string;
  totalChapters: number;
}

export default function ProgressTest({ 
  userEmail, 
  courseId, 
  courseName, 
  totalChapters 
}: ProgressTestProps) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');

  const loadProgress = async () => {
    try {
      setLoading(true);
      const userProgress = await getUserProgress(userEmail, courseId);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeChapter = async (chapterIndex: number) => {
    try {
      setLoading(true);
      const result = await markChapterCompleted({
        userEmail,
        courseId,
        chapterIndex,
        chapterName: `Chapter ${chapterIndex + 1}`
      });

      if (result.success && result.pointsEarned) {
        setPointsEarned(result.pointsEarned);
        setNotificationMessage(result.message);
        setShowNotification(true);
        await loadProgress(); // Refresh progress
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error completing chapter:', error);
      alert('Error completing chapter');
    } finally {
      setLoading(false);
    }
  };

  const completedChapters = progress.filter(p => p.is_completed).length;
  const progressPercentage = Math.round((completedChapters / totalChapters) * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Progress Test: {courseName}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {completedChapters} / {totalChapters} chapters</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {Array.from({ length: totalChapters }, (_, i) => {
          const chapterProgress = progress.find(p => p.chapter_index === i);
          const isCompleted = chapterProgress?.is_completed;
          
          return (
            <div 
              key={i} 
              className={`flex items-center justify-between p-2 rounded ${
                isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="text-sm">
                Chapter {i + 1}
                {isCompleted && <span className="text-green-600 ml-2">✓</span>}
              </span>
              {!isCompleted && (
                <button
                  onClick={() => completeChapter(i)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Completing...' : 'Complete'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={loadProgress}
        disabled={loading}
        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Refresh Progress'}
      </button>

      <PointsNotification
        points={pointsEarned}
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
} 