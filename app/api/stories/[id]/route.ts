import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const story = await prisma.story.findUnique({
      where: {
        id: parseInt(context.params.id),
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
} 