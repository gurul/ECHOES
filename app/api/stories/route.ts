import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    
    const stories = await prisma.story.findMany({
      where: searchQuery ? {
        OR: [
          { title: { contains: searchQuery } },
          { content: { contains: searchQuery } }
        ]
      } : undefined,
      orderBy: [
        { votes: 'desc' },
        { createdAt: 'desc' }
      ],
    });
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

    const story = await prisma.story.create({
      data: {
        title,
        content,
        summary,
        theme,
        votes: 0,
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
} 