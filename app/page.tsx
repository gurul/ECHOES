'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Theme, themeGradients } from './utils/themes';

interface Story {
  id: number;
  title: string;
  content: string;
  theme: Theme;
  votes: number;
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
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [upvotedStories, setUpvotedStories] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      setStories(data);
    } catch {
      setError('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (storyId: number) => {
    if (upvotedStories.has(storyId)) return;
    
    try {
      const response = await fetch(`/api/stories/${storyId}/upvote`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to upvote');
      
      const updatedStory = await response.json();
      setStories(stories.map(story => 
        story.id === storyId ? updatedStory : story
      ));
      setUpvotedStories(prev => new Set(prev).add(storyId));
    } catch {
      console.error('Failed to upvote');
    }
  };

  const filteredStories = stories.filter(story => 
    selectedThemes.size === 0 || selectedThemes.has(story.theme)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading stories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Echoes</h1>
          <p className="mt-2 text-gray-600">Share your stories, inspire others</p>
        </div>
      </header>

      {/* Theme Showcase */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Explore Stories by Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(Object.keys(themeGradients) as Theme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  const newThemes = new Set(selectedThemes);
                  if (newThemes.has(theme)) {
                    newThemes.delete(theme);
                  } else {
                    newThemes.add(theme);
                  }
                  setSelectedThemes(newThemes);
                }}
                className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${
                  selectedThemes.has(theme) 
                    ? 'ring-2 ring-[#2348B1] ring-offset-2' 
                    : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${themeGradients[theme]} opacity-50 group-hover:opacity-75 transition-opacity`} />
                <span className="relative text-sm font-medium text-gray-900">{theme}</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedThemes(new Set())}
              className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${
                selectedThemes.size === 0 
                  ? 'ring-2 ring-[#2348B1] ring-offset-2' 
                  : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50 group-hover:opacity-75 transition-opacity" />
              <span className="relative text-sm font-medium text-gray-900">All Stories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {stories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No stories yet. Be the first to share!</div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No stories found for the selected themes.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <path d="m12 19 7-7-7-7" />
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
    </div>
  );
}

