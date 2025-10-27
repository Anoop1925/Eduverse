import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Gemini API or DB Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 