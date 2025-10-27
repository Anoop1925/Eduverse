import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Function to search YouTube videos from Code with Harry playlists
async function searchYouTubeVideo(topic: string, courseName: string): Promise<string> {
  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      console.warn("⚠️ YouTube API key not found, skipping video search");
      return "";
    }

    const searchQuery = `${topic} tutorial`;
    console.log(`🔍 Searching playlist for: "${searchQuery}"`);
    
    // Priority 1: Search Code with Harry's PLAYLISTS (most reliable approach)
    const codeWithHarryId = 'UCeVMnSShP_Iviwkknt83cww';
    
    try {
      console.log('   🎬 Searching Code with Harry playlists...');
      
      // Step 1: Search for playlists matching the topic
      const playlistSearch = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'id,snippet',
            maxResults: 3,
            q: topic, // Search using just the topic (e.g., "Python", "JavaScript")
            type: 'playlist',
            channelId: codeWithHarryId,
            key: youtubeApiKey,
          }
        }
      );

      if (playlistSearch.data.items && playlistSearch.data.items.length > 0) {
        // Step 2: Get the first matching playlist
        for (const playlistItem of playlistSearch.data.items) {
          const playlistId = playlistItem.id.playlistId;
          const playlistTitle = playlistItem.snippet.title;
          
          console.log(`   📚 Found playlist: "${playlistTitle}"`);
          
          // Step 3: Get videos from this playlist
          const playlistVideos = await axios.get(
            `https://www.googleapis.com/youtube/v3/playlistItems`,
            {
              params: {
                part: 'contentDetails,snippet',
                maxResults: 5,
                playlistId: playlistId,
                key: youtubeApiKey,
              }
            }
          );

          if (playlistVideos.data.items && playlistVideos.data.items.length > 0) {
            // Step 4: Validate each video for embeddability
            for (const video of playlistVideos.data.items) {
              const videoId = video.contentDetails.videoId;
              
              // Verify embeddable status
              const videoCheck = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos`,
                {
                  params: {
                    part: 'status,snippet',
                    id: videoId,
                    key: youtubeApiKey,
                  }
                }
              );

              if (videoCheck.data.items && videoCheck.data.items.length > 0) {
                const videoData = videoCheck.data.items[0];
                if (videoData.status.embeddable && videoData.status.privacyStatus === 'public') {
                  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                  console.log(`   ✅ Found from playlist "${playlistTitle}": "${videoData.snippet.title.substring(0, 50)}"`);
                  return videoUrl;
                }
              }
            }
          }
        }
      }
      
      console.log('   ℹ️ No matching playlist found, trying direct video search...');
      
      // Fallback: Direct video search in Code with Harry channel
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
            videoEmbeddable: 'true',
            order: 'relevance',
          }
        }
      );

      if (videoSearch.data.items && videoSearch.data.items.length > 0) {
        for (const item of videoSearch.data.items) {
          const videoId = item.id.videoId;
          
          const videoCheck = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
              params: {
                part: 'status,snippet',
                id: videoId,
                key: youtubeApiKey,
              }
            }
          );

          if (videoCheck.data.items && videoCheck.data.items.length > 0) {
            const video = videoCheck.data.items[0];
            if (video.status.embeddable && video.status.privacyStatus === 'public') {
              const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
              console.log(`   ✅ Found video: "${video.snippet.title.substring(0, 50)}"`);
              return videoUrl;
            }
          }
        }
      }
    } catch (err) {
      console.log('   ⚠️ Code with Harry search failed:', err);
    }

    console.warn(`⚠️ No embeddable videos found for: ${searchQuery}`);
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
  console.log("- YouTube API Key (first 20):", process.env.YOUTUBE_API_KEY?.substring(0, 20));

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

  try {
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

    let courseData;
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

    // If includeVideo is true, fetch YouTube videos for each subtopic
    if (includeVideo) {
      console.log("🎬 Fetching YouTube videos for subtopics...");
      for (const chapter of courseData.course.chapters) {
        for (const subtopic of chapter.subtopics) {
          if (!subtopic.videoUrl || subtopic.videoUrl === "") {
            console.log(`Searching video for: ${subtopic.title}`);
            const videoUrl = await searchYouTubeVideo(subtopic.title, name);
            subtopic.videoUrl = videoUrl;
            console.log(`✅ Found video: ${videoUrl}`);
          }
        }
      }
    } else {
      console.log("⏭️ Video search skipped (includeVideo is false)");
    }

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Gemini API or DB Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 