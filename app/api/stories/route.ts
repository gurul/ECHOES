import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { filterContent } from '../../utils/contentFilter';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
    const body = await request.json();
    const { title, content, theme } = body;

    // Validate required fields
    if (!title || !content || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Filter content
    const filterResult = filterContent(content);
    if (!filterResult.isValid) {
      return NextResponse.json(
        { error: filterResult.reason },
        { status: 400 }
      );
    }

    // Create new story
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