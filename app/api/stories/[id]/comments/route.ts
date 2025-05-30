import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../../supabaseClient';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdat: string;
  storyid: number;
  parentid: number | null;
}

// Get comments for a story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    console.log('Fetching comments for story:', id);
    
    const { data: comments, error } = await supabase
      .from('Comment')
      .select('*')
      .eq('storyid', parseInt(id))
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Supabase error fetching comments:', error);
      throw error;
    }

    console.log('Comments fetched successfully:', comments);

    // Organize comments into a nested structure
    const commentMap = new Map<number, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create a map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into nested structure
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id);
      if (commentWithReplies) {
        if (comment.parentid) {
          const parent = commentMap.get(comment.parentid);
          if (parent) {
            parent.replies.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      }
    });

    return NextResponse.json(rootComments);
  } catch (error) {
    console.error('Error in comments API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch comments' },
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
    const { content, parentId } = await request.json();

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
          storyid: parseInt(id),
          parentid: parentId || null,
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