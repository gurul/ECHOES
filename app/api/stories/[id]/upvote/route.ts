import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const story = await prisma.story.update({
      where: {
        id: parseInt(id),
      },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error upvoting story:', error);
    return NextResponse.json(
      { error: 'Failed to upvote story' },
      { status: 500 }
    );
  }
} 