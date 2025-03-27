import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
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

export async function POST(request: Request) {
  try {
    const { title, content, theme } = await request.json();

    if (!title || !content || !theme) {
      return NextResponse.json(
        { error: 'Title, content, and theme are required' },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        title,
        content,
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