import { NextResponse } from 'next/server';
import supabase from '../../../supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    let query = supabase
      .from('Story')
      .select('*')
      .order('votes', { ascending: false })
      .order('createdat', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data: stories, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

function generateSummary(content: string): string {
  // First try to get the first complete sentence
  const sentences = content.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    return sentences[0].trim();
  }

  // If no sentence found, try to get a meaningful chunk
  const words = content.split(' ');
  let summary = '';
  let wordCount = 0;
  const maxWords = 15; // Limit to roughly one sentence length

  for (const word of words) {
    if (wordCount >= maxWords) break;
    summary += word + ' ';
    wordCount++;
  }

  return summary.trim() + '...';
}

export async function POST(request: Request) {
  try {
    const { title, content, theme } = await request.json();

    if (!title || !content || !theme) {
      return NextResponse.json(
        { error: 'Title, content, and theme are required' },
        { status: 400 }
      );
    }

    const summary = generateSummary(content);

    const { data, error } = await supabase.from('Story').insert([
      {
        title,
        content,
        summary,
        theme,
        votes: 0,
      },
    ]).select().single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
} 