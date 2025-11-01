import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, get user_points with users data
    const { data: userPointsData, error: pointsError } = await supabase
      .from('user_points')
      .select(`
        user_email,
        points,
        total_courses_completed,
        total_chapters_completed
      `)
      .gt('points', 0)
      .order('points', { ascending: false })
      .order('total_chapters_completed', { ascending: false })
      .limit(100);

    if (pointsError) {
      console.error('Supabase user_points query error:', pointsError);
      return NextResponse.json(
        { error: 'Failed to fetch user points', details: pointsError.message },
        { status: 500 }
      );
    }

    // Get all user emails to fetch display names
    const userEmails = userPointsData?.map(up => up.user_email) || [];
    
    let usersMap: { [key: string]: string } = {};
    if (userEmails.length > 0) {
      const { data: usersData } = await supabase
        .from('users')
        .select('email, display_name')
        .in('email', userEmails);

      // Create a map of email to display_name
      usersData?.forEach(user => {
        if (user.display_name) {
          usersMap[user.email] = user.display_name;
        }
      });
    }

    // Map the results with display names and ranks
    const leaderboard = userPointsData?.map((row, index) => ({
      rank: index + 1,
      userEmail: row.user_email,
      displayName: usersMap[row.user_email] || row.user_email.split('@')[0] || row.user_email,
      points: row.points,
      totalCoursesCompleted: row.total_courses_completed,
      totalChaptersCompleted: row.total_chapters_completed
    })) || [];

    console.log('Leaderboard fetched successfully:', leaderboard.length, 'entries');
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: (error as Error).message },
      { status: 500 }
    );
  }
} 