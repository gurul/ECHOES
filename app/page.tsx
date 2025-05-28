'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Theme, themeGradients } from './utils/themes';

interface Story {
  id: number;
  title: string;
  content: string;
  summary?: string;
  theme: Theme;
  votes: number;
  createdAt: string;
}

function GlowingTitle({ text }: { text: string }) {
  return (
    <div className="relative">
      {text.split('').map((letter, index) => (
        <span
          key={index}
          className="inline-block relative"
          style={{
            animationDelay: `${index * 200}ms`,
          }}
        >
          {letter}
          <span 
            className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 blur-md animate-glow-pulse"
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          />
        </span>
      ))}
    </div>
  );
}

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');

  const fetchStories = async (query: string = '') => {
    try {
      setIsLoading(true);
      const url = query ? `/api/stories?q=${encodeURIComponent(query)}` : '/api/stories';
      const response = await fetch(url);
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
    fetchStories(activeSearchQuery);
  }, [activeSearchQuery]);

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2348B1] to-[#1a3a8f] text-white py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in relative">
            <span className="relative inline-block">
              <GlowingTitle text="ECHOES" />
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl animate-pulse-slow"></span>
            </span>
          </h1>
          <div className="text-2xl font-medium mb-4 animate-fade-in relative">
            <span className="relative inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <CountUp end={stories.length} duration={800} /> Stories Shared
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-lg animate-pulse-slow rounded-full"></span>
            </span>
          </div>
          <p className="text-xl text-white/90 mb-8 relative">
            <span className="relative inline-block">
              Voices of the past, conversations for tomorrow
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-lg animate-pulse-slow"></span>
            </span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full px-4 py-3 pl-10 pr-12 rounded-lg text-gray-900 border-2 border-blue-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                disabled={isLoading && activeSearchQuery === searchQuery}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-50 rounded-md transition-colors"
                disabled={isLoading && activeSearchQuery === searchQuery}
              >
                {isLoading && activeSearchQuery === searchQuery ? (
                  <svg 
                    className="w-5 h-5 text-blue-500 animate-spin" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <Link 
              href="/share" 
              className="group relative inline-flex items-center px-8 py-3 text-[#2348B1] hover:text-[#2348B1] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-white backdrop-blur-sm rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
              <span className="relative transform transition-all duration-500 group-hover:translate-x-1 font-medium">Share Your Story</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg"></div>
            </Link>
          </div>
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
                className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 animate-scale-in shadow-lg hover:shadow-xl ${
                  selectedThemes.has(theme) 
                    ? 'ring-4 ring-blue-500 ring-offset-2 bg-blue-500/10' 
                    : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <span className={`relative font-semibold capitalize drop-shadow-md ${
                  selectedThemes.has(theme) ? 'text-white' : 'text-white'
                }`}>
                  {theme}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {activeSearchQuery && (
          <div className="mb-8 text-center">
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {filteredStories.length} {filteredStories.length === 1 ? 'result' : 'results'} for &ldquo;{activeSearchQuery}&rdquo;
            </span>
            {activeSearchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveSearchQuery('');
                }}
                className="ml-2 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
        {stories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            No stories yet. Be the first to share!
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            {activeSearchQuery ? `No stories found matching &ldquo;${activeSearchQuery}&rdquo;` : 'No stories found for the selected themes.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <div 
                key={story.id} 
                className="relative animate-slide-up perspective-1000" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link 
                  href={`/stories/${story.id}`}
                  className={`group block rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 bg-gradient-to-br backdrop-blur-sm h-[280px] flex flex-col transform-gpu hover:scale-105 hover:rotate-y-6 hover:rotate-x-2 ${themeGradients[story.theme]} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="bg-white/90 rounded-lg p-4 flex-grow transform-gpu transition-transform duration-300 group-hover:translate-z-8 relative z-10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 transform-gpu transition-transform duration-300 group-hover:translate-z-4">{story.title}</h3>
                    <p className="text-gray-700 leading-snug font-medium line-clamp-4 transform-gpu transition-transform duration-300 group-hover:translate-z-2">{story.summary || getSummary(story.content)}</p>
                    <div className="mt-4 text-sm font-medium text-gray-900 transform-gpu transition-transform duration-300 group-hover:translate-z-6">
                      Read more →
                    </div>
                  </div>
                </Link>
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md animate-float transform-gpu transition-transform duration-300 group-hover:translate-z-12 z-20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpvote(story.id);
                    }}
                    className={`flex items-center space-x-1 ${
                      upvotedStories.has(story.id) ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        upvotedStories.has(story.id) ? 'scale-110' : ''
                      }`}
                      fill={upvotedStories.has(story.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <span>{story.votes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

