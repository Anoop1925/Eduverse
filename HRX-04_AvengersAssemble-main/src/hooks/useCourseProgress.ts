import { useState, useEffect, useCallback } from 'react';
import { getUserProgress, calculateCourseProgress, UserProgress } from '@/lib/progress';

interface UseCourseProgressProps {
  userEmail: string;
  courseId: number;
  totalChapters: number;
}

interface UseCourseProgressReturn {
  progress: UserProgress[];
  progressPercentage: number;
  completedChapters: number;
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => void;
}

export function useCourseProgress({ 
  userEmail, 
  courseId, 
  totalChapters 
}: UseCourseProgressProps): UseCourseProgressReturn {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userEmail || !courseId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userProgress = await getUserProgress(userEmail, courseId);
      setProgress(userProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, courseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const progressPercentage = calculateCourseProgress(progress, totalChapters);
  const completedChapters = progress.filter(p => p.is_completed).length;

  return {
    progress,
    progressPercentage,
    completedChapters,
    isLoading,
    error,
    refreshProgress: fetchProgress
  };
} 