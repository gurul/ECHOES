import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../../supabaseClient';

// Get comments for a story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { data: comments, error } = await supabase
      .from('Comment')
      .select('*')
      .eq('storyId', parseInt(id))
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Add a new comment to a story
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from('Comment')
      .insert([
        {
          content,
          author: 'Anonymous',
          storyId: parseInt(id),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 