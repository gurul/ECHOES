import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Generate basic summary by taking the first sentence
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (!sentences || sentences.length === 0) {
      // If no sentence found, try to get a meaningful chunk
      const words = text.split(' ');
      let summary = '';
      let wordCount = 0;
      const maxWords = 15; // Limit to roughly one sentence length

      for (const word of words) {
        if (wordCount >= maxWords) break;
        summary += word + ' ';
        wordCount++;
      }

      return NextResponse.json({ summary: summary.trim() + '...' });
    }

    return NextResponse.json({ summary: sentences[0].trim() });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 