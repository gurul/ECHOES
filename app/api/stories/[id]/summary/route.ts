import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../../supabaseClient';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { summary } = await request.json();

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary is required' },
        { status: 400 }
      );
    }

    const { data: updatedStory, error } = await supabase
      .from('Story')
      .update({ summary })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error updating story summary:', error);
    return NextResponse.json(
      { error: 'Failed to update story summary' },
      { status: 500 }
    );
  }
} 