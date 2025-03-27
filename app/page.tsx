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
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [upvotedStories, setUpvotedStories] = useState<Set<number>>(new Set());

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

  useEffect(() => {
    fetchStories();
  }, []);

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
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
            Explore Stories by Theme
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(themeGradients).map(([theme, gradient]) => (
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
                className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 animate-scale-in ${
                  selectedThemes.has(theme) 
                    ? 'ring-2 ring-[#2348B1] ring-offset-2' 
                    : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-75 transition-opacity`} />
                <span className="relative text-gray-900 font-medium capitalize">
                  {theme}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {stories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            No stories yet. Be the first to share!
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            No stories found for the selected themes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <div key={story.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Link 
                  href={`/stories/${story.id}`}
                  className={`block rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 bg-gradient-to-br h-[280px] flex flex-col ${themeGradients[story.theme]}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{story.title}</h3>
                  <p className="text-gray-900 leading-snug font-medium flex-grow line-clamp-4">{getSummary(story.content)}</p>
                  <div className="mt-4 text-sm text-gray-700 font-medium">
                    Read more →
                  </div>
                </Link>
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full animate-float">
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
    </main>
  );
}

