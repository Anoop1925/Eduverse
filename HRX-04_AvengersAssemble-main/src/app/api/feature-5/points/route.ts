import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Get user points and statistics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { error: "Missing userEmail" },
        { status: 400 }
      );
    }

    // Get user points and statistics
    const pointsResult = await pool.query(
      'SELECT * FROM user_points WHERE user_email = $1',
      [userEmail]
    );

    // Get points history (last 10 entries)
    const historyResult = await pool.query(
      'SELECT * FROM points_history WHERE user_email = $1 ORDER BY earned_at DESC LIMIT 10',
      [userEmail]
    );

    // Get overall statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT up.course_id) as courses_started,
        COUNT(CASE WHEN up.is_completed = true THEN 1 END) as total_chapters_completed,
        COUNT(DISTINCT CASE WHEN up.is_completed = true THEN up.course_id END) as courses_completed
      FROM user_progress up 
      WHERE up.user_email = $1
    `, [userEmail]);

    const userPoints = pointsResult.rows[0] || {
      points: 0,
      total_chapters_completed: 0,
      total_courses_completed: 0
    };

    const stats = statsResult.rows[0] || {
      courses_started: 0,
      total_chapters_completed: 0,
      courses_completed: 0
    };

    return NextResponse.json({
      points: userPoints.points || 0,
      totalChaptersCompleted: userPoints.total_chapters_completed || 0,
      totalCoursesCompleted: userPoints.total_courses_completed || 0,
      coursesStarted: stats.courses_started || 0,
      coursesCompleted: stats.courses_completed || 0,
      history: historyResult.rows
    });

  } catch (error) {
    console.error("Points API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    );
  }
}

// Get leaderboard data
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'leaderboard') {
      // Get top 10 users by points
      const leaderboardResult = await pool.query(`
        SELECT 
          user_email,
          points,
          total_chapters_completed,
          total_courses_completed,
          ROW_NUMBER() OVER (ORDER BY points DESC) as rank
        FROM user_points 
        ORDER BY points DESC 
        LIMIT 10
      `);

      return NextResponse.json({
        leaderboard: leaderboardResult.rows
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
} 