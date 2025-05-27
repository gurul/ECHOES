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
      .order('createdAt', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data: stories, error } = await query;
    if (error) throw error;
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
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

// Use environment variable, fallback to localhost for dev
const summarizerUrl = process.env.SUMMARIZER_URL || 'http://localhost:8000/summarize';

export async function POST(request: Request) {
  try {
    const { title, content, theme } = await request.json();

    if (!title || !content || !theme) {
      return NextResponse.json(
        { error: 'Title, content, and theme are required' },
        { status: 400 }
      );
    }

    // Call the FastAPI summarizer
    let summary = '';
    try {
      const res = await fetch(summarizerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      });
      const data = await res.json();
      summary = data.summary;
    } catch (e) {
      // fallback: use the old summary logic
      summary = generateSummary(content);
    }

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