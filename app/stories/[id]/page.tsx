'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Story {
  id: number;
  title: string;
  content: string;
  summary?: string;
  theme: string;
  votes: number;
  createdAt: string;
}

export default function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/stories/${id}`);
        if (!response.ok) throw new Error('Failed to fetch story');
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch story');
      }
    };

    fetchStory();
  }, [params]);

  if (error) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{story.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
            <span>Theme: {story.theme}</span>
            <span>•</span>
            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{story.votes} votes</span>
          </div>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">
            {story.content}
          </div>
        </article>
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 