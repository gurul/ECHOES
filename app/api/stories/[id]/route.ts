import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../../supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { data: story, error } = await supabase
      .from('Story')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
} 