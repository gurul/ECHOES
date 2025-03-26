'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Theme, themeGradients, themeLabels } from './utils/themes';

interface Story {
  id: number;
  title: string;
  content: string;
  theme: Theme;
  votes: number;
  createdAt: string;
}

function getSummary(content: string): string {
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

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [upvotedStories, setUpvotedStories] = useState<Set<number>>(new Set());

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleUpvote = async (storyId: number) => {
    if (upvotedStories.has(storyId)) return;

    try {
      const response = await fetch(`/api/stories/${storyId}/upvote`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to upvote story');
      }

      const updatedStory = await response.json();
      setStories(stories.map(story => 
        story.id === storyId ? updatedStory : story
      ));
      setUpvotedStories(prev => new Set([...prev, storyId]));
    } catch (err) {
      console.error('Error upvoting story:', err);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = searchQuery === '' || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = !selectedTheme || story.theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const storiesByTheme = filteredStories.reduce((acc, story) => {
    if (!acc[story.theme]) {
      acc[story.theme] = [];
    }
    acc[story.theme].push(story);
    return acc;
  }, {} as Record<Theme, Story[]>);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2348B1] to-[#1a3a8f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">ECHOES</h1>
          <p className="text-xl text-white/90 mb-8">Voices of the past, conversations for tomorrow</p>
          <Link 
            href="/share" 
            className="inline-block bg-white text-[#2348B1] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Share Your Story
          </Link>
        </div>
      </div>

      {/* Theme Showcase */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-medium text-gray-900 text-center mb-12">Browse Stories by Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(themeLabels).map(([theme, label]) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme as Theme)}
                className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${
                  selectedTheme === theme 
                    ? 'ring-2 ring-[#2348B1] ring-offset-2' 
                    : ''
                } ${themeGradients[theme as Theme]}`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative text-gray-900 font-medium">{label}</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedTheme(null)}
              className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${
                selectedTheme === null 
                  ? 'ring-2 ring-[#2348B1] ring-offset-2' 
                  : ''
              } bg-gray-100 hover:bg-gray-200`}
            >
              <span className="relative text-gray-900 font-medium">All Stories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center py-8">Loading stories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : stories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No stories yet. Be the first to share!</div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No stories found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="relative">
                <Link 
                  href={`/stories/${story.id}`}
                  className={`block rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 bg-gradient-to-br h-[280px] flex flex-col ${themeGradients[story.theme]}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{story.title}</h3>
                  <p className="text-gray-900 leading-snug font-medium flex-grow line-clamp-4">{getSummary(story.content)}</p>
                  <div className="mt-4 text-sm text-gray-700 font-medium">
                    Read more →
                  </div>
                </Link>
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full">
                  <button
                    onClick={() => handleUpvote(story.id)}
                    className={`transition-colors ${
                      upvotedStories.has(story.id)
                        ? 'text-[#2348B1]'
                        : 'text-gray-600 hover:text-[#2348B1]'
                    }`}
                    title="Upvote story"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 7-7 7 7" />
                      <path d="M12 19V5" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-700">{story.votes} votes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

