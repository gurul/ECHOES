import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../../supabaseClient';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    // Fetch current votes
    const { data: story, error: fetchError } = await supabase
      .from('Story')
      .select('votes')
      .eq('id', parseInt(id))
      .single();
    if (fetchError || !story) throw fetchError || new Error('Story not found');
    // Increment votes
    const { data: updatedStory, error: updateError } = await supabase
      .from('Story')
      .update({ votes: story.votes + 1 })
      .eq('id', parseInt(id))
      .select()
      .single();
    if (updateError) throw updateError;
    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error upvoting story:', error);
    return NextResponse.json(
      { error: 'Failed to upvote story' },
      { status: 500 }
    );
  }
} 