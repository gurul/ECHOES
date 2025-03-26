'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Story {
  id: number;
  content: string;
  createdAt: string;
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
        const data = await response.json();
        setStory(data);
      } catch {
        setError('Failed to load story');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">Loading story...</div>
        </div>
      </main>
    );
  }

  if (error || !story) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center text-red-500">{error || 'Story not found'}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#2348B1] mb-8 hover:text-[#1a3a8f]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m19 12-7-7-7 7"/>
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            </svg>
            Back to Stories
          </Link>
          <p className="text-gray-800 leading-relaxed text-lg">{story.content}</p>
          <div className="mt-8 text-sm text-gray-500">
            Shared on {new Date(story.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </main>
  );
} 