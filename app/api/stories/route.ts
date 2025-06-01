import { NextResponse } from 'next/server';
import supabase from '../../../supabaseClient';

export async function GET(request: Request) {
  try {
    console.log('Fetching stories...');
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    console.log('Search query:', searchQuery);

    let query = supabase
      .from('Story')
      .select('*')
      .order('votes', { ascending: false })
      .order('createdat', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    console.log('Executing Supabase query...');
    const { data: stories, error } = await query;
    
    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Stories fetched successfully:', stories?.length || 0);
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
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

    // Get summary from Hugging Face
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      console.log('Requesting summary from Hugging Face...');
      const summaryResponse = await fetch(`${baseUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      if (!summaryResponse.ok) {
        console.error('Summary API error:', await summaryResponse.text());
        throw new Error('Failed to generate AI summary');
      }

      const summaryData = await summaryResponse.json();

      if (!summaryData.summary) {
        console.error('No summary in response:', summaryData);
        throw new Error('No summary generated');
      }

      console.log('Successfully generated summary:', summaryData.summary);
      
      const { data, error } = await supabase.from('Story').insert([
        {
          title,
          content,
          summary: summaryData.summary,
          theme,
          votes: 0,
        },
      ]).select().single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('Error in story creation:', error);
      // Fallback to basic summary if Hugging Face fails
      console.log('Falling back to basic summary generation...');
      const summary = generateSummary(content);
      const { data, error: supabaseError } = await supabase.from('Story').insert([
        {
          title,
          content,
          summary,
          theme,
          votes: 0,
        },
      ]).select().single();

      if (supabaseError) {
        console.error('Supabase error on fallback:', supabaseError);
        throw supabaseError;
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create story' },
      { status: 500 }
    );
  }
} 