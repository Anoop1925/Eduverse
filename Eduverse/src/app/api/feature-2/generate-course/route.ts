import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Interface for playlist-based course structure
interface PlaylistVideo {
  videoId: string;
  title: string;
  videoUrl: string;
  isEmbeddable: boolean;
}

interface PlaylistCourseData {
  playlistId: string;
  playlistTitle: string;
  videos: PlaylistVideo[];
}

// Function to find matching Code with Harry playlist and extract videos
async function findPlaylistCourse(courseName: string): Promise<PlaylistCourseData | null> {
  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      console.warn("⚠️ YouTube API key not found");
      return null;
    }

    const codeWithHarryId = 'UCeVMnSShP_Iviwkknt83cww';
    
    // Extract main keyword from course name (e.g., "Python" from "Python Tutorial")
    const keywords = courseName.toLowerCase().split(' ');
    const mainKeyword = keywords[0]; // Use first word as primary keyword
    
    console.log(`🔍 Searching Code with Harry playlists for: "${mainKeyword}"`);
    
    // Search for matching playlists
    const playlistSearch = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'id,snippet',
          maxResults: 5,
          q: mainKeyword,
          type: 'playlist',
          channelId: codeWithHarryId,
          key: youtubeApiKey,
        }
      }
    );

    if (playlistSearch.data.items && playlistSearch.data.items.length > 0) {
      // Find best matching playlist
      for (const playlistItem of playlistSearch.data.items) {
        const playlistId = playlistItem.id.playlistId;
        const playlistTitle = playlistItem.snippet.title;
        
        console.log(`   📚 Found playlist: "${playlistTitle}"`);
        
        // Get all videos from this playlist (up to 50)
        const playlistVideos = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
            params: {
              part: 'contentDetails,snippet',
              maxResults: 50,
              playlistId: playlistId,
              key: youtubeApiKey,
            }
          }
        );

        if (playlistVideos.data.items && playlistVideos.data.items.length > 0) {
          console.log(`   ✅ Found ${playlistVideos.data.items.length} videos in playlist`);
          
          // Extract video data and check embeddability
          const videos: PlaylistVideo[] = [];
          
          for (const video of playlistVideos.data.items) {
            const videoId = video.contentDetails.videoId;
            const videoTitle = video.snippet.title;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            // Check if video is embeddable (but still return it regardless)
            try {
              const videoCheck = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos`,
                {
                  params: {
                    part: 'status',
                    id: videoId,
                    key: youtubeApiKey,
                  }
                }
              );

              const isEmbeddable = videoCheck.data.items?.[0]?.status?.embeddable || false;
              
              videos.push({
                videoId,
                title: videoTitle,
                videoUrl,
                isEmbeddable
              });
            } catch {
              // If check fails, add video anyway with embeddable=false
              videos.push({
                videoId,
                title: videoTitle,
                videoUrl,
                isEmbeddable: false
              });
            }
          }

          return {
            playlistId,
            playlistTitle,
            videos
          };
        }
      }
    }

    console.log('   ℹ️ No matching playlist found');
    return null;
  } catch (error) {
    console.error("❌ Playlist search error:", error);
    return null;
  }
}

// Function to search YouTube videos (fallback for manual search)
async function searchYouTubeVideo(topic: string): Promise<string> {
  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      console.warn("⚠️ YouTube API key not found, skipping video search");
      return "";
    }

    const searchQuery = `${topic} tutorial`;
    console.log(`🔍 Manual search for: "${searchQuery}"`);
    
    const codeWithHarryId = 'UCeVMnSShP_Iviwkknt83cww';
    
    try {
      // Search in Code with Harry channel first
      const videoSearch = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'id,snippet',
            maxResults: 5,
            q: searchQuery,
            type: 'video',
            channelId: codeWithHarryId,
            key: youtubeApiKey,
            order: 'relevance',
          }
        }
      );

      if (videoSearch.data.items && videoSearch.data.items.length > 0) {
        // Return first video URL (regardless of embeddability - YouTube button will work)
        const videoId = videoSearch.data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`   ✅ Found video: ${videoId}`);
        return videoUrl;
      }

      // Fallback: General YouTube search
      const generalSearch = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'id',
            maxResults: 1,
            q: searchQuery,
            type: 'video',
            key: youtubeApiKey,
          }
        }
      );

      if (generalSearch.data.items && generalSearch.data.items.length > 0) {
        const videoId = generalSearch.data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`   ✅ Found video (general search): ${videoId}`);
        return videoUrl;
      }
    } catch (err) {
      console.log('   ⚠️ Video search failed:', err);
    }

    console.warn(`⚠️ No videos found for: ${searchQuery}`);
    return "";
  } catch (error) {
    console.error("❌ YouTube API Error:", error);
    return "";
  }
}

// Function to generate image using AI Guru Lab API
async function generateCourseImage(courseName: string, category: string, level: string): Promise<string> {
  try {
    const apiKey = process.env.AI_GURU_LAB_API;
    if (!apiKey) {
      console.warn("AI_GURU_LAB_API key not found, skipping image generation");
      return "";
    }

    // Create a descriptive prompt based on course details
    const imagePrompt = `Professional course banner for "${courseName}" in ${category} category, ${level} level. Modern, clean design with educational elements, suitable for online learning platform. High quality, professional appearance.`;

    const response = await axios.post('https://aigurulab.tech/api/generate-image', {
      width: 1024,
      height: 1024,
      input: imagePrompt,
      model: 'sdxl',
      aspectRatio: "1:1"
    }, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.image) {
      return response.data.image;
    } else {
      console.warn("No image data received from AI Guru Lab API");
      return "";
    }
  } catch (error) {
    console.error("Error generating course image:", error);
    return "";
  }
}

export async function POST(req: NextRequest) {
  const {
    name,
    description,
    category,
    level,
    includeVideo,
    noOfChapters
  } = await req.json();

  console.log("📝 Course Generation Request:");
  console.log("- Name:", name);
  console.log("- Include Video:", includeVideo);
  console.log("- YouTube API Key exists:", !!process.env.YOUTUBE_API_KEY);

  try {
    // Step 1: Try to find matching Code with Harry playlist
    let playlistData: PlaylistCourseData | null = null;
    
    if (includeVideo) {
      console.log("\n🎬 Step 1: Searching for matching playlist...");
      playlistData = await findPlaylistCourse(name);
    }

    let courseData;

    // Step 2: If playlist found, build course from playlist videos
    if (playlistData && playlistData.videos.length > 0) {
      console.log(`\n✅ Using playlist: "${playlistData.playlistTitle}" (${playlistData.videos.length} videos)`);
      console.log(`🎯 Building course structure from playlist videos...`);

      // Divide videos into chapters
      const videosPerChapter = Math.ceil(playlistData.videos.length / noOfChapters);
      const chapters = [];

      for (let i = 0; i < noOfChapters; i++) {
        const startIdx = i * videosPerChapter;
        const endIdx = Math.min(startIdx + videosPerChapter, playlistData.videos.length);
        const chapterVideos = playlistData.videos.slice(startIdx, endIdx);

        const subtopics = chapterVideos.map(video => ({
          title: video.title,
          theory: `Learn about ${video.title} through this comprehensive tutorial. This topic covers essential concepts and practical applications.`,
          example: `Watch the video tutorial for practical examples and demonstrations of ${video.title}.`,
          handsOn: `Complete the exercises shown in the video and try implementing the concepts on your own. Practice makes perfect!`,
          videoUrl: video.videoUrl,
          isEmbeddable: video.isEmbeddable
        }));

        chapters.push({
          chapterName: `Chapter ${i + 1}: ${chapterVideos[0]?.title || 'Learning Section'}`,
          duration: `${chapterVideos.length * 15} minutes`, // Estimate 15 min per video
          subtopics
        });
      }

      // Generate course image
      const bannerImageUrl = await generateCourseImage(name, category, level);

      courseData = {
        course: {
          cid: uuidv4(),
          name,
          description,
          category,
          level,
          includeVideo,
          noOfChapters,
          bannerImageUrl,
          bannerImagePrompt: `Course based on ${playlistData.playlistTitle}`,
          userEmail: "demo@user.com",
          playlistSource: playlistData.playlistTitle,
          chapters
        }
      };

      console.log(`✅ Course built successfully with ${chapters.length} chapters and ${playlistData.videos.length} videos`);
    } 
    // Step 3: Fallback to AI-generated course with manual video search
    else {
      console.log("\n🤖 No matching playlist found. Using AI to generate course structure...");

      const prompt = `Generate a detailed, guided, gamified LMS-style learning course based on the following details. Each chapter should have a duration (e.g., '2 hours') and a list of subtopics. Each subtopic should include:
- A theory/reading section (short explanation)
- An example (code or real-world)
- A hands-on task or quiz
- Optionally, a video/tutorial link (if includeVideo is true)

Return only a valid JSON object with the schema below. Do not include any extra text.

Schema:
{
  "course": {
    "cid": "string", // unique id
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "subtopics": [
          {
            "title": "string",
            "theory": "string",
            "example": "string",
            "handsOn": "string",
            "videoUrl": "string (optional)"
          }
        ]
      }
    ]
  }
}

Details:
Course Name: ${name}
Description: ${description}
Category: ${category}
Level: ${level}
Include Video: ${includeVideo}
Number of Chapters: ${noOfChapters}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!text) throw new Error("No response from Gemini");

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("Failed to extract JSON from Gemini response:", text);
        throw new Error("Gemini response was not valid JSON");
      }

      try {
        courseData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse extracted JSON:", e, jsonMatch[0]);
        throw new Error("Gemini response was not valid JSON (after extraction)");
      }

      if (!courseData.course || !courseData.course.chapters || courseData.course.chapters.length !== noOfChapters) {
        console.error("Gemini response was not valid JSON or extractable:", text);
        throw new Error("Invalid course structure or chapter count mismatch");
      }

      // Generate course image
      const bannerImageUrl = await generateCourseImage(name, category, level);
      
      // Add generated image URL to course data
      courseData.course.bannerImageUrl = bannerImageUrl;
      courseData.course.cid = uuidv4();
      courseData.course.userEmail = "demo@user.com";

      // Manual video search for each subtopic
      if (includeVideo) {
        console.log("🎬 Fetching YouTube videos for subtopics (manual search)...");
        for (const chapter of courseData.course.chapters) {
          for (const subtopic of chapter.subtopics) {
            if (!subtopic.videoUrl || subtopic.videoUrl === "") {
              console.log(`Searching video for: ${subtopic.title}`);
              const videoUrl = await searchYouTubeVideo(subtopic.title);
              subtopic.videoUrl = videoUrl;
              console.log(`${videoUrl ? '✅' : '⚠️'} Video: ${videoUrl || 'not found'}`);
            }
          }
        }
      } else {
        console.log("⏭️ Video search skipped (includeVideo is false)");
      }
    }

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Course Generation Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 