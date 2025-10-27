// Utility functions for user progress management

export interface ProgressData {
  userEmail: string;
  courseId: number;
  chapterIndex: number;
  chapterName: string;
}

export interface ProgressResponse {
  success: boolean;
  message: string;
  pointsEarned?: number;
  error?: string;
}

export interface UserProgress {
  id: number;
  user_email: string;
  course_id: number;
  chapter_index: number;
  chapter_name: string;
  is_completed: boolean;
  completed_at: string;
  created_at: string;
}

// Mark chapter as completed and award points
export async function markChapterCompleted(data: ProgressData): Promise<ProgressResponse> {
  try {
    const response = await fetch('/api/feature-5/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Failed to mark chapter as completed'
      };
    }

    return {
      success: true,
      message: result.message,
      pointsEarned: result.pointsEarned
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
}

// Get user progress for a specific course
export async function getUserProgress(userEmail: string, courseId: number): Promise<UserProgress[]> {
  try {
    const response = await fetch(`/api/feature-5/progress?userEmail=${encodeURIComponent(userEmail)}&courseId=${courseId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    const result = await response.json();
    return result.progress || [];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
}

// Calculate course completion percentage
export function calculateCourseProgress(progress: UserProgress[], totalChapters: number): number {
  if (totalChapters === 0) return 0;
  
  const completedChapters = progress.filter(p => p.is_completed).length;
  return Math.round((completedChapters / totalChapters) * 100);
}

// Check if a specific chapter is completed
export function isChapterCompleted(progress: UserProgress[], chapterIndex: number): boolean {
  return progress.some(p => p.chapter_index === chapterIndex && p.is_completed);
}

// Get completed chapters count
export function getCompletedChaptersCount(progress: UserProgress[]): number {
  return progress.filter(p => p.is_completed).length;
} 