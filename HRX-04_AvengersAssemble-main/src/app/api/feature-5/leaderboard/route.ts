import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface LeaderboardRow {
  user_email: string;
  display_name: string;
  points: string;
  total_courses_completed: string;
  total_chapters_completed: string;
  rank: string;
}

export async function GET() {
  try {
    // Query to get leaderboard data with user display names
    const query = `
      SELECT 
        up.user_email,
        COALESCE(u.display_name, 
          CASE 
            WHEN up.user_email LIKE '%@%' 
            THEN SPLIT_PART(up.user_email, '@', 1)
            ELSE up.user_email 
          END
        ) as display_name,
        up.points,
        up.total_courses_completed,
        up.total_chapters_completed,
        ROW_NUMBER() OVER (ORDER BY up.points DESC) as rank
      FROM user_points up
      LEFT JOIN users u ON up.user_email = u.email
      WHERE up.points > 0
      ORDER BY up.points DESC, up.total_chapters_completed DESC
      LIMIT 100
    `;

    const result = await pool.query(query);
    console.log('Leaderboard query result:', result.rows);
    let leaderboard = [];
    try {
      leaderboard = result.rows.map((row: LeaderboardRow) => ({
        rank: parseInt(row.rank),
        userEmail: row.user_email,
        displayName: row.display_name,
        points: parseInt(row.points),
        totalCoursesCompleted: parseInt(row.total_courses_completed),
        totalChaptersCompleted: parseInt(row.total_chapters_completed)
      }));
    } catch (err) {
      console.error('Leaderboard mapping error:', err, result.rows);
      return NextResponse.json({ error: 'Leaderboard mapping error' }, { status: 500 });
    }
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API DB Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: (error as Error).message },
      { status: 500 }
    );
  }
} 