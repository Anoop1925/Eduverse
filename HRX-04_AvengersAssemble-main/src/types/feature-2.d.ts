export interface YouTubeRecommendation {
  title: string;
  url: string;
  thumbnail: string;
}

export interface Subtopic {
  title: string;
  theory: string;
  example: string;
  handsOn: string;
  videoUrl?: string;
}

export interface Chapter {
  chapterName: string;
  duration: string;
  subtopics: Subtopic[];
}

export interface CompletionStatus {
  completedChapters: number;
  totalChapters: number;
}

export interface Course {
  name: string;
  description: string;
  category: string;
  level: string;
  includeVideo: boolean;
  noOfChapters: number;
  bannerImagePrompt: string;
  bannerImageUrl?: string;
  chapters: Chapter[];
  cid?: string;
  userEmail?: string;
} 