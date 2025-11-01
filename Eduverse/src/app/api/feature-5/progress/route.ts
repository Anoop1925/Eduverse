import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { userEmail, courseId, chapterIndex, chapterName } = await req.json();

    if (!userEmail || courseId === undefined || chapterIndex === undefined || !chapterName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('course_id', courseId)
      .eq('chapter_index', chapterIndex)
      .single();

    if (existingProgress) {
      await supabase
        .from('user_progress')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('user_email', userEmail)
        .eq('course_id', courseId)
        .eq('chapter_index', chapterIndex);
    } else {
      await supabase
        .from('user_progress')
        .insert({
          user_email: userEmail,
          course_id: courseId,
          chapter_index: chapterIndex,
          chapter_name: chapterName,
          is_completed: true,
          completed_at: new Date().toISOString()
        });
    }

    const pointsEarned = 10;

    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_email', userEmail)
      .single();

    if (currentPoints) {
      await supabase
        .from('user_points')
        .update({
          points: currentPoints.points + pointsEarned,
          total_chapters_completed: currentPoints.total_chapters_completed + 1,
          last_updated: new Date().toISOString()
        })
        .eq('user_email', userEmail);
    } else {
      await supabase
        .from('user_points')
        .insert({
          user_email: userEmail,
          points: pointsEarned,
          total_chapters_completed: 1,
          total_courses_completed: 0
        });
    }

    await supabase
      .from('points_history')
      .insert({
        user_email: userEmail,
        points_earned: pointsEarned,
        reason: `Completed chapter: ${chapterName}`,
        course_id: courseId,
        chapter_index: chapterIndex
      });

    const { data: courseData } = await supabase
      .from('courses')
      .select('noOfChapters')
      .eq('id', courseId)
      .single();

    if (courseData) {
      const totalChapters = courseData.noOfChapters;
      
      const { count: completedCount } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', userEmail)
        .eq('course_id', courseId)
        .eq('is_completed', true);

      if (completedCount === totalChapters) {
        const { data: existingBonus } = await supabase
          .from('points_history')
          .select('*')
          .eq('user_email', userEmail)
          .eq('course_id', courseId)
          .eq('reason', 'Course completed bonus')
          .single();

        if (!existingBonus) {
          const bonusPoints = 50;
          
          const { data: userPoints } = await supabase
            .from('user_points')
            .select('*')
            .eq('user_email', userEmail)
            .single();

          if (userPoints) {
            await supabase
              .from('user_points')
              .update({
                points: userPoints.points + bonusPoints,
                total_courses_completed: userPoints.total_courses_completed + 1
              })
              .eq('user_email', userEmail);

            await supabase
              .from('points_history')
              .insert({
                user_email: userEmail,
                points_earned: bonusPoints,
                reason: 'Course completed bonus',
                course_id: courseId
              });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Chapter marked as completed",
      pointsEarned
    });

  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Failed to update progress", details: (error as Error).message },
      { status: 500 }
    );
  }
}

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

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: progressData, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_email', userEmail)
      .eq('course_id', courseId)
      .order('chapter_index');

    if (error) {
      console.error('Get progress error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress: progressData || [] });

  } catch (error) {
    console.error("Get progress API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress", details: (error as Error).message },
      { status: 500 }
    );
  }
}
