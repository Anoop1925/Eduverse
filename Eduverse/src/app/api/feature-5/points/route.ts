import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user points and statistics
    const { data: pointsData, error: pointsError } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_email', userEmail)
      .single();

    if (pointsError && pointsError.code !== 'PGRST116') {
      console.error('Points query error:', pointsError);
    }

    // Get points history (last 10 entries)
    const { data: historyData } = await supabase
      .from('points_history')
      .select('*')
      .eq('user_email', userEmail)
      .order('earned_at', { ascending: false })
      .limit(10);

    // Get overall statistics from user_progress
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('course_id, is_completed')
      .eq('user_email', userEmail);

    const coursesStarted = new Set(progressData?.map((p: any) => p.course_id) || []).size;
    const totalChaptersCompleted = progressData?.filter((p: any) => p.is_completed).length || 0;
    const coursesCompleted = new Set(
      progressData?.filter((p: any) => p.is_completed).map((p: any) => p.course_id) || []
    ).size;

    const userPoints = pointsData || {
      points: 0,
      total_chapters_completed: 0,
      total_courses_completed: 0
    };

    return NextResponse.json({
      points: userPoints.points || 0,
      totalChaptersCompleted: userPoints.total_chapters_completed || 0,
      totalCoursesCompleted: userPoints.total_courses_completed || 0,
      coursesStarted: coursesStarted || 0,
      coursesCompleted: coursesCompleted || 0,
      history: historyData || []
    });

  } catch (error) {
    console.error("Points API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch points", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Get leaderboard data
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'leaderboard') {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get top 10 users by points
      const { data: leaderboardData, error } = await supabase
        .from('user_points')
        .select('user_email, points, total_chapters_completed, total_courses_completed')
        .order('points', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Leaderboard query error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch leaderboard', details: error.message },
          { status: 500 }
        );
      }

      // Add ranks
      const leaderboard = leaderboardData?.map((row: any, index: number) => ({
        ...row,
        rank: index + 1
      })) || [];

      return NextResponse.json({ leaderboard });
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