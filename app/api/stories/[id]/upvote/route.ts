import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const story = await prisma.story.update({
      where: {
        id: parseInt(params.id),
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