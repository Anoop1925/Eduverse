import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Mark chapter as completed and award points
export async function POST(req: NextRequest) {
  try {
    const { userEmail, courseId, chapterIndex, chapterName } = await req.json();

    if (!userEmail || courseId === undefined || chapterIndex === undefined || !chapterName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if progress already exists
      const existingProgress = await client.query(
        'SELECT * FROM user_progress WHERE user_email = $1 AND course_id = $2 AND chapter_index = $3',
        [userEmail, courseId, chapterIndex]
      );

      if (existingProgress.rows.length > 0) {
        // Update existing progress
        await client.query(
          'UPDATE user_progress SET is_completed = true, completed_at = NOW() WHERE user_email = $1 AND course_id = $2 AND chapter_index = $3',
          [userEmail, courseId, chapterIndex]
        );
      } else {
        // Insert new progress
        await client.query(
          'INSERT INTO user_progress (user_email, course_id, chapter_index, chapter_name, is_completed, completed_at) VALUES ($1, $2, $3, $4, true, NOW())',
          [userEmail, courseId, chapterIndex, chapterName]
        );
      }

      // Award points (10 points per chapter)
      const pointsEarned = 10;
      
      // Update user points
      await client.query(
        `INSERT INTO user_points (user_email, points, total_chapters_completed) 
         VALUES ($1, $2, 1)
         ON CONFLICT (user_email) 
         DO UPDATE SET 
           points = user_points.points + $2,
           total_chapters_completed = user_points.total_chapters_completed + 1,
           last_updated = NOW()`,
        [userEmail, pointsEarned]
      );

      // Record points history
      await client.query(
        'INSERT INTO points_history (user_email, points_earned, reason, course_id, chapter_index) VALUES ($1, $2, $3, $4, $5)',
        [userEmail, pointsEarned, `Completed chapter: ${chapterName}`, courseId, chapterIndex]
      );

      // Check if course is completed (all chapters done)
      const courseChapters = await client.query(
        'SELECT noOfChapters FROM courses WHERE id = $1',
        [courseId]
      );

      if (courseChapters.rows.length > 0) {
        const totalChapters = courseChapters.rows[0].noofchapters;
        const completedChapters = await client.query(
          'SELECT COUNT(*) as completed FROM user_progress WHERE user_email = $1 AND course_id = $2 AND is_completed = true',
          [userEmail, courseId]
        );

        if (parseInt(completedChapters.rows[0].completed) === totalChapters) {
          // Check if bonus was already awarded for this course
          const existingBonus = await client.query(
            'SELECT * FROM points_history WHERE user_email = $1 AND course_id = $2 AND reason = $3',
            [userEmail, courseId, 'Course completed bonus']
          );

          if (existingBonus.rows.length === 0) {
            // Course completed - award bonus points (only once)
            const bonusPoints = 50;
            await client.query(
              'UPDATE user_points SET points = points + $1, total_courses_completed = total_courses_completed + 1 WHERE user_email = $2',
              [bonusPoints, userEmail]
            );

            await client.query(
              'INSERT INTO points_history (user_email, points_earned, reason, course_id) VALUES ($1, $2, $3, $4)',
              [userEmail, bonusPoints, 'Course completed bonus', courseId]
            );
          }
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({ 
        success: true, 
        message: "Chapter marked as completed",
        pointsEarned 
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// Get user progress for a specific course
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    const courseId = searchParams.get("courseId");

    if (!userEmail || !courseId) {
      return NextResponse.json(
        { error: "Missing userEmail or courseId" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_email = $1 AND course_id = $2 ORDER BY chapter_index',
      [userEmail, courseId]
    );

    return NextResponse.json({ progress: result.rows });

  } catch (error) {
    console.error("Get progress API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
} 